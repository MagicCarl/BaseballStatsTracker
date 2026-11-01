"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { RESULT_LABELS, AT_BAT_RESULTS } from "@/lib/constants";

interface WatchAtBat {
  id: string;
  playerId: string | null;
  result: string;
  rbi: number;
  stolenBases: number;
  runnerScored: boolean;
  inning: number;
  isTop: boolean;
  player: { firstName: string; lastName: string } | null;
  opponentBatter: { name: string } | null;
}

interface WatchGame {
  opponentName: string;
  gameDate: string;
  isHome: boolean;
  inningsCount: number;
  status: string;
  ourScore: number;
  opponentScore: number;
  currentInning: number;
  isTopOfInning: boolean;
  team: { name: string };
  lineupEntries: {
    battingOrder: number;
    player: { id: string; firstName: string; lastName: string };
  }[];
  atBats: WatchAtBat[];
}

interface PlayerBoxLine {
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

const TERMINAL_STATUSES = ["completed", "cancelled", "final"];

export default function WatchClient({ token }: { token: string }) {
  const [game, setGame] = useState<WatchGame | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGame = useCallback(async () => {
    try {
      const res = await fetch(`/api/watch/${token}`, { cache: "no-store" });
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (res.ok) {
        setGame(await res.json());
      }
    } catch {
      // transient network error — keep the last good state
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  // Live-refresh every 5s until the game reaches a terminal state.
  useEffect(() => {
    if (!game || TERMINAL_STATUSES.includes(game.status)) return;
    const id = setInterval(fetchGame, 5000);
    return () => clearInterval(id);
  }, [game, fetchGame]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (notFound || !game) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">Game not found</p>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          This share link is invalid or has been turned off by the scorekeeper.
        </p>
        <Link href="/" className="mt-6 inline-block text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          Baseball Stats Tracker
        </Link>
      </div>
    );
  }

  const isFinal = TERMINAL_STATUSES.includes(game.status);

  // Box score lines per player (same math as the box score page)
  const playerMap = new Map<string, PlayerBoxLine>();
  for (const entry of game.lineupEntries) {
    const p = entry.player;
    playerMap.set(p.id, {
      name: `${p.firstName} ${p.lastName}`,
      ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, k: 0, sb: 0, avg: ".000",
    });
  }
  for (const ab of game.atBats) {
    if (!ab.playerId) continue;
    const line = playerMap.get(ab.playerId);
    if (!line) continue;

    const isHit = (AT_BAT_RESULTS.hits as readonly string[]).includes(ab.result);
    const isWalk = ab.result === "walk" || ab.result === "hbp" || ab.result === "ibb";
    const isK = ab.result === "strikeout_swinging" || ab.result === "strikeout_looking";
    const isSac = ab.result === "sacrifice_fly" || ab.result === "sacrifice_bunt";

    if (!isWalk && !isSac) line.ab++;
    if (isHit) line.hits++;
    if (ab.runnerScored) line.runs++;
    line.rbi += ab.rbi;
    if (isWalk) line.bb++;
    if (isK) line.k++;
    line.sb += ab.stolenBases;
    line.avg = line.ab > 0 ? (line.hits / line.ab).toFixed(3).replace(/^0/, "") : ".000";
  }
  const boxLines = Array.from(playerMap.values());

  // Inning-by-inning scoreboard
  const innings = game.inningsCount || 6;
  const ourRunsByInning: number[] = Array(innings).fill(0);
  const oppRunsByInning: number[] = Array(innings).fill(0);
  let ourHits = 0;
  let oppHits = 0;
  let ourErrors = 0;
  let oppErrors = 0;

  for (const ab of game.atBats) {
    const inningIdx = Math.min(ab.inning - 1, innings - 1);
    const isOurBatting = !!ab.playerId;
    const isHit = (AT_BAT_RESULTS.hits as readonly string[]).includes(ab.result);
    const isError = ab.result === "error";

    if (isOurBatting) {
      if (ab.runnerScored) ourRunsByInning[inningIdx]++;
      if (isHit) ourHits++;
      if (isError) oppErrors++;
    } else {
      if (ab.runnerScored) oppRunsByInning[inningIdx]++;
      if (isHit) oppHits++;
      if (isError) ourErrors++;
    }
  }

  const ourTeamName = game.team?.name || "Us";
  const oppTeamName = game.opponentName;
  const topName = game.isHome ? oppTeamName : ourTeamName;
  const botName = game.isHome ? ourTeamName : oppTeamName;
  const topRuns = game.isHome ? oppRunsByInning : ourRunsByInning;
  const botRuns = game.isHome ? ourRunsByInning : oppRunsByInning;
  const topR = game.isHome ? game.opponentScore : game.ourScore;
  const botR = game.isHome ? game.ourScore : game.opponentScore;
  const topH = game.isHome ? oppHits : ourHits;
  const botH = game.isHome ? ourHits : oppHits;
  const topE = game.isHome ? oppErrors : ourErrors;
  const botE = game.isHome ? ourErrors : oppErrors;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <header className="border-b border-gray-200/70 dark:border-gray-800">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">
            Baseball Stats Tracker
          </Link>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
            {isFinal ? "FINAL" : "LIVE"}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-5 py-8">
        <div className="text-center">
          <h1 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {ourTeamName} vs {oppTeamName}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {new Date(game.gameDate).toLocaleDateString(undefined, {
              weekday: "long", month: "long", day: "numeric",
            })}
            {!isFinal &&
              ` · ${game.isTopOfInning ? "Top" : "Bottom"} of inning ${game.currentInning}`}
          </p>
        </div>

        {/* Inning-by-inning scoreboard */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-2 py-1.5 text-left font-medium"></th>
                  {Array.from({ length: innings }, (_, i) => (
                    <th
                      key={i}
                      className={`min-w-[28px] px-1.5 py-1.5 text-center font-medium ${
                        game.currentInning === i + 1 && !isFinal ? "text-blue-500" : "text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </th>
                  ))}
                  <th className="min-w-[32px] border-l border-gray-300 px-2 py-1.5 text-center font-semibold dark:border-gray-600">R</th>
                  <th className="min-w-[32px] px-2 py-1.5 text-center font-semibold">H</th>
                  <th className="min-w-[32px] px-2 py-1.5 text-center font-semibold">E</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="whitespace-nowrap px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">{topName}</td>
                  {topRuns.map((r, i) => {
                    const played = isFinal || game.currentInning > i + 1 || (game.currentInning === i + 1 && !game.isTopOfInning);
                    return (
                      <td key={i} className={`px-1.5 py-1.5 text-center ${game.currentInning === i + 1 && !isFinal ? "font-bold text-blue-500" : ""}`}>
                        {played ? r : "—"}
                      </td>
                    );
                  })}
                  <td className="border-l border-gray-300 px-2 py-1.5 text-center font-bold dark:border-gray-600">{topR}</td>
                  <td className="px-2 py-1.5 text-center">{topH}</td>
                  <td className="px-2 py-1.5 text-center">{topE}</td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-blue-500">{botName}</td>
                  {botRuns.map((r, i) => {
                    const played = isFinal || game.currentInning > i + 1 || (game.currentInning === i + 1 && game.isTopOfInning === false);
                    return (
                      <td key={i} className={`px-1.5 py-1.5 text-center ${game.currentInning === i + 1 && !isFinal ? "font-bold text-blue-500" : ""}`}>
                        {played ? r : "—"}
                      </td>
                    );
                  })}
                  <td className="border-l border-gray-300 px-2 py-1.5 text-center font-bold dark:border-gray-600">{botR}</td>
                  <td className="px-2 py-1.5 text-center">{botH}</td>
                  <td className="px-2 py-1.5 text-center">{botE}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {!isFinal && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Updates automatically every few seconds
            </p>
          )}
        </Card>

        {/* Batting box score */}
        {boxLines.length > 0 && (
          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
              {ourTeamName} batting
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                    <th className="px-2 py-1 font-medium">Player</th>
                    <th className="px-2 py-1 text-center font-medium">AB</th>
                    <th className="px-2 py-1 text-center font-medium">H</th>
                    <th className="px-2 py-1 text-center font-medium">R</th>
                    <th className="px-2 py-1 text-center font-medium">RBI</th>
                    <th className="px-2 py-1 text-center font-medium">BB</th>
                    <th className="px-2 py-1 text-center font-medium">K</th>
                    <th className="px-2 py-1 text-center font-medium">SB</th>
                    <th className="px-2 py-1 text-center font-medium">AVG</th>
                  </tr>
                </thead>
                <tbody>
                  {boxLines.map((line, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-2 py-1 font-medium">{line.name}</td>
                      <td className="px-2 py-1 text-center">{line.ab}</td>
                      <td className="px-2 py-1 text-center">{line.hits}</td>
                      <td className="px-2 py-1 text-center">{line.runs}</td>
                      <td className="px-2 py-1 text-center">{line.rbi}</td>
                      <td className="px-2 py-1 text-center">{line.bb}</td>
                      <td className="px-2 py-1 text-center">{line.k}</td>
                      <td className="px-2 py-1 text-center">{line.sb}</td>
                      <td className="px-2 py-1 text-center">{line.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Play-by-play (latest first for live viewers) */}
        {game.atBats.length > 0 && (
          <Card>
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">Play-by-play</h3>
            <div className="space-y-1">
              {[...game.atBats].reverse().map((ab) => {
                const batterName = ab.player
                  ? `${ab.player.firstName} ${ab.player.lastName}`
                  : ab.opponentBatter?.name || "Opponent";
                return (
                  <div
                    key={ab.id}
                    className="flex items-center justify-between rounded px-2 py-1 text-sm odd:bg-gray-50 dark:odd:bg-gray-800/50"
                  >
                    <span>
                      <span className="font-medium">{batterName}</span>
                      {" - "}
                      {RESULT_LABELS[ab.result] || ab.result}
                      {ab.rbi > 0 && ` (${ab.rbi} RBI)`}
                      {ab.stolenBases > 0 && ` (${ab.stolenBases} SB)`}
                    </span>
                    <span className="text-xs text-gray-400">
                      {ab.isTop ? "T" : "B"}{ab.inning}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Soft CTA for viewers */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-900 dark:bg-blue-900/20">
          <p className="font-semibold text-gray-900 dark:text-white">
            This game is scored with Baseball Stats Tracker
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Live scoring, automatic stats, and spray charts for youth &amp; travel ball.
            One-time $39 — no subscription.
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Score your own games — try it free
          </Link>
        </div>
      </main>
    </div>
  );
}
