import { describe, it, expect } from "vitest";
import {
  BATTER,
  Bases,
  EMPTY_BASES,
  ReplayPlay,
  RunnerMoves,
  checkMoves,
  defaultBasePlayMoves,
  defaultMoves,
  defaultRbi,
  gameLooksOver,
  nextBatterIndex,
  normalizeRuns,
  pitchCount,
  replayPlays,
  resultFromPitches,
  runsInMoves,
  setRunnerMove,
} from "./game-state";
import { buildBoxScore } from "./box-score";
import { calcBattingStats } from "./stats";

const loaded: Bases = { 1: "r1", 2: "r2", 3: "r3" };
const onFirst: Bases = { ...EMPTY_BASES, 1: "r1" };

describe("defaultMoves", () => {
  it("a single moves the batter to first and everyone up one", () => {
    expect(defaultMoves("single", loaded, 0)).toEqual({ [BATTER]: 1, r1: 2, r2: 3, r3: "home" });
  });
  it("a double moves everyone up two", () => {
    expect(defaultMoves("double", loaded, 0)).toEqual({ [BATTER]: 2, r1: 3, r2: "home", r3: "home" });
  });
  it("a grand slam scores four", () => {
    const moves = defaultMoves("home_run", loaded, 0);
    expect(runsInMoves(moves)).toBe(4);
    expect(defaultRbi("home_run", moves)).toBe(4);
  });
  it("a solo home run scores the batter", () => {
    expect(defaultMoves("home_run", EMPTY_BASES, 2)).toEqual({ [BATTER]: "home" });
  });
  it("a walk only moves forced runners", () => {
    expect(defaultMoves("walk", { ...EMPTY_BASES, 2: "r2" }, 0)).toEqual({ [BATTER]: 1 });
    expect(defaultMoves("walk", { 1: "r1", 2: null, 3: "r3" }, 0)).toEqual({ [BATTER]: 1, r1: 2 });
    expect(defaultMoves("walk", loaded, 0)).toEqual({ [BATTER]: 1, r1: 2, r2: 3, r3: "home" });
  });
  it("a fielder's choice takes the force at second", () => {
    expect(defaultMoves("fielders_choice", onFirst, 0)).toEqual({ [BATTER]: 1, r1: "out" });
  });
  it("a double play gets the batter and the runner", () => {
    expect(defaultMoves("double_play", onFirst, 0)).toEqual({ [BATTER]: "out", r1: "out" });
  });
  it("a sacrifice fly scores the runner from third", () => {
    expect(defaultMoves("sacrifice_fly", { ...EMPTY_BASES, 3: "r3" }, 0)).toEqual({ [BATTER]: "out", r3: "home" });
  });
  it("no run counts by default when the play makes the third out", () => {
    expect(runsInMoves(defaultMoves("sacrifice_bunt", { ...EMPTY_BASES, 3: "r3" }, 2))).toBe(0);
    expect(runsInMoves(defaultMoves("sacrifice_fly", { ...EMPTY_BASES, 3: "r3" }, 2))).toBe(0);
  });
  it("a run on an error earns no RBI", () => {
    const moves = defaultMoves("error", { ...EMPTY_BASES, 3: "r3" }, 0);
    expect(runsInMoves(moves)).toBe(1);
    expect(defaultRbi("error", moves)).toBe(0);
  });
});

describe("setRunnerMove and checkMoves", () => {
  it("sending the batter to second pushes the runner along", () => {
    const moves = setRunnerMove({ [BATTER]: 1, r1: 2 }, onFirst, BATTER, 2);
    expect(moves).toEqual({ [BATTER]: 2, r1: 3 });
    expect(checkMoves(moves, onFirst, true)).toBeNull();
  });
  it("catches two runners on one base", () => {
    expect(checkMoves({ [BATTER]: 1 }, onFirst, true)).toBe("same_base");
  });
  it("catches a runner going backward", () => {
    expect(checkMoves({ r2: 1 }, { ...EMPTY_BASES, 2: "r2" }, false)).toBe("backward");
  });
  it("catches a runner who isn't on base", () => {
    expect(checkMoves({ ghost: 2 }, onFirst, false)).toBe("unknown_runner");
  });
});

describe("defaultBasePlayMoves", () => {
  it("a steal moves only that runner, and a wild pitch moves everyone", () => {
    expect(defaultBasePlayMoves("stolen_base", onFirst, "r1")).toEqual({ r1: 2 });
    expect(defaultBasePlayMoves("wild_pitch", loaded, null)).toEqual({ r1: 2, r2: 3, r3: "home" });
  });
  it("caught stealing and pickoffs are outs", () => {
    expect(defaultBasePlayMoves("caught_stealing", onFirst, "r1")).toEqual({ r1: "out" });
    expect(defaultBasePlayMoves("picked_off", onFirst, "r1")).toEqual({ r1: "out" });
  });
});

