import type { Prisma } from "@prisma/client";
import { ReplayPlay, buildPlays, replayPlays } from "./game-state";

type Tx = Prisma.TransactionClient;

/** Holds the game row for this transaction, so two devices can't interleave saves. */
export async function lockGame(tx: Tx, gameId: string) {
  await tx.$queryRaw`SELECT id FROM games WHERE id = ${gameId} FOR UPDATE`;
  return tx.game.findUniqueOrThrow({ where: { id: gameId } });
}

export async function loadPlays(tx: Tx, gameId: string) {
  const [atBats, basePlays] = await Promise.all([
    tx.atBat.findMany({ where: { gameId } }),
    tx.basePlay.findMany({ where: { gameId } }),
  ]);
  const plays = buildPlays(atBats, basePlays);
  return { atBats, basePlays, plays };
}

/** Replays the game and saves the result, so nothing stored can drift from the plays. */
export async function syncGameState(tx: Tx, gameId: string) {
  const { atBats, basePlays, plays } = await loadPlays(tx, gameId);
  const replay = replayPlays(plays);

  for (const ab of atBats) {
    if (!ab.runnerMoves) continue;
    const derived = {
      runsScored: replay.runsByPlay[ab.id] ?? 0,
      runnerScored: replay.scored.has(ab.id),
      stolenBases: replay.stolenBases[ab.id] ?? 0,
      caughtStealing: replay.caughtStealing[ab.id] ?? 0,
    };
    if (
      ab.runsScored !== derived.runsScored ||
      ab.runnerScored !== derived.runnerScored ||
      ab.stolenBases !== derived.stolenBases ||
      ab.caughtStealing !== derived.caughtStealing
    ) {
      await tx.atBat.update({ where: { id: ab.id }, data: derived });
    }
  }

  for (const bp of basePlays) {
    const runsScored = replay.runsByPlay[bp.id] ?? 0;
    if (bp.runsScored !== runsScored) {
      await tx.basePlay.update({ where: { id: bp.id }, data: { runsScored } });
    }
  }

  await tx.game.update({ where: { id: gameId }, data: replay.state });
  return replay;
}

export const nextSequence = (plays: ReplayPlay[]) =>
  plays.reduce((max, p) => Math.max(max, p.sequence), 0) + 1;

export const lastPlay = (plays: ReplayPlay[]) =>
  plays.reduce<ReplayPlay | null>((latest, p) => (!latest || p.sequence > latest.sequence ? p : latest), null);
