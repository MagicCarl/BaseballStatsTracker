import { getOutsProduced } from "./stats";

export type Base = 1 | 2 | 3;
export type Destination = Base | "home" | "out";

/** Where each runner ended up. Keys are the at-bat that put the runner on base. */
export type RunnerMoves = Record<string, Destination>;
export type Bases = Record<Base, string | null>;

/** Stands in for the at-bat's own id, which doesn't exist until it's saved. */
export const BATTER = "batter";
export const EMPTY_BASES: Bases = { 1: null, 2: null, 3: null };

export const BASE_PLAY_TYPES = [
  "stolen_base",
  "caught_stealing",
  "wild_pitch",
  "passed_ball",
  "balk",
  "picked_off",
  "other",
] as const;
export type BasePlayType = (typeof BASE_PLAY_TYPES)[number] | "end_half";

// Runs can score on these plays, but the batter doesn't get an RBI by default.
const NO_RBI_BY_DEFAULT = new Set([
  "error",
  "double_play",
  "triple_play",
  "strikeout_swinging",
  "strikeout_looking",
]);

const occupied = (bases: Bases): [Base, string][] =>
  ([3, 2, 1] as Base[]).flatMap((b) => (bases[b] ? [[b, bases[b]] as [Base, string]] : []));

const ahead = (base: Base, by: number): Destination =>
  base + by >= 4 ? "home" : ((base + by) as Base);

/** Everyone moves up the same number of bases. */
function advanceAll(bases: Bases, by: number): RunnerMoves {
  return Object.fromEntries(occupied(bases).map(([b, id]) => [id, ahead(b, by)]));
}

/** Runners pushed along because the batter took first base. Others stay put. */
function forcedMoves(bases: Bases): RunnerMoves {
  const moves: RunnerMoves = {};
  if (!bases[1]) return moves;
  moves[bases[1]] = 2;
  if (!bases[2]) return moves;
  moves[bases[2]] = 3;
  if (bases[3]) moves[bases[3]] = "home";
  return moves;
}

const countOuts = (moves: RunnerMoves) => Object.values(moves).filter((to) => to === "out").length;

/**
 * The most likely outcome of a result, for the scorer to correct if needed.
 * If the play ends the half-inning, runners hold, so no run counts by default.
 */
export function defaultMoves(result: string, bases: Bases, outs: number): RunnerMoves {
  const moves = rawDefaultMoves(result, bases);
  if (outs + countOuts(moves) < 3) return moves;
  return Object.fromEntries(Object.entries(moves).filter(([, to]) => to !== "home"));
}

function rawDefaultMoves(result: string, bases: Bases): RunnerMoves {
  const runners = occupied(bases);
  switch (result) {
    case "single":
    case "error":
      return { [BATTER]: 1, ...advanceAll(bases, 1) };
    case "double":
    case "ground_rule_double":
      return { [BATTER]: 2, ...advanceAll(bases, 2) };
    case "triple":
      return { [BATTER]: 3, ...advanceAll(bases, 3) };
    case "home_run":
      return { [BATTER]: "home", ...advanceAll(bases, 4) };
    case "walk":
    case "ibb":
    case "hbp":
    case "catchers_interference":
      return { [BATTER]: 1, ...forcedMoves(bases) };
    case "fielders_choice": {
      // The force at second if there is one, otherwise the lead runner.
      const forced = bases[1];
      const lead = runners[0]?.[1];
      const moves: RunnerMoves = { [BATTER]: 1, ...(forced ? forcedMoves(bases) : {}) };
      const out = forced ?? lead;
      if (out) moves[out] = "out";
      return moves;
    }
    case "double_play": {
      const out = bases[1] ?? runners[0]?.[1];
      return { [BATTER]: "out", ...(out ? { [out]: "out" as const } : {}) };
    }
    case "triple_play": {
      const outs = (bases[1] ? [bases[1], ...runners.map(([, id]) => id).filter((id) => id !== bases[1])] : runners.map(([, id]) => id)).slice(0, 2);
      return { [BATTER]: "out", ...Object.fromEntries(outs.map((id) => [id, "out" as const])) };
    }
    case "sacrifice_fly":
      return { [BATTER]: "out", ...(bases[3] ? { [bases[3]]: "home" as const } : {}) };
    case "sacrifice_bunt":
      return { [BATTER]: "out", ...advanceAll(bases, 1) };
    default:
      return { [BATTER]: "out" };
  }
}

/** Default movement when a runner is tapped for a play between at-bats. */
export function defaultBasePlayMoves(type: string, bases: Bases, runner: string | null): RunnerMoves {
  const from = (Object.entries(bases).find(([, id]) => id === runner)?.[0] ?? null) as string | null;
  switch (type) {
    case "wild_pitch":
    case "passed_ball":
    case "balk":
      return advanceAll(bases, 1);
    case "stolen_base":
      if (!runner || !from) return {};
      return setRunnerMove({}, bases, runner, ahead(Number(from) as Base, 1));
    case "caught_stealing":
    case "picked_off":
      return runner ? { [runner]: "out" } : {};
    default:
      return {};
  }
}