const atBat = (id: string, sequence: number, runnerMoves: RunnerMoves, isOurTeam = true): ReplayPlay => ({
  id, kind: "at_bat", sequence, isOurTeam, runnerMoves,
});
const basePlay = (id: string, sequence: number, type: string, runnerMoves: RunnerMoves): ReplayPlay => ({
  id, kind: "base_play", sequence, isOurTeam: true, runnerMoves, type,
});

describe("replayPlays", () => {
  it("follows runners around the bases and credits who scored", () => {
    const r = replayPlays([
      atBat("a", 1, { [BATTER]: 1 }),
      atBat("b", 2, { [BATTER]: 2, a: 3 }),
      atBat("c", 3, { [BATTER]: 1, a: "home", b: 3 }),
    ]);
    expect(r.bases).toEqual({ 1: "c", 2: null, 3: "b" });
    expect(r.state.ourScore).toBe(1);
    expect(r.runsByPlay).toMatchObject({ a: 0, b: 0, c: 1 });
    expect([...r.scored]).toEqual(["a"]);
  });

  it("a home run scores the batter too", () => {
    const r = replayPlays([atBat("a", 1, { [BATTER]: 1 }), atBat("b", 2, { [BATTER]: "home", a: "home" })]);
    expect(r.state.ourScore).toBe(2);
    expect([...r.scored].sort()).toEqual(["a", "b"]);
    expect(r.bases).toEqual(EMPTY_BASES);
  });

  it("the third out ends the half and clears the bases", () => {
    const out = (id: string, seq: number) => atBat(id, seq, { [BATTER]: "out" });
    const r = replayPlays([atBat("a", 1, { [BATTER]: 1 }), out("b", 2), out("c", 3), out("d", 4)]);
    expect(r.bases).toEqual(EMPTY_BASES);
    expect(r.state).toMatchObject({ currentInning: 1, isTopOfInning: false, outsInCurrentInning: 0 });
  });

  it("the bottom's third out starts the next inning", () => {
    const out = (id: string, seq: number) => atBat(id, seq, { [BATTER]: "out" });
    const r = replayPlays(["a", "b", "c", "d", "e", "f"].map((id, i) => out(id, i + 1)));
    expect(r.state).toMatchObject({ currentInning: 2, isTopOfInning: true });
  });

  it("a steal between at-bats moves the runner and credits the steal", () => {
    const r = replayPlays([atBat("a", 1, { [BATTER]: 1 }), basePlay("s", 2, "stolen_base", { a: 2 })]);
    expect(r.bases[2]).toBe("a");
    expect(r.stolenBases).toEqual({ a: 1 });
  });

  it("a steal of home scores", () => {
    const r = replayPlays([atBat("a", 1, { [BATTER]: 3 }), basePlay("s", 2, "stolen_base", { a: "home" })]);
    expect(r.state.ourScore).toBe(1);
    expect(r.stolenBases).toEqual({ a: 1 });
  });

  it("a wild pitch run counts but isn't a steal", () => {
    const r = replayPlays([atBat("a", 1, { [BATTER]: 3 }), basePlay("w", 2, "wild_pitch", { a: "home" })]);
    expect(r.state.ourScore).toBe(1);
    expect(r.stolenBases).toEqual({});
    expect(r.runsByPlay.w).toBe(1);
  });

  it("caught stealing is an out and removes the runner", () => {
    const r = replayPlays([atBat("a", 1, { [BATTER]: 1 }), basePlay("c", 2, "caught_stealing", { a: "out" })]);
    expect(r.bases).toEqual(EMPTY_BASES);
    expect(r.state.outsInCurrentInning).toBe(1);
    expect(r.caughtStealing).toEqual({ a: 1 });
  });

  it("ending a half adds its runs and flips the half", () => {
    const r = replayPlays([{ id: "e", kind: "base_play", sequence: 1, isOurTeam: false, runnerMoves: {}, type: "end_half", extraOuts: 3, extraRuns: 2 }]);
    expect(r.state).toMatchObject({ opponentScore: 2, isTopOfInning: false });
  });

  it("still counts at-bats saved before runners were tracked", () => {
    const r = replayPlays([
      { id: "old", kind: "at_bat", sequence: 1, isOurTeam: true, runnerMoves: null, result: "groundout", runsScored: 1, caughtStealing: 1 },
    ]);
    expect(r.state).toMatchObject({ ourScore: 1, outsInCurrentInning: 2 });
    expect(r.bases).toEqual(EMPTY_BASES);
  });

  it("skips a runner who is no longer on base", () => {
    expect(replayPlays([basePlay("s", 1, "stolen_base", { gone: "home" })]).state.ourScore).toBe(0);
  });
});

