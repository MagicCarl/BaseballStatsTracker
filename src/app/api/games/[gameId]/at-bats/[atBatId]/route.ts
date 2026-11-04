import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALL_RESULTS } from "@/lib/constants";
import {
  BATTER,
  EMPTY_BASES,
  RunnerMoves,
  checkMoves,
  defaultMoves,
  normalizeRuns,
  replayPlays,
  runsInMoves,
} from "@/lib/game-state";
import { lastPlay, loadPlays, lockGame, syncGameState } from "@/lib/game-sync";
import { getOutsProduced } from "@/lib/stats";
import { z } from "zod/v4";

const patchAtBatSchema = z.object({
  result: z.enum(ALL_RESULTS).optional(),
  rbi: z.number().int().min(0).max(4).optional(),
  runnerMoves: z
    .record(z.string().max(64), z.union([z.literal(1), z.literal(2), z.literal(3), z.literal("home"), z.literal("out")]))
    .optional(),
  // At-bats saved before runners were tracked keep these as plain numbers.
  stolenBases: z.number().int().min(0).max(3).optional(),
  caughtStealing: z.number().int().min(0).max(3).optional(),
  runsScored: z.number().int().min(0).max(4).optional(),
  runnerScored: z.boolean().optional(),
});

class PlayRejected extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const rejected = (e: unknown) => {
  if (e instanceof PlayRejected) return NextResponse.json({ error: e.message }, { status: e.status });
  throw e;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; atBatId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId, atBatId } = await params;
  const parsed = patchAtBatSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const body = parsed.data;

  const owned = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!owned) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const game = await lockGame(tx, gameId);
      if (game.status === "final") throw new PlayRejected("This game has ended", 409);

      const existing = await tx.atBat.findFirst({ where: { id: atBatId, gameId } });
      if (!existing) throw new PlayRejected("At-bat not found", 404);

      const result = body.result ?? existing.result;
      const { plays } = await loadPlays(tx, gameId);
      const isLatest = lastPlay(plays)?.id === atBatId;
      let moves = existing.runnerMoves as RunnerMoves | null;

      if (moves) {
        if (body.runnerMoves) {
          // Later plays depend on where this one left the runners.
          if (!isLatest) throw new PlayRejected("Undo back to this play to change its runners", 409);
          const before = plays.filter((p) => p.id !== atBatId);
          if (body.runnerMoves[BATTER] === undefined || checkMoves(body.runnerMoves, replayPlays(before).bases, true)) {
            throw new PlayRejected("Those runner moves don't match who's on base", 400);
          }
          moves = body.runnerMoves;
        } else if (body.result && body.result !== existing.result && !isLatest) {
          // An earlier result can only change if it fits where the batter ended up.
          const usuallyOut = defaultMoves(result, EMPTY_BASES, 0)[BATTER] === "out";
          if (usuallyOut !== (moves[BATTER] === "out")) {
            throw new PlayRejected("Undo back to this play to change that result", 409);
          }
        }
        if (result === "home_run" && moves[BATTER] !== "home") {
          throw new PlayRejected("A home run has to score the batter", 400);
        }
        await tx.atBat.update({
          where: { id: atBatId },
          data: {
            result,
            runnerMoves: moves,
            rbi: Math.min(body.rbi ?? existing.rbi, runsInMoves(moves)),
          },
        });
      } else {
        // Saved before runners were tracked. Changing its outs would shift any tracked plays after it.
        const laterTracked = plays.some((p) => p.sequence > existing.atBatNumberInGame && p.runnerMoves);
        if (laterTracked && getOutsProduced(result) !== getOutsProduced(existing.result)) {
          throw new PlayRejected("Undo back to this play to change that result", 409);
        }
        await tx.atBat.update({
          where: { id: atBatId },
          data: {
            result,
            stolenBases: body.stolenBases,
            caughtStealing: body.caughtStealing,
            ...normalizeRuns({
              result,
              rbi: body.rbi ?? existing.rbi,
              runsScored: body.runsScored ?? existing.runsScored,
              runnerScored: body.runnerScored ?? existing.runnerScored,
            }),
          },
        });
      }
      await syncGameState(tx, gameId);
    });
  } catch (e) {
    return rejected(e);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; atBatId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId, atBatId } = await params;

  const owned = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!owned) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const game = await lockGame(tx, gameId);
      if (game.status === "final") throw new PlayRejected("This game has ended", 409);

      const { plays } = await loadPlays(tx, gameId);
      if (!plays.some((p) => p.id === atBatId && p.kind === "at_bat")) {
        throw new PlayRejected("At-bat not found", 404);
      }
      if (lastPlay(plays)?.id !== atBatId) {
        throw new PlayRejected("Only the latest play can be undone", 409);
      }

      await tx.atBat.delete({ where: { id: atBatId } });
      await syncGameState(tx, gameId);
    });
  } catch (e) {
    return rejected(e);
  }

  return NextResponse.json({ success: true });
}