const whereIs = (moves: RunnerMoves, bases: Bases, id: string): Destination | null => {
  if (moves[id] !== undefined) return moves[id];
  const held = (Object.entries(bases) as unknown as [string, string | null][]).find(([, r]) => r === id);
  return held ? (Number(held[0]) as Base) : null;
};

/** Change one runner, pushing along anyone they'd otherwise land on. */
export function setRunnerMove(moves: RunnerMoves, bases: Bases, id: string, to: Destination): RunnerMoves {
  const updated: RunnerMoves = { ...moves, [id]: to };
  if (typeof to !== "number") return updated;
  const others = [BATTER, ...occupied(bases).map(([, r]) => r)].filter((r) => r !== id);
  for (const other of others) {
    if (whereIs(updated, bases, other) === to) {
      return setRunnerMove(updated, bases, other, ahead(to, 1));
    }
  }
  return updated;
}

export type MoveProblem = "unknown_runner" | "same_base" | "backward" | null;

/** Checks a set of moves against who is actually on base. */
export function checkMoves(moves: RunnerMoves, bases: Bases, hasBatter: boolean): MoveProblem {
  const onBase = occupied(bases);
  const known = new Set([...(hasBatter ? [BATTER] : []), ...onBase.map(([, id]) => id)]);
  if (Object.keys(moves).some((id) => !known.has(id))) return "unknown_runner";

  for (const [from, id] of onBase) {
    const to = moves[id];
    if (typeof to === "number" && to < from) return "backward";
  }

  const landing = [...known].flatMap((id) => {
    const at = whereIs(moves, bases, id);
    return typeof at === "number" ? [at] : [];
  });
  return new Set(landing).size === landing.length ? null : "same_base";
}

export const runsInMoves = (moves: RunnerMoves) =>
  Object.values(moves).filter((to) => to === "home").length;

/** Runs on the play count as RBI unless the result doesn't usually earn one. */
export const defaultRbi = (result: string | null, moves: RunnerMoves) =>
  result && NO_RBI_BY_DEFAULT.has(result) ? 0 : runsInMoves(moves);

export interface ReplayPlay {
  id: string;
  kind: "at_bat" | "base_play";
  sequence: number;
  isOurTeam: boolean;
  /** Null on at-bats saved before runners were tracked. */
  runnerMoves: RunnerMoves | null;
  result?: string;
  type?: string;
  extraOuts?: number;
  extraRuns?: number;
  rbi?: number;
  runsScored?: number;
  caughtStealing?: number;
}

export interface GameState {
  ourScore: number;
  opponentScore: number;
  currentInning: number;
  isTopOfInning: boolean;
  outsInCurrentInning: number;
}

export interface Replay {
  state: GameState;
  bases: Bases;
  /** Runs on each play, by play id. */
  runsByPlay: Record<string, number>;
  /** Per at-bat id: credits earned by the runner that at-bat put on base. */
  scored: Set<string>;
  stolenBases: Record<string, number>;
  caughtStealing: Record<string, number>;
}

/** The score, outs, inning and bases always come from replaying plays in order. */
export function replayPlays(plays: ReplayPlay[]): Replay {
  const state: GameState = {
    ourScore: 0,
    opponentScore: 0,
    currentInning: 1,
    isTopOfInning: true,
    outsInCurrentInning: 0,
  };
  let bases: Bases = { ...EMPTY_BASES };
  const runsByPlay: Record<string, number> = {};
  const scored = new Set<string>();
  const stolenBases: Record<string, number> = {};
  const caughtStealing: Record<string, number> = {};

  for (const play of [...plays].sort((a, b) => a.sequence - b.sequence)) {
    let runs = play.extraRuns ?? 0;
    let outs = play.extraOuts ?? 0;

    if (play.runnerMoves) {
      const next: Bases = { ...bases };
      const ids = (id: string) => (id === BATTER ? play.id : id);
      // Clear everyone who moves before placing anyone, so runners can't collide.
      for (const b of [1, 2, 3] as Base[]) {
        if (next[b] && play.runnerMoves[next[b] as string] !== undefined) next[b] = null;
      }
      for (const [key, to] of Object.entries(play.runnerMoves)) {
        const id = ids(key);
        // An earlier correction can remove a runner, so skip anyone no longer on base.
        if (key !== BATTER && !Object.values(bases).includes(key)) continue;
        if (to === "out") {
          outs++;
          if (play.type === "caught_stealing") caughtStealing[id] = (caughtStealing[id] ?? 0) + 1;
        } else if (to === "home") {
          runs++;
          scored.add(id);
          if (play.type === "stolen_base") stolenBases[id] = (stolenBases[id] ?? 0) + 1;
        } else {
          next[to] = id;
          if (play.type === "stolen_base") stolenBases[id] = (stolenBases[id] ?? 0) + 1;
        }
      }
      bases = next;
    } else if (play.kind === "at_bat") {
      // The old version only saved RBI, including during the switch to this one.
      runs += Math.max(play.runsScored ?? 0, play.rbi ?? 0);
      outs += getOutsProduced(play.result ?? "") + (play.caughtStealing ?? 0);
    }

    runsByPlay[play.id] = runs;
    if (play.isOurTeam) state.ourScore += runs;
    else state.opponentScore += runs;

    state.outsInCurrentInning += outs;
    if (state.outsInCurrentInning >= 3) {
      state.outsInCurrentInning = 0;
      bases = { ...EMPTY_BASES };
      if (!state.isTopOfInning) state.currentInning += 1;
      state.isTopOfInning = !state.isTopOfInning;
    }
  }

  return { state, bases, runsByPlay, scored, stolenBases, caughtStealing };
}

