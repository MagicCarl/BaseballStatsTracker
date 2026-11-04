"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/useApi";
import { BattingStats, PitchingStats } from "@/lib/stats";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

interface PlayerStat {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    jerseyNumber: number | null;
  };
  stats: BattingStats;
}

interface PitcherStat {
  player: PlayerStat["player"];
  stats: PitchingStats;
}

const BATTING_COLUMNS: { col: keyof BattingStats; label: string; strong?: boolean }[] = [
  { col: "games", label: "G" },
  { col: "plateAppearances", label: "PA" },
  { col: "atBats", label: "AB" },
  { col: "hits", label: "H", strong: true },
  { col: "doubles", label: "2B" },
  { col: "triples", label: "3B" },
  { col: "homeRuns", label: "HR" },
  { col: "runs", label: "R" },
  { col: "rbi", label: "RBI", strong: true },
  { col: "walks", label: "BB" },
  { col: "strikeouts", label: "K" },
  { col: "stolenBases", label: "SB" },
  { col: "avg", label: "AVG", strong: true },
  { col: "obp", label: "OBP" },
  { col: "slg", label: "SLG" },
  { col: "ops", label: "OPS", strong: true },
];

const PITCHING_COLUMNS: { col: keyof PitchingStats; label: string; strong?: boolean }[] = [
  { col: "games", label: "G" },
  { col: "ip", label: "IP", strong: true },
  { col: "hits", label: "H" },
  { col: "runs", label: "R" },
  { col: "earnedRuns", label: "ER" },
  { col: "walks", label: "BB" },
  { col: "strikeouts", label: "K", strong: true },
  { col: "homeRuns", label: "HR" },
  { col: "pitches", label: "PC" },
  { col: "era", label: "ERA", strong: true },
  { col: "whip", label: "WHIP" },
];

const numeric = (v: string | number) => (typeof v === "string" ? parseFloat(v) || 0 : v);

const playerName = (p: PlayerStat["player"]) =>
  `#${p.jerseyNumber ?? "-"} ${p.firstName} ${p.lastName}`;

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface TeamRecord {
  wins: number;
  losses: number;
  ties: number;
  games: number;
}

