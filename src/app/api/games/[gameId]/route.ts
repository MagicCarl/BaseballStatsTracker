import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const updateGameSchema = z.object({
  status: z.enum(["scheduled", "in_progress", "final", "completed", "cancelled"]).optional(),
  ourScore: z.number().int().min(0).optional(),
  opponentScore: z.number().int().min(0).optional(),
  currentInning: z.number().int().min(1).optional(),
  isTopOfInning: z.boolean().optional(),
  isHome: z.boolean().optional(),
  outsInCurrentInning: z.number().int().min(0).max(3).optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const game = await prisma.game.findFirst({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
    include: {
      team: { select: { name: true } },
      lineupEntries: {
        include: { player: true },
        orderBy: { battingOrder: "asc" },
      },
      atBats: {
        include: {
          player: true,
          opponentBatter: true,
          opponentPitcher: true,
          pitches: { orderBy: { pitchNumber: "asc" } },
        },
        orderBy: { atBatNumberInGame: "asc" },
      },
      pitchingAppearances: {
        include: { player: true },
        orderBy: { appearanceOrder: "asc" },
      },
      opponentPitchers: {
        orderBy: { orderInGame: "asc" },
      },
      opponentBatters: {
        orderBy: { orderInGame: "asc" },
      },
      basePlays: {
        orderBy: { sequence: "asc" },
      },
    },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(game, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;
  const parsed = updateGameSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const body = parsed.data;

  const result = await prisma.game.updateMany({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
    data: {
      status: body.status,
      ourScore: body.ourScore,
      opponentScore: body.opponentScore,
      currentInning: body.currentInning,
      isTopOfInning: body.isTopOfInning,
      isHome: body.isHome,
      outsInCurrentInning: body.outsInCurrentInning,
      notes: body.notes,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { gameId } = await params;

  const result = await prisma.game.deleteMany({
    where: { id: gameId, team: { organization: { ownerId: user.id } } },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