interface PlayableAtBat {
  id: string;
  atBatNumberInGame: number;
  playerId?: string | null;
  runnerMoves?: unknown;
  result: string;
  rbi: number;
  runsScored: number;
  caughtStealing: number;
}

interface PlayableBasePlay {
  id: string;
  sequence: number;
  isOurTeam: boolean;
  runnerMoves: unknown;
  type: string;
  extraOuts: number;
  extraRuns: number;
}

export function buildPlays(atBats: PlayableAtBat[], basePlays: PlayableBasePlay[]): ReplayPlay[] {
  return [
    ...atBats.map((ab) => ({
      id: ab.id,
      kind: "at_bat" as const,
      sequence: ab.atBatNumberInGame,
      isOurTeam: !!ab.playerId,
      runnerMoves: (ab.runnerMoves ?? null) as RunnerMoves | null,
      result: ab.result,
      rbi: ab.rbi,
      runsScored: ab.runsScored,
      caughtStealing: ab.caughtStealing,
    })),
    ...basePlays.map((bp) => ({
      id: bp.id,
      kind: "base_play" as const,
      sequence: bp.sequence,
      isOurTeam: bp.isOurTeam,
      runnerMoves: bp.runnerMoves as RunnerMoves,
      type: bp.type,
      extraOuts: bp.extraOuts,
      extraRuns: bp.extraRuns,
    })),
  ];
}

/** The result the pitches already decided, if any. */
export function resultFromPitches(pitches: { result: string }[]): string | null {
  if (pitches.length === 0) return null;
  const { balls, strikes } = pitchCount(pitches);
  if (pitches[pitches.length - 1].result === "hit_by_pitch") return "hbp";
  if (balls >= 4) return "walk";
  if (strikes < 3) return null;
  const lastStrike = [...pitches].reverse().find((p) => p.result === "called_strike" || p.result === "swinging_strike");
  return lastStrike?.result === "called_strike" ? "strikeout_looking" : "strikeout_swinging";
}

/** Regulation is done, or the home team has already won. The scorer still decides. */
export function gameLooksOver(game: {
  isHome: boolean;
  inningsCount: number;
  currentInning: number;
  isTopOfInning: boolean;
  ourScore: number;
  opponentScore: number;
}): boolean {
  const home = game.isHome ? game.ourScore : game.opponentScore;
  const away = game.isHome ? game.opponentScore : game.ourScore;
  const inOrPastLastBottom = game.currentInning >= game.inningsCount && !game.isTopOfInning;
  const pastRegulation = game.currentInning > game.inningsCount && game.isTopOfInning;
  return (inOrPastLastBottom && home > away) || (pastRegulation && home !== away);
}

/** Whether the team we're scoring for is at bat in this half-inning. */
export const weAreBatting = (isHome: boolean, isTopOfInning: boolean) =>
  isHome ? !isTopOfInning : isTopOfInning;

/** For at-bats sent without runner moves, by a screen still open from an older version. */
export function normalizeRuns(input: {
  result: string;
  rbi?: number;
  runsScored?: number;
  runnerScored?: boolean;
}): { rbi: number; runsScored: number; runnerScored: boolean } {
  const isHomeRun = input.result === "home_run";
  const rbi = Math.max(input.rbi ?? 0, isHomeRun ? 1 : 0);
  return {
    rbi,
    runsScored: Math.max(input.runsScored ?? 0, rbi),
    runnerScored: isHomeRun || (input.runnerScored ?? false),
  };
}

/**
 * The next batter follows whoever batted last, so a manual pick can't skip anyone.
 * If that batter was substituted out, their batting-order spot still says who's next.
 */
export function nextBatterIndex(
  orderIds: string[],
  lastBatterId: string | null | undefined,
  lastSpot?: number | null
): number {
  if (orderIds.length === 0 || !lastBatterId) return 0;
  const last = orderIds.indexOf(lastBatterId);
  if (last !== -1) return (last + 1) % orderIds.length;
  return lastSpot ? lastSpot % orderIds.length : 0;
}

/** Ball-strike count for the at-bat in progress. A foul can't be strike three. */
export function pitchCount(pitches: { result: string }[]): { balls: number; strikes: number } {
  let balls = 0;
  let strikes = 0;
  for (const p of pitches) {
    if (p.result === "ball") balls++;
    else if (p.result === "called_strike" || p.result === "swinging_strike") strikes++;
    else if (p.result === "foul" && strikes < 2) strikes++;
  }
  return { balls, strikes };
}