export default function TeamStatsPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { apiFetch } = useApi();
  const t = useTranslations("teams.stats");
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [pitchingStats, setPitchingStats] = useState<PitcherStat[]>([]);
  const [teamTotals, setTeamTotals] = useState<BattingStats | null>(null);
  const [inningsPerGame, setInningsPerGame] = useState<number | null>(null);
  const [record, setRecord] = useState<TeamRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"batting" | "pitching">("batting");
  const [sortBy, setSortBy] = useState<keyof BattingStats>("avg");
  const [sortAsc, setSortAsc] = useState(false);
  const [pitchSortBy, setPitchSortBy] = useState<keyof PitchingStats>("outs");
  const [pitchSortAsc, setPitchSortAsc] = useState(false);

  useEffect(() => {
    apiFetch(`/api/teams/${teamId}/stats`)
      .then((data) => {
        setPlayerStats(data.playerStats);
        setPitchingStats(data.pitchingStats ?? []);
        setTeamTotals(data.teamTotals ?? null);
        setInningsPerGame(data.inningsPerGame ?? null);
        setRecord(data.record);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiFetch, teamId]);

  const handleSort = (col: keyof BattingStats) => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(false);
    }
  };

  const handlePitchSort = (col: keyof PitchingStats) => {
    // IP is a display string ("4.2"); sort it by the underlying outs instead.
    const key = col === "ip" ? "outs" : col;
    if (pitchSortBy === key) {
      setPitchSortAsc(!pitchSortAsc);
    } else {
      setPitchSortBy(key);
      // Lower is better for ERA/WHIP, so start those ascending.
      setPitchSortAsc(key === "era" || key === "whip");
    }
  };

  const sorted = [...playerStats].sort((a, b) => {
    const diff = numeric(a.stats[sortBy]) - numeric(b.stats[sortBy]);
    return sortAsc ? diff : -diff;
  });

  const sortedPitching = [...pitchingStats].sort((a, b) => {
    const diff = numeric(a.stats[pitchSortBy]) - numeric(b.stats[pitchSortBy]);
    return pitchSortAsc ? diff : -diff;
  });

  const exportCsv = () => {
    if (tab === "batting") {
      const rows: (string | number)[][] = [
        [t("player"), ...BATTING_COLUMNS.map((c) => c.label)],
        ...sorted.map((ps) => [playerName(ps.player), ...BATTING_COLUMNS.map((c) => ps.stats[c.col])]),
      ];
      if (teamTotals) rows.push([t("teamTotals"), ...BATTING_COLUMNS.map((c) => teamTotals[c.col])]);
      downloadCsv("batting-stats.csv", rows);
    } else {
      downloadCsv("pitching-stats.csv", [
        [t("player"), ...PITCHING_COLUMNS.map((c) => c.label)],
        ...sortedPitching.map((ps) => [playerName(ps.player), ...PITCHING_COLUMNS.map((c) => ps.stats[c.col])]),
      ]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const thClass =
    "cursor-pointer select-none whitespace-nowrap px-2.5 pb-2.5 pt-1 text-right text-[11px] font-medium uppercase tracking-wider text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400";
  const sortArrow = (active: boolean, asc: boolean) =>
    active ? <span className="ml-0.5 text-blue-600 dark:text-blue-400">{asc ? "\u25B2" : "\u25BC"}</span> : null;

  const hasRows = tab === "batting" ? sorted.length > 0 : sortedPitching.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href={`/teams/${teamId}`}
            className="text-sm text-gray-500 hover:text-gray-700 lg:hidden dark:text-gray-400"
          >
            &larr; {t("backToTeam")}
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{t("seasonStats")}</h1>
          {record && record.games > 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("wins")} {record.wins} · {t("losses")} {record.losses}
              {record.ties > 0 && <> · {t("ties")} {record.ties}</>}
              {record.wins + record.losses > 0 && (
                <> · {t("winPct")} {((record.wins / (record.wins + record.losses)) * 100).toFixed(0)}%</>
              )}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/teams/${teamId}/spray-chart`}
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 lg:hidden dark:border-white/10 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            {t("sprayChart")}
          </Link>
          <button
            onClick={exportCsv}
            disabled={!hasRows}
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {t("exportCsv")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="grid grid-cols-2 gap-1 rounded-xl bg-black/[0.05] p-1 dark:bg-white/5">
        {(["batting", "pitching"] as const).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>

      <Card className="p-0">
        {!hasRows ? (
          <p className="p-6 text-sm text-gray-400">{tab === "batting" ? t("noStats") : t("noPitching")}</p>
        ) : (
          <div className="overflow-x-auto px-3 pb-2 pt-4 sm:px-5">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/10">
                  <th className="sticky left-0 bg-white px-2.5 pb-2.5 pt-1 text-left text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:bg-gray-900 dark:text-gray-500">
                    {t("player")}
                  </th>
                  {tab === "batting"
                    ? BATTING_COLUMNS.map((c) => (
                        <th key={c.col} className={thClass} onClick={() => handleSort(c.col)}>
                          {c.label}
                          {sortArrow(sortBy === c.col, sortAsc)}
                        </th>
                      ))
                    : PITCHING_COLUMNS.map((c) => (
                        <th key={c.col} className={thClass} onClick={() => handlePitchSort(c.col)}>
                          {c.label}
                          {sortArrow(pitchSortBy === (c.col === "ip" ? "outs" : c.col), pitchSortAsc)}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody>
                {tab === "batting"
                  ? sorted.map((ps) => (
                      <tr key={ps.player.id} className="border-b border-black/[0.04] last:border-0 dark:border-white/5">
                        <td className="sticky left-0 whitespace-nowrap bg-white px-2.5 py-2 font-medium dark:bg-gray-900">
                          {playerName(ps.player)}
                        </td>
                        {BATTING_COLUMNS.map((c) => (
                          <td key={c.col} className={`px-2.5 py-2 text-right ${c.strong ? "font-semibold" : "text-gray-600 dark:text-gray-300"}`}>
                            {ps.stats[c.col]}
                          </td>
                        ))}
                      </tr>
                    ))
                  : sortedPitching.map((ps) => (
                      <tr key={ps.player.id} className="border-b border-black/[0.04] last:border-0 dark:border-white/5">
                        <td className="sticky left-0 whitespace-nowrap bg-white px-2.5 py-2 font-medium dark:bg-gray-900">
                          {playerName(ps.player)}
                        </td>
                        {PITCHING_COLUMNS.map((c) => (
                          <td key={c.col} className={`px-2.5 py-2 text-right ${c.strong ? "font-semibold" : "text-gray-600 dark:text-gray-300"}`}>
                            {ps.stats[c.col]}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
              {tab === "batting" && teamTotals && (
                <tfoot>
                  <tr className="border-t-2 border-black/10 font-semibold dark:border-white/15">
                    <td className="sticky left-0 whitespace-nowrap bg-white px-2.5 py-2.5 dark:bg-gray-900">{t("teamTotals")}</td>
                    {BATTING_COLUMNS.map((c) => (
                      <td key={c.col} className="px-2.5 py-2.5 text-right">
                        {teamTotals[c.col]}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </Card>
      {tab === "pitching" && hasRows && inningsPerGame && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("eraNote", { innings: inningsPerGame })}</p>
      )}
    </div>
  );
}
