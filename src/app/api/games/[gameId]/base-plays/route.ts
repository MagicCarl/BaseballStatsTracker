import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BASE_PLAY_TYPES, BATTER, RunnerMoves, checkMoves, replayPlays, weAreBatting } from "@/lib/game-state";
import { loadPlays, lockGame, nextSequence, syncGameState } from "@/lib/game-sync";
import { z } from "zod/v4";

const createBasePlaySchema = z.object({
  id: z.string().min(8).max(64).optional(),
  type: z.enum([...BASE_PLAY_TYPES, "end_half"]),
  runnerMoves: z
    .record(z.string().max(64), z.union([z.literal(1), z.literal(2), z.literal(3), z.literal("home"), z.literal("out")]))
    .default({}),
  // Runs for a half that wasn't scored batter by batter.
  extraRuns: z.number().int().min(0).max(99).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;
  const parsed = createBasePlaySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const body = parsed.data;
  const moves = body.runnerMoves as RunnerMoves;

  const owned = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!owned) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (body.id) {
    const saved = await prisma.basePlay.findFirst({ where: { id: body.id, gameId } });
    if (saved) return NextResponse.json(saved, { status: 200 });
  }

  const outcome = await prisma.$transaction(async (tx) => {
    const game = await lockGame(tx, gameId);
    if (game.status === "final") return { error: "This game has ended", status: 409 };

    const { plays } = await loadPlays(tx, gameId);
    const { bases } = replayPlays(plays);
    const isEndHalf = body.type === "end_half";

    if (isEndHalf ? Object.keys(moves).length > 0 : Object.keys(moves).length === 0) {
      return { error: "Those runner moves don't match this play", status: 400 };
    }
    if (moves[BATTER] !== undefined || checkMoves(moves, bases, false)) {
      return { error: "Those runner moves don't match who's on base", status: 400 };
    }

    const created = await tx.basePlay.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        gameId,
        sequence: nextSequence(plays),
        inning: game.currentInning,
        isTop: game.isTopOfInning,
        isOurTeam: weAreBatting(game.isHome, game.isTopOfInning),
        type: body.type,
        runnerMoves: moves,
        extraOuts: isEndHalf ? 3 - game.outsInCurrentInning : 0,
        extraRuns: isEndHalf ? body.extraRuns ?? 0 : 0,
      },
    });

    await syncGameState(tx, gameId);
    await tx.game.update({ where: { id: gameId }, data: { status: "in_progress" } });
    return { created };
  });

  if ("error" in outcome) {
    return NextResponse.json({ error: outcome.error }, { status: outcome.status });
  }
  return NextResponse.json(outcome.created, { status: 201 });
}
