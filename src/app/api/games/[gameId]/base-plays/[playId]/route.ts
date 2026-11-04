import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { lastPlay, loadPlays, lockGame, syncGameState } from "@/lib/game-sync";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string; playId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId, playId } = await params;

  const owned = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!owned) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const problem = await prisma.$transaction(async (tx) => {
    const game = await lockGame(tx, gameId);
    if (game.status === "final") return { error: "This game has ended", status: 409 };

    const { plays } = await loadPlays(tx, gameId);
    if (!plays.some((p) => p.id === playId && p.kind === "base_play")) {
      return { error: "Play not found", status: 404 };
    }
    if (lastPlay(plays)?.id !== playId) {
      return { error: "Only the latest play can be undone", status: 409 };
    }

    await tx.basePlay.delete({ where: { id: playId } });
    await syncGameState(tx, gameId);
    return null;
  });

  if (problem) return NextResponse.json({ error: problem.error }, { status: problem.status });
  return NextResponse.json({ success: true });
}
