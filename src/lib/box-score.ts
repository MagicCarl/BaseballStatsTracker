import { AT_BAT_RESULTS } from "./constants";

export interface PlayerBoxLine {
  name: string;
  ab: number;
  hits: number;
  runs: number;
  rbi: number;
  bb: number;
  k: number;
  sb: number;
  avg: string;
}

interface BoxPlayer {
  firstName: string;
  lastName: string;
}

interface BoxInput {
  inningsCount?: number | null;
  lineupEntries: { player: BoxPlayer & { id: string } }[];
  atBats: {
    playerId?: string | null;
    player?: BoxPlayer | null;
    result: string;
    rbi: number;
    runsScored: number;
    runnerScored: boolean;
    stolenBases: number;
    inning: number;
  }[];
  basePlays?: { isOurTeam: boolean; inning: number; runsScored: number; extraRuns: number }[];
}

const NOT_AN_AT_BAT = new Set([
  "walk", "ibb", "hbp", "catchers_interference", "sacrifice_fly", "sacrifice_bunt",
]);

const isHit = (result: string) => (AT_BAT_RESULTS.hits as readonly string[]).includes(result);

export function buildBoxScore(game: BoxInput) {
  const lines = new Map<string, PlayerBoxLine>();
  const emptyLine = (p: BoxPlayer): PlayerBoxLine => ({
    name: `${p.firstName} ${p.lastName}`,
    ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, k: 0, sb: 0, avg: ".000",
  });

  for (const entry of game.lineupEntries) {
    lines.set(entry.player.id, emptyLine(entry.player));
  }

  // Extra innings get their own columns.
  const basePlays = game.basePlays ?? [];
  const innings = Math.max(
    game.inningsCount || 6,
    ...game.atBats.map((ab) => ab.inning),
    ...basePlays.map((bp) => bp.inning)
  );
  const ourRunsByInning: number[] = Array(innings).fill(0);
  const oppRunsByInning: number[] = Array(innings).fill(0);
  let ourHits = 0;
  let oppHits = 0;
  let ourErrors = 0;
  let oppErrors = 0;

  for (const ab of game.atBats) {
    if (ab.playerId) {
      ourRunsByInning[ab.inning - 1] += ab.runsScored;
      if (isHit(ab.result)) ourHits++;
      if (ab.result === "error") oppErrors++;

      // A player can leave the lineup mid-game and still needs their line.
      if (!lines.has(ab.playerId) && ab.player) lines.set(ab.playerId, emptyLine(ab.player));
      const line = lines.get(ab.playerId);
      if (line) {
        if (!NOT_AN_AT_BAT.has(ab.result)) line.ab++;
        if (isHit(ab.result)) line.hits++;
        if (ab.runnerScored) line.runs++;
        line.rbi += ab.rbi;
        if (ab.result === "walk" || ab.result === "ibb") line.bb++;
        if (ab.result === "strikeout_swinging" || ab.result === "strikeout_looking") line.k++;
        line.sb += ab.stolenBases;
        line.avg = line.ab > 0 ? (line.hits / line.ab).toFixed(3).replace(/^0/, "") : ".000";
      }
    } else {
      oppRunsByInning[ab.inning - 1] += ab.runsScored;
      if (isHit(ab.result)) oppHits++;
      if (ab.result === "error") ourErrors++;
    }
  }

  // Runs that didn't come from an at-bat, like a wild pitch or steal of home.
  for (const bp of basePlays) {
    const byInning = bp.isOurTeam ? ourRunsByInning : oppRunsByInning;
    byInning[bp.inning - 1] += bp.runsScored;
  }

  return {
    boxLines: Array.from(lines.values()),
    innings,
    ourRunsByInning,
    oppRunsByInning,
    ourHits,
    oppHits,
    ourErrors,
    oppErrors,
  };
}
