import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const entries = await prisma.lineupEntry.findMany({
    where: { gameId, game: { team: { organization: { ownerId: user.id } } } },
    include: { player: true },
    orderBy: { battingOrder: "asc" },
  });

  return NextResponse.json(entries);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;
  const body = await req.json();

  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  if (!Array.isArray(body.lineup)) {
    return NextResponse.json({ error: "lineup must be an array" }, { status: 400 });
  }

  const playerIds: string[] = body.lineup.map((entry: { playerId: string }) => entry.playerId);
  const onTeam = await prisma.player.count({ where: { id: { in: playerIds }, teamId: game.teamId } });
  if (onTeam !== new Set(playerIds).size) {
    return NextResponse.json({ error: "Lineup has a player who isn't on this team" }, { status: 400 });
  }

  // Replace all lineup entries atomically
  const entries = await prisma.$transaction(async (tx) => {
    await tx.lineupEntry.deleteMany({ where: { gameId } });
    return tx.lineupEntry.createMany({
      data: body.lineup.map(
        (entry: { playerId: string; battingOrder: number; position: string }) => ({
          gameId,
          playerId: entry.playerId,
          battingOrder: entry.battingOrder,
          position: entry.position,
        })
      ),
    });
  });

  return NextResponse.json({ count: entries.count });
}
