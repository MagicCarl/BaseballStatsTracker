import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcBattingStats, calcPitchingStats } from "@/lib/stats";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();

  const { teamId } = await params;
  const { searchParams } = new URL(req.url);

  const seasonId = searchParams.get("seasonId");
  const vsTeam = searchParams.get("vs_team");
  const vsPitcher = searchParams.get("vs_pitcher");
  const vsHand = searchParams.get("vs_hand");
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  const team = await prisma.team.findFirst({
    where: { id: teamId, organization: { ownerId: user.id } },
  });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  // Build at-bat filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const atBatWhere: Record<string, any> = {
    game: { teamId },
  };

  if (seasonId) {
    atBatWhere.game.seasonId = seasonId;
  }
  if (vsTeam) {
    atBatWhere.game.opponentName = { contains: vsTeam, mode: "insensitive" };
  }
  if (fromDate) {
    atBatWhere.game.gameDate = { ...atBatWhere.game.gameDate, gte: new Date(fromDate) };
  }
  if (toDate) {
    atBatWhere.game.gameDate = { ...atBatWhere.game.gameDate, lte: new Date(toDate) };
  }
  if (vsPitcher) {
    atBatWhere.opponentPitcher = { name: { contains: vsPitcher, mode: "insensitive" } };
  }
  if (vsHand) {
    atBatWhere.opponentPitcher = {
      ...atBatWhere.opponentPitcher,
      throwsHand: vsHand.toLowerCase(),
    };
  }

  const players = await prisma.player.findMany({
    where: { teamId, isActive: true },
    orderBy: [{ lastName: "asc" }],
  });

  const playerResults = await Promise.all(
    players.map(async (player: { id: string; firstName: string; lastName: string; jerseyNumber: number | null }) => {
      const atBats = await prisma.atBat.findMany({
        where: { ...atBatWhere, playerId: player.id },
        select: {
          result: true,
          rbi: true,
          stolenBases: true,
          caughtStealing: true,
          runnerScored: true,
          gameId: true,
        },
      });

      const gameIds = [...new Set(atBats.map((ab: { gameId: string }) => ab.gameId))];

      return {
        atBats,
        player: {
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          jerseyNumber: player.jerseyNumber,
        },
        stats: calcBattingStats(atBats, gameIds.length),
      };
    })
  );

  const playerStats = playerResults.map(({ player, stats }) => ({ player, stats }));

  // Team totals run the same formulas over every at-bat, so rate stats are
  // weighted correctly instead of averaged across players.
  // That includes players who have since been removed from the roster.
  const allTeamAtBats = await prisma.atBat.findMany({
    where: { ...atBatWhere, playerId: { not: null } },
    select: { result: true, rbi: true, stolenBases: true, caughtStealing: true, runnerScored: true, gameId: true },
  });
  const teamTotals = calcBattingStats(
    allTeamAtBats,
    new Set(allTeamAtBats.map((ab) => ab.gameId)).size
  );

  // Pitching uses the same game filters as batting (pitcher-based filters
  // only apply to our hitters, so they're ignored here).
  const pitchingAppearances = await prisma.pitchingAppearance.findMany({
    where: { game: atBatWhere.game, player: { isActive: true } },
    select: {
      gameId: true,
      playerId: true,
      outsRecorded: true,
      hitsAllowed: true,
      runsAllowed: true,
      earnedRuns: true,
      walks: true,
      strikeouts: true,
      homeRunsAllowed: true,
      pitchesThrown: true,
    },
  });

  const pitchingStats = players
    .map((player: { id: string; firstName: string; lastName: string; jerseyNumber: number | null }) => {
      const apps = pitchingAppearances.filter((a) => a.playerId === player.id);
      if (apps.length === 0) return null;
      return {
        player: {
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          jerseyNumber: player.jerseyNumber,
        },
        stats: calcPitchingStats(apps, team.defaultInnings),
      };
    })
    .filter((ps) => ps !== null);

  // Team record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gameWhere: Record<string, any> = { teamId, status: "final" };
  if (seasonId) gameWhere.seasonId = seasonId;

  const games = await prisma.game.findMany({
    where: gameWhere,
    select: { ourScore: true, opponentScore: true },
  });

  const runsFor = games.reduce((sum: number, g: { ourScore: number }) => sum + g.ourScore, 0);
  const runsAgainst = games.reduce((sum: number, g: { opponentScore: number }) => sum + g.opponentScore, 0);

  const wins = games.filter((g: { ourScore: number; opponentScore: number }) => g.ourScore > g.opponentScore).length;
  const losses = games.filter((g: { ourScore: number; opponentScore: number }) => g.ourScore < g.opponentScore).length;
  const ties = games.filter((g: { ourScore: number; opponentScore: number }) => g.ourScore === g.opponentScore).length;

  return NextResponse.json({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    playerStats: playerStats.filter((ps: any) => ps.stats.plateAppearances > 0),
    teamTotals,
    pitchingStats,
    inningsPerGame: team.defaultInnings,
    record: { wins, losses, ties, games: games.length, runsFor, runsAgainst },
  });
}