describe("gameLooksOver", () => {
  const g = (o: object) => ({ isHome: true, inningsCount: 6, currentInning: 6, isTopOfInning: false, ourScore: 0, opponentScore: 0, ...o });
  it("a walk-off, or the home team ahead going into the last bottom", () => {
    expect(gameLooksOver(g({ ourScore: 3, opponentScore: 2 }))).toBe(true);
    expect(gameLooksOver(g({ ourScore: 2, opponentScore: 3 }))).toBe(false);
  });
  it("after regulation with a winner, but not a tie", () => {
    expect(gameLooksOver(g({ currentInning: 7, isTopOfInning: true, ourScore: 1 }))).toBe(true);
    expect(gameLooksOver(g({ currentInning: 7, isTopOfInning: true }))).toBe(false);
  });
  it("not before the last inning", () => {
    expect(gameLooksOver(g({ currentInning: 3, ourScore: 9 }))).toBe(false);
  });
});

describe("resultFromPitches", () => {
  const p = (...r: string[]) => r.map((result) => ({ result }));
  it("finds strikeouts, walks and hit by pitch", () => {
    expect(resultFromPitches(p("foul", "foul", "called_strike"))).toBe("strikeout_looking");
    expect(resultFromPitches(p("ball", "ball", "ball", "ball"))).toBe("walk");
    expect(resultFromPitches(p("hit_by_pitch"))).toBe("hbp");
  });
  it("finds nothing once the deciding pitch is undone", () => {
    expect(resultFromPitches(p("foul", "foul"))).toBeNull();
    expect(resultFromPitches([])).toBeNull();
  });
});

describe("normalizeRuns", () => {
  it("fixes a home run sent with nothing filled in", () => {
    expect(normalizeRuns({ result: "home_run" })).toEqual({ rbi: 1, runsScored: 1, runnerScored: true });
  });
  it("counts RBI as runs when an older screen only sends RBI", () => {
    expect(normalizeRuns({ result: "single", rbi: 2 })).toEqual({ rbi: 2, runsScored: 2, runnerScored: false });
  });
});

describe("nextBatterIndex", () => {
  const order = ["a", "b", "c"];
  it("starts at the top and wraps around", () => {
    expect(nextBatterIndex(order, null)).toBe(0);
    expect(nextBatterIndex(order, "a")).toBe(1);
    expect(nextBatterIndex(order, "c")).toBe(0);
  });
  it("follows a batter who was picked out of order", () => {
    expect(nextBatterIndex(order, "b")).toBe(2);
  });
  it("a substitute's spot still says who's next", () => {
    expect(nextBatterIndex(["a", "b", "sub", "d"], "c", 3)).toBe(3);
  });
});

describe("pitchCount", () => {
  it("doesn't count hit by pitch as a ball, or a foul as strike three", () => {
    const pitches = ["foul", "foul", "foul", "hit_by_pitch"].map((result) => ({ result }));
    expect(pitchCount(pitches)).toEqual({ balls: 0, strikes: 2 });
  });
});

describe("buildBoxScore", () => {
  const player = { id: "p1", firstName: "Ann", lastName: "Lee" };
  const base = { playerId: "p1" as string | null, player: player as typeof player | null, rbi: 0, runsScored: 0, runnerScored: false, stolenBases: 0, inning: 1 };
  const game = (atBats: (typeof base & { result: string })[], inningsCount = 6) => ({
    inningsCount,
    lineupEntries: [{ player }],
    atBats,
  });

  it("line score adds up to the runs that scored, in the right inning", () => {
    const box = buildBoxScore(game([
      { ...base, result: "home_run", rbi: 3, runsScored: 3, runnerScored: true, inning: 2 },
      { ...base, playerId: null, player: null, result: "error", runsScored: 1 },
    ]));
    expect(box.ourRunsByInning[1]).toBe(3);
    expect(box.oppRunsByInning[0]).toBe(1);
    expect(box.ourErrors).toBe(1);
  });

  it("gives extra innings their own column", () => {
    const box = buildBoxScore(game([{ ...base, result: "single", runsScored: 1, inning: 8 }]));
    expect(box.innings).toBe(8);
    expect(box.ourRunsByInning[7]).toBe(1);
    expect(box.ourRunsByInning[5]).toBe(0);
  });

  it("agrees with season stats on at-bats and walks", () => {
    const results = ["single", "walk", "hbp", "catchers_interference", "sacrifice_fly", "error", "groundout"];
    const box = buildBoxScore(game(results.map((result) => ({ ...base, result }))));
    const season = calcBattingStats(
      results.map((result) => ({ result, rbi: 0, stolenBases: 0, caughtStealing: 0, runnerScored: false })),
      1
    );
    expect(box.boxLines[0].ab).toBe(season.atBats);
    expect(box.boxLines[0].bb).toBe(season.walks);
    expect(box.boxLines[0].avg).toBe(season.avg);
  });

  it("keeps a line for a player no longer in the lineup", () => {
    const box = buildBoxScore({ ...game([]), lineupEntries: [], atBats: [{ ...base, result: "single" }] });
    expect(box.boxLines[0].name).toBe("Ann Lee");
  });
});
