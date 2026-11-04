import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { buildPlays, replayPlays } from "@/lib/game-state";

// Runs the real routes against a throwaway database. It only runs when
// SCORING_TEST_DB is set, and refuses anything that isn't on localhost.
const dbUrl = process.env.SCORING_TEST_DB;
if (dbUrl && !dbUrl.includes("@localhost")) throw new Error("SCORING_TEST_DB must be a local database");
if (dbUrl) process.env.DATABASE_URL = dbUrl;

const authed = vi.hoisted(() => ({ userId: "" }));
vi.mock("@/lib/auth", () => ({
  getAuthUser: async () => (authed.userId ? { id: authed.userId } : null),
  unauthorized: () => Response.json({ error: "Unauthorized" }, { status: 401 }),
}));
vi.mock("@/lib/analytics", () => ({ trackServerEvent: () => {} }));

describe.skipIf(!dbUrl)("a full game through the real routes", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let atBats: typeof import("./[gameId]/at-bats/route");
  let atBat: typeof import("./[gameId]/at-bats/[atBatId]/route");
  let gameRoute: typeof import("./[gameId]/route");
  let lineup: typeof import("./[gameId]/lineup/route");
  let share: typeof import("./[gameId]/share/route");
  let watch: typeof import("@/app/api/watch/[token]/route");
  let stats: typeof import("@/app/api/teams/[teamId]/stats/route");

  const ids = { team: "", game: "", a: "", b: "", c: "", opp: "", foreign: "" };
  const url = "http://localhost/api";
  const req = (method: string, body?: unknown) =>
    new NextRequest(url, { method, body: body === undefined ? undefined : JSON.stringify(body) });
  const gp = () => ({ params: Promise.resolve({ gameId: ids.game }) });
  const abp = (atBatId: string) => ({ params: Promise.resolve({ gameId: ids.game, atBatId }) });
  const us = (playerId: string, result: string, more: object = {}) =>
    atBats.POST(req("POST", { playerId, result, ...more }), gp());
  const them = (result: string, more: object = {}) =>
    atBats.POST(req("POST", { opponentBatterId: ids.opp, result, ...more }), gp());
  const state = () => prisma.game.findUniqueOrThrow({ where: { id: ids.game } });

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    atBats = await import("./[gameId]/at-bats/route");
    atBat = await import("./[gameId]/at-bats/[atBatId]/route");
    gameRoute = await import("./[gameId]/route");
    lineup = await import("./[gameId]/lineup/route");
    share = await import("./[gameId]/share/route");
    watch = await import("@/app/api/watch/[token]/route");
    stats = await import("@/app/api/teams/[teamId]/stats/route");

    const tag = Date.now().toString(36);
    const user = await prisma.user.create({ data: { firebaseUid: tag, email: `${tag}@example.test`, displayName: "Coach" } });
    const org = await prisma.organization.create({ data: { name: "Org", ownerId: user.id } });
    const team = await prisma.team.create({ data: { name: "Tigers", organizationId: org.id, defaultInnings: 6 } });
    const other = await prisma.team.create({ data: { name: "Other", organizationId: org.id } });
    const mk = (firstName: string, teamId = team.id) => prisma.player.create({ data: { firstName, lastName: "Test", teamId } });
    const [a, b, c, foreign] = await Promise.all([mk("Ann"), mk("Bea"), mk("Cat"), mk("Far", other.id)]);
    const game = await prisma.game.create({ data: { teamId: team.id, opponentName: "Bears", gameDate: new Date(), isHome: true } });
    const opp = await prisma.opponentBatter.create({ data: { gameId: game.id, name: "Opp One" } });
    Object.assign(ids, { team: team.id, game: game.id, a: a.id, b: b.id, c: c.id, opp: opp.id, foreign: foreign.id });
    authed.userId = user.id;
  });

  const out = { batter: "out" as const };
  const basesNow = async () => {
    const [atBats, basePlays] = await Promise.all([
      prisma.atBat.findMany({ where: { gameId: ids.game } }),
      prisma.basePlay.findMany({ where: { gameId: ids.game } }),
    ]);
    return replayPlays(buildPlays(atBats, basePlays)).bases;
  };
  const baseRoute = async () => await import("./[gameId]/base-plays/route");
  const basePlayDelete = async () => await import("./[gameId]/base-plays/[playId]/route");
  let annAtBat = "";
  let beaAtBat = "";

  it("the wrong team can't bat, and the top half can be played", async () => {
    // Our team is home in this game, so the opponent bats first.
    expect((await us(ids.a, "single", { runnerMoves: { batter: 1 } })).status).toBe(409);
    await them("groundout", { runnerMoves: out });
    await them("flyout", { runnerMoves: out });
    await them("popout", { runnerMoves: out });
    const s = await state();
    expect([s.currentInning, s.isTopOfInning, s.outsInCurrentInning]).toEqual([1, false, 0]);
  });

  it("follows a runner from first to home and credits who scored", async () => {
    annAtBat = (await (await us(ids.a, "single", { runnerMoves: { batter: 1 } })).json()).id;
    expect(await basesNow()).toMatchObject({ 1: annAtBat, 2: null, 3: null });

    beaAtBat = (await (await us(ids.b, "double", { runnerMoves: { batter: 2, [annAtBat]: 3 } })).json()).id;
    expect(await basesNow()).toMatchObject({ 1: null, 2: beaAtBat, 3: annAtBat });

    const cat = await (await us(ids.c, "single", { runnerMoves: { batter: 1, [annAtBat]: "home", [beaAtBat]: 3 } })).json();
    expect((await state()).ourScore).toBe(1);
    expect(cat.rbi).toBe(1);
    const ann = await prisma.atBat.findUniqueOrThrow({ where: { id: annAtBat } });
    expect(ann.runnerScored).toBe(true);
    const saved = await prisma.atBat.findUniqueOrThrow({ where: { id: cat.id } });
    expect([saved.runsScored, saved.runnerScored]).toEqual([1, false]);
  });

  it("a three-run home run clears the bases and scores everyone", async () => {
    const bases = await basesNow();
    const res = await us(ids.a, "home_run", {
      runnerMoves: { batter: "home", [bases[1] as string]: "home", [bases[3] as string]: "home" },
    });
    expect(res.status).toBe(201);
    const s = await state();
    expect(s.ourScore).toBe(4);
    expect(await basesNow()).toEqual({ 1: null, 2: null, 3: null });
    const scoredRows = await prisma.atBat.count({ where: { gameId: ids.game, runnerScored: true } });
    expect(scoredRows).toBe(4);
  });

  it("rejects moves that don't match who's on base", async () => {
    expect((await us(ids.b, "single", { runnerMoves: { batter: 1, ghost: "home" } })).status).toBe(400);
    expect((await us(ids.b, "home_run", { runnerMoves: { batter: 1 } })).status).toBe(400);
    expect((await us(ids.b, "single", { runnerMoves: {} })).status).toBe(400);
    expect((await state()).ourScore).toBe(4);
  });

  it("a steal between at-bats moves the runner, and the same batter stays up", async () => {
    const { POST } = await baseRoute();
    const runner = (await (await us(ids.b, "walk", { runnerMoves: { batter: 1 } })).json()).id;
    const steal = await POST(req("POST", { type: "stolen_base", runnerMoves: { [runner]: 2 } }), gp());
    expect(steal.status).toBe(201);
    expect((await basesNow())[2]).toBe(runner);
    expect((await prisma.atBat.findUniqueOrThrow({ where: { id: runner } })).stolenBases).toBe(1);

    const wild = await (await POST(req("POST", { type: "wild_pitch", runnerMoves: { [runner]: 3 } }), gp())).json();
    expect((await basesNow())[3]).toBe(runner);

    const stealHome = await (await POST(req("POST", { type: "stolen_base", runnerMoves: { [runner]: "home" } }), gp())).json();
    expect((await state()).ourScore).toBe(5);
    expect((await prisma.atBat.findUniqueOrThrow({ where: { id: runner } })).runnerScored).toBe(true);
    expect((await prisma.atBat.findUniqueOrThrow({ where: { id: runner } })).stolenBases).toBe(2);

    // Undo takes the run and the credit back, latest first.
    const { DELETE } = await basePlayDelete();
    const del = (playId: string) => DELETE(req("DELETE"), { params: Promise.resolve({ gameId: ids.game, playId }) });
    expect((await del(wild.id)).status).toBe(409);
    expect((await del(stealHome.id)).status).toBe(200);
    expect((await state()).ourScore).toBe(4);
    expect((await prisma.atBat.findUniqueOrThrow({ where: { id: runner } })).runnerScored).toBe(false);
    expect((await basesNow())[3]).toBe(runner);
  });

  it("caught stealing is an out, and the third out clears the bases", async () => {
    const { POST } = await baseRoute();
    const bases = await basesNow();
    const res = await POST(req("POST", { type: "caught_stealing", runnerMoves: { [bases[3] as string]: "out" } }), gp());
    expect(res.status).toBe(201);
    expect((await state()).outsInCurrentInning).toBe(1);

    const onFirst = (await (await us(ids.c, "single", { runnerMoves: { batter: 1 } })).json()).id;
    await us(ids.a, "double_play", { runnerMoves: { batter: "out", [onFirst]: "out" } });
    const s = await state();
    expect([s.currentInning, s.isTopOfInning, s.outsInCurrentInning]).toEqual([2, true, 0]);
    expect(await basesNow()).toEqual({ 1: null, 2: null, 3: null });
  });

  it("the opponent's runs go to the opponent and pitches save with the at-bat", async () => {
    const res = await them("home_run", {
      runnerMoves: { batter: "home" },
      pitches: [{ result: "ball" }, { result: "in_play", locationX: 0.5, locationY: 0.5 }],
    });
    const ab = await res.json();
    const saved = await prisma.atBat.findUniqueOrThrow({ where: { id: ab.id }, include: { pitches: true } });
    expect(saved.pitches.map((p) => p.pitchNumber).sort()).toEqual([1, 2]);
    expect(saved.pitchCount).toBe(2);
    expect((await state()).opponentScore).toBe(1);
  });

  it("a lost response can't save the same play twice", async () => {
    const id = "retry-" + Date.now();
    const first = await them("single", { id, runnerMoves: { batter: 1 } });
    const retry = await them("single", { id, runnerMoves: { batter: 1 } });
    expect([first.status, retry.status]).toEqual([201, 200]);
    expect(await prisma.atBat.count({ where: { id } })).toBe(1);
    expect((await basesNow())[1]).toBe(id);
  });

  it("two saves at once both count, on different plays", async () => {
    await Promise.all([them("single", { runnerMoves: { batter: 2 } }).catch(() => null), them("lineout", { runnerMoves: out })]);
    const numbers = (await prisma.atBat.findMany({ where: { gameId: ids.game } })).map((a) => a.atBatNumberInGame);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("only the latest play can change its runners, and undo restores the bases", async () => {
    const before = await basesNow();
    const latest = await prisma.atBat.findFirstOrThrow({ where: { gameId: ids.game }, orderBy: { atBatNumberInGame: "desc" } });
    const older = await prisma.atBat.findUniqueOrThrow({ where: { id: annAtBat } });
    expect((await atBat.PATCH(req("PATCH", { runnerMoves: { batter: 2 } }), abp(older.id))).status).toBe(409);
    expect((await atBat.DELETE(req("DELETE"), abp(older.id))).status).toBe(409);
    expect((await atBat.PATCH(req("PATCH", { result: "groundout" }), abp(older.id))).status).toBe(409);
    expect((await atBat.PATCH(req("PATCH", { result: "triple" }), abp(older.id))).status).toBe(200);
    const fixed = await prisma.atBat.findUniqueOrThrow({ where: { id: older.id } });
    expect(fixed.result).toBe("triple");

    expect((await atBat.DELETE(req("DELETE"), abp(latest.id))).status).toBe(200);
    expect(await basesNow()).not.toBe(before);
  });

  it("ending a half adds runs for a team not scored batter by batter", async () => {
    const { POST } = await baseRoute();
    const before = await state();
    const res = await POST(req("POST", { type: "end_half", extraRuns: 2 }), gp());
    expect(res.status).toBe(201);
    const s = await state();
    expect(s.opponentScore).toBe(before.opponentScore + 2);
    expect([s.currentInning, s.isTopOfInning, s.outsInCurrentInning]).toEqual([2, false, 0]);
    expect(await basesNow()).toEqual({ 1: null, 2: null, 3: null });
  });

  it("a screen still open from before this update still scores", async () => {
    const before = (await state()).ourScore;
    await us(ids.a, "home_run");
    expect((await state()).ourScore).toBe(before + 1);
    await us(ids.b, "single", { rbi: 1 });
    expect((await state()).ourScore).toBe(before + 2);
  });

  it("rejects bad at-bats without changing the game", async () => {
    const before = await state();
    expect((await us(ids.a, "not_a_result")).status).toBe(400);
    expect((await us(ids.foreign, "single")).status).toBe(400);
    expect((await us(ids.a, "single", { rbi: -1 })).status).toBe(400);
    expect((await atBats.POST(req("POST", { result: "single" }), gp())).status).toBe(400);
    expect((await atBats.POST(req("POST", { playerId: ids.a, opponentBatterId: ids.opp, result: "single" }), gp())).status).toBe(400);
    const after = await state();
    expect([after.ourScore, after.opponentScore, after.outsInCurrentInning]).toEqual([before.ourScore, before.opponentScore, before.outsInCurrentInning]);
  });

  it("a lineup can't include another team's player", async () => {
    const bad = [{ playerId: ids.foreign, battingOrder: 1, position: "P" }];
    expect((await lineup.PUT(req("PUT", { lineup: bad }), gp())).status).toBe(400);
    const good = [ids.a, ids.b, ids.c].map((playerId, i) => ({ playerId, battingOrder: i + 1, position: "DH" }));
    expect((await lineup.PUT(req("PUT", { lineup: good }), gp())).status).toBe(200);
  });

  it("the family watch page gets the runners and the same runs", async () => {
    const { shareToken } = await (await share.POST(req("POST"), gp())).json();
    const res = await watch.GET(req("GET"), { params: Promise.resolve({ token: shareToken }) });
    const game = await res.json();
    expect(replayPlays(buildPlays(game.atBats, game.basePlays)).state.ourScore).toBe(game.ourScore);
    expect(replayPlays(buildPlays(game.atBats, game.basePlays)).state.opponentScore).toBe(game.opponentScore);
  });

  it("End Game works, locks scoring, counts in the record, and can be reopened", async () => {
    const final = await state();
    const end = await gameRoute.PUT(req("PUT", { status: "final" }), gp());
    expect(end.status).toBe(200);
    expect((await state()).status).toBe("final");

    const ab = await prisma.atBat.findFirstOrThrow({ where: { gameId: ids.game }, orderBy: { atBatNumberInGame: "desc" } });
    expect((await us(ids.a, "single", { runnerMoves: { batter: 1 } })).status).toBe(409);
    expect((await atBat.PATCH(req("PATCH", { rbi: 0 }), abp(ab.id))).status).toBe(409);
    expect((await atBat.DELETE(req("DELETE"), abp(ab.id))).status).toBe(409);

    const res = await stats.GET(new NextRequest(`${url}/teams/${ids.team}/stats`), { params: Promise.resolve({ teamId: ids.team }) });
    const { record, teamTotals } = await res.json();
    expect(record).toMatchObject({ games: 1, runsFor: final.ourScore, runsAgainst: final.opponentScore });
    expect(teamTotals.runs).toBeGreaterThan(0);

    expect((await gameRoute.PUT(req("PUT", { status: "in_progress" }), gp())).status).toBe(200);
  });

  it("another coach can't touch this game", async () => {
    const owner = authed.userId;
    authed.userId = "someone-else";
    expect((await us(ids.a, "single")).status).toBe(404);
    expect((await gameRoute.PUT(req("PUT", { status: "final" }), gp())).status).toBe(404);
    authed.userId = owner;
  });
});
