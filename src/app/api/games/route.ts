import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trackServerEvent } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");
  const seasonId = searchParams.get("seasonId");

  if (!teamId) {
    return NextResponse.json({ error: "teamId required" }, { status: 400 });
  }

  const where: Record<string, unknown> = {
    teamId,
    team: { organization: { ownerId: user.id } },
  };
  if (seasonId) where.seasonId = seasonId;

  const games = await prisma.game.findMany({
    where,
    orderBy: { gameDate: "desc" },
  });

  return NextResponse.json(games);
}

// Free accounts may fully create and score this many games before a purchase
// is required. The first game is a real, complete trial of the product.
const FREE_GAME_LIMIT = 1;

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  if (!user.isPaid) {
    const gamesCreated = await prisma.game.count({
      where: { team: { organization: { ownerId: user.id } } },
    });
    if (gamesCreated >= FREE_GAME_LIMIT) {
      return NextResponse.json(
        {
          error: "You've used your free game. Purchase to create more.",
          code: "FREE_LIMIT_REACHED",
        },
        { status: 403 }
      );
    }
  }

  const body = await req.json();

  if (!body.teamId || !body.opponentName?.trim() || !body.gameDate) {
    return NextResponse.json(
      { error: "teamId, opponentName, and gameDate are required" },
      { status: 400 }
    );
  }

  const team = await prisma.team.findFirst({
    where: { id: body.teamId, organization: { ownerId: user.id } },
  });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  if (body.seasonId) {
    const season = await prisma.season.findFirst({ where: { id: body.seasonId, teamId: body.teamId } });
    if (!season) {
      return NextResponse.json({ error: "Season not found for this team" }, { status: 400 });
    }
  }

  const game = await prisma.game.create({
    data: {
      teamId: body.teamId,
      seasonId: body.seasonId || null,
      opponentName: body.opponentName.trim(),
      gameDate: new Date(body.gameDate),
      gameTime: body.gameTime || null,
      location: body.location || null,
      isHome: body.isHome ?? true,
      inningsCount: body.inningsCount ?? team.defaultInnings,
    },
  });

  trackServerEvent("GAME_CREATED", user.id, {
    gameId: game.id,
    teamId: game.teamId,
  });

  return NextResponse.json(game, { status: 201 });
}
