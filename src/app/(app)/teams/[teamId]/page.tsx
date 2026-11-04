"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/useApi";
import { Player, Game } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { LEVELS, POSITIONS } from "@/lib/constants";
import { BattingStats, PitchingStats } from "@/lib/stats";
import TeamSettingsFields, { TeamSettingsValues } from "@/components/teams/TeamSettingsFields";

interface Season {
  id: string;
  name: string;
  createdAt: string;
}

interface TeamDetail {
  id: string;
  name: string;
  sport: string;
  level: string;
  defaultInnings: number;
  players: Player[];
  games: Game[];
  seasons: Season[];
  _count: { players: number; games: number };
}

interface StatsPlayer {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number | null;
}

interface TeamStatsSummary {
  playerStats: { player: StatsPlayer; stats: BattingStats }[];
  pitchingStats: { player: StatsPlayer; stats: PitchingStats }[];
  record: { wins: number; losses: number; ties: number; games: number; runsFor: number; runsAgainst: number };
}

function gameOutcome(game: Game): "W" | "L" | "T" {
  if (game.ourScore > game.opponentScore) return "W";
  if (game.ourScore < game.opponentScore) return "L";
  return "T";
}

const OUTCOME_STYLES = {
  W: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  L: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  T: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
} as const;

function OutcomeBadge({ outcome }: { outcome: "W" | "L" | "T" }) {
  return (
    <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${OUTCOME_STYLES[outcome]}`}>
      {outcome}
    </span>
  );
}

const playerLabel = (p: StatsPlayer) =>
  `${p.jerseyNumber != null ? `#${p.jerseyNumber} ` : ""}${p.firstName} ${p.lastName}`;

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { apiFetch } = useApi();
  const t = useTranslations("teams.detail");
  const tc = useTranslations("common");
  const td = useTranslations("dashboard");
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [summary, setSummary] = useState<TeamStatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [playerForm, setPlayerForm] = useState({
    firstName: "",
    lastName: "",
    jerseyNumber: "",
    bats: "right",
    throwsHand: "right",
    primaryPosition: "",
  });
  const [saving, setSaving] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    jerseyNumber: "",
    bats: "right",
    throwsHand: "right",
    primaryPosition: "",
  });
  const [showCreateSeason, setShowCreateSeason] = useState(false);
  const [seasonName, setSeasonName] = useState("");
  const [showDeleteGames, setShowDeleteGames] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [settingsValues, setSettingsValues] = useState<TeamSettingsValues>({
    sport: "baseball",
    level: "little_league",
    defaultInnings: 6,
  });
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTeam = async () => {
    try {
      const [data, stats] = await Promise.all([
        apiFetch(`/api/teams/${teamId}`),
        apiFetch(`/api/teams/${teamId}/stats`).catch(() => null),
      ]);
      setTeam(data);
      setSummary(stats);
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads data on mount; state changes after the request
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/api/teams/${teamId}/players`, {
        method: "POST",
        body: JSON.stringify({
          ...playerForm,
          jerseyNumber: playerForm.jerseyNumber
            ? parseInt(playerForm.jerseyNumber)
            : null,
        }),
      });
      setPlayerForm({
        firstName: "",
        lastName: "",
        jerseyNumber: "",
        bats: "right",
        throwsHand: "right",
        primaryPosition: "",
      });
      setShowAddPlayer(false);
      fetchTeam();
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seasonName.trim()) return;
    setSaving(true);
    try {
      await apiFetch("/api/seasons", {
        method: "POST",
        body: JSON.stringify({ teamId, name: seasonName.trim() }),
      });
      setSeasonName("");
      setShowCreateSeason(false);
      fetchTeam();
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setEditForm({
      firstName: player.firstName,
      lastName: player.lastName,
      jerseyNumber: player.jerseyNumber?.toString() ?? "",
      bats: player.bats,
      throwsHand: player.throwsHand,
      primaryPosition: player.primaryPosition || "",
    });
  };

  const handleEditPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;
    setSaving(true);
    try {
      await apiFetch(`/api/teams/${teamId}/players/${editingPlayer.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...editForm,
          jerseyNumber: editForm.jerseyNumber
            ? parseInt(editForm.jerseyNumber)
            : null,
        }),
      });
      setEditingPlayer(null);
      fetchTeam();
    } catch {
      // handle
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm(t("removePlayerConfirm"))) return;
    try {
      await apiFetch(`/api/teams/${teamId}/players/${playerId}`, {
        method: "DELETE",
      });
      fetchTeam();
    } catch {
      // handle
    }
  };

  const handleDeleteAllGames = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/teams/${teamId}/games`, {
        method: "DELETE",
      });
      setShowDeleteGames(false);
      fetchTeam();
    } catch {
      // handle
    } finally {
      setDeleting(false);
    }
  };

  const openSettings = () => {
    if (!team) return;
    setSettingsName(team.name);
    setSettingsValues({ sport: team.sport, level: team.level, defaultInnings: team.defaultInnings });
    setSettingsError(null);
    setShowSettings(true);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSettingsError(null);
    try {
      await apiFetch(`/api/teams/${teamId}`, {
        method: "PUT",
        body: JSON.stringify({ name: settingsName, ...settingsValues }),
      });
      setShowSettings(false);
      fetchTeam();
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSeason = async (seasonId: string) => {
    try {
      await apiFetch(`/api/seasons/${seasonId}`, { method: "DELETE" });
      fetchTeam();
    } catch {
      // handle
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!team) {
    return <p className="py-10 text-center text-gray-500">{t("teamNotFound")}</p>;
  }

  const liveGame = team.games.find((g) => g.status === "in_progress");
  const finalGames = team.games.filter((g) => g.status === "final");
  // Games come newest first; show the streak oldest → newest, left to right.
  const lastFive = finalGames.slice(0, 5).reverse();
  // Game dates are stored as plain dates at midnight UTC.
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const nextGame = team.games
    .filter((g) => g.status === "scheduled" && new Date(g.gameDate) >= today)
    .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime())[0];

  const record = summary?.record ?? {
    wins: finalGames.filter((g) => gameOutcome(g) === "W").length,
    losses: finalGames.filter((g) => gameOutcome(g) === "L").length,
    ties: finalGames.filter((g) => gameOutcome(g) === "T").length,
    runsFor: finalGames.reduce((sum, g) => sum + g.ourScore, 0),
    runsAgainst: finalGames.reduce((sum, g) => sum + g.opponentScore, 0),
  };
  const runDiff = record.runsFor - record.runsAgainst;

  // Only rank hitters with a meaningful number of trips to the plate, so a
  // 1-for-1 cameo doesn't top the leaderboard.
  const maxPA = Math.max(0, ...(summary?.playerStats ?? []).map((ps) => ps.stats.plateAppearances));
  const battingLeaders = (summary?.playerStats ?? [])
    .filter((ps) => ps.stats.plateAppearances >= Math.max(1, Math.floor(maxPA / 2)))
    .sort((a, b) => parseFloat(b.stats.avg) - parseFloat(a.stats.avg) || b.stats.hits - a.stats.hits)
    .slice(0, 5);
  const pitchingLeaders = [...(summary?.pitchingStats ?? [])]
    .sort((a, b) => b.stats.outs - a.stats.outs)
    .slice(0, 5);

  const levelLabel = LEVELS.find((l) => l.value === team.level)?.label || team.level;
  const handLabel = (hand: string) =>
    hand === "left" ? t("left") : hand === "switch" ? t("switch") : t("right");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{team.name}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {td(team.sport === "softball" ? "softball" : "baseball")} · {levelLabel} ·{" "}
            <button onClick={openSettings} className="underline decoration-dotted underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200">
              {t("gameLengthShort", { count: team.defaultInnings })}
            </button>
            {team.seasons[0] && <> · {team.seasons[0].name}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={openSettings} className="gap-1.5">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t("teamSettings")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowCreateSeason(true)}>
            {t("addSeason")}
          </Button>
          <Link href={`/teams/${teamId}/stats`} className="lg:hidden">
            <Button variant="secondary" size="sm">
              {t("seasonStats")}
            </Button>
          </Link>
          {liveGame && (
            <Link href={`/games/${liveGame.id}/live`}>
              <Button size="sm" className="gap-1.5">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5-12-7.5z" /></svg>
                {t("resumeLive")}
              </Button>
            </Link>
          )}
          <Link href={`/games/new?teamId=${teamId}`}>
            <Button size="sm" variant={liveGame ? "secondary" : "primary"}>
              {t("newGame")}
            </Button>
          </Link>
        </div>
      </div>

      {/* At-a-glance summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <Card className="p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("record")}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {record.wins}–{record.losses}
            {record.ties > 0 && <>–{record.ties}</>}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("runs")}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {record.runsFor}
            <span className="font-normal text-gray-300 dark:text-gray-600"> / </span>
            {record.runsAgainst}
          </p>
          {finalGames.length > 0 && (
            <p className={`mt-1 text-xs font-medium ${runDiff >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {t("runDiff", { diff: runDiff > 0 ? `+${runDiff}` : runDiff })}
            </p>
          )}
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("streak")}</p>
          <div className="mt-2.5 flex gap-1.5">
            {lastFive.length === 0 ? (
              <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">—</span>
            ) : (
              lastFive.map((g) => <OutcomeBadge key={g.id} outcome={gameOutcome(g)} />)
            )}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t("nextUp")}</p>
          {nextGame ? (
            <>
              <p className="mt-2 truncate font-semibold">
                {nextGame.isHome ? "vs" : "@"} {nextGame.opponentName}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {new Date(nextGame.gameDate).toLocaleDateString(undefined, { timeZone: "UTC" })}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{t("nothingScheduled")}</p>
          )}
        </Card>
      </div>

      {liveGame && (
        <Link
          href={`/games/${liveGame.id}/live`}
          className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 transition-colors hover:bg-blue-100/70 dark:border-blue-500/30 dark:bg-blue-500/10 dark:hover:bg-blue-500/15"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-blue-900 dark:text-blue-200">
              {t("live")} — {liveGame.isHome ? "vs" : "@"} {liveGame.opponentName}
            </p>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80">
              {t("tapToResume", { score: `${liveGame.ourScore}–${liveGame.opponentScore}` })}
              {" · "}
              {t("inProgress", { half: liveGame.isTopOfInning ? t("top") : t("bot"), inning: liveGame.currentInning })}
            </p>
          </div>
          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Games */}
        <Card className="p-0">
          <div className="flex items-center justify-between px-5 pb-2 pt-5">
            <h2 className="font-semibold">
              {t("recentGames", { count: team._count?.games ?? team.games.length })}
            </h2>
          </div>
          {team.games.length === 0 ? (
            <p className="px-5 pb-6 pt-2 text-sm text-gray-500 dark:text-gray-400">{t("noGames")}</p>
          ) : (
            <ul className="max-h-[26rem] overflow-y-auto px-2 pb-2">
              {team.games.map((game) => (
                <li key={game.id}>
                  <Link
                    href={`/games/${game.id}/live`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5"
                  >
                    {game.status === "final" ? (
                      <OutcomeBadge outcome={gameOutcome(game)} />
                    ) : (
                      <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${game.status === "in_progress" ? "bg-blue-100 dark:bg-blue-500/15" : "bg-gray-100 dark:bg-gray-800"}`}>
                        <span className={`h-2 w-2 rounded-full ${game.status === "in_progress" ? "bg-blue-600" : "bg-gray-400"}`} />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {game.isHome ? "vs" : "@"} {game.opponentName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(game.gameDate).toLocaleDateString(undefined, { timeZone: "UTC" })}
                        {game.status === "in_progress" && (
                          <> · {t("inProgress", { half: game.isTopOfInning ? t("top") : t("bot"), inning: game.currentInning })}</>
                        )}
                        {game.status === "scheduled" && <> · {t("scheduled")}</>}
                      </p>
                    </div>
                    {game.status !== "scheduled" && (
                      <p className="text-sm font-semibold tabular-nums">
                        {game.ourScore}–{game.opponentScore}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Leaders */}
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <svg className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
              </svg>
              {t("battingLeaders")}
            </h2>
            {battingLeaders.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t("noLeaders")}</p>
            ) : (
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    <th className="pb-1.5 text-left font-medium">{t("player")}</th>
                    <th className="pb-1.5 text-right font-medium">AVG</th>
                    <th className="pb-1.5 text-right font-medium">H</th>
                    <th className="pb-1.5 text-right font-medium">RBI</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {battingLeaders.map((ps) => (
                    <tr key={ps.player.id}>
                      <td className="truncate py-1">{playerLabel(ps.player)}</td>
                      <td className="py-1 text-right font-semibold">{ps.stats.avg}</td>
                      <td className="py-1 text-right text-gray-600 dark:text-gray-300">{ps.stats.hits}</td>
                      <td className="py-1 text-right text-gray-600 dark:text-gray-300">{ps.stats.rbi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              {t("pitchingLeaders")}
            </h2>
            {pitchingLeaders.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t("noLeaders")}</p>
            ) : (
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    <th className="pb-1.5 text-left font-medium">{t("player")}</th>
                    <th className="pb-1.5 text-right font-medium">IP</th>
                    <th className="pb-1.5 text-right font-medium">K</th>
                    <th className="pb-1.5 text-right font-medium">ERA</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {pitchingLeaders.map((ps) => (
                    <tr key={ps.player.id}>
                      <td className="truncate py-1">{playerLabel(ps.player)}</td>
                      <td className="py-1 text-right text-gray-600 dark:text-gray-300">{ps.stats.ip}</td>
                      <td className="py-1 text-right text-gray-600 dark:text-gray-300">{ps.stats.strikeouts}</td>
                      <td className="py-1 text-right font-semibold">{ps.stats.era}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>

      {/* Roster */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {t("roster", { count: team.players.length })}
          </h2>
          <Button size="sm" variant="secondary" onClick={() => setShowAddPlayer(true)}>
            {t("addPlayer")}
          </Button>
        </div>

        {team.players.length === 0 ? (
          <Card>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("noPlayers")}
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {team.players.map((player) => (
              <Card key={player.id} className="flex items-center gap-4 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700 tabular-nums dark:bg-blue-500/10 dark:text-blue-300">
                  {player.jerseyNumber ?? "–"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {player.firstName} {player.lastName}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {t("bats")} {handLabel(player.bats)} · {t("throws")} {handLabel(player.throwsHand)}
                  </p>
                  {player.primaryPosition && (
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {t("pos")}: <span className="font-medium text-gray-700 dark:text-gray-200">{player.primaryPosition}</span>
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => openEditModal(player)}
                    aria-label={tc("edit")}
                    title={tc("edit")}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    aria-label={t("remove")}
                    title={t("remove")}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Seasons */}
      {team.seasons.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">{t("seasons")}</h2>
          <div className="flex flex-wrap gap-2">
            {team.seasons.map((season) => (
              <span
                key={season.id}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white py-1.5 pl-4 pr-2 text-sm font-medium dark:border-white/10 dark:bg-gray-900"
              >
                {season.name}
                <button
                  onClick={() => {
                    if (confirm(t("deleteSeasonConfirm", { name: season.name }))) {
                      handleDeleteSeason(season.id);
                    }
                  }}
                  aria-label={tc("delete")}
                  title={tc("delete")}
                  className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      {team.games.length > 0 && (
        <div className="flex justify-end border-t border-black/[0.06] pt-4 dark:border-white/10">
          <button
            onClick={() => setShowDeleteGames(true)}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            {t("deleteAllGames", { count: team._count?.games ?? team.games.length })}
          </button>
        </div>
      )}

      {/* Add Player Modal */}
      <Modal
        isOpen={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
        title={t("addPlayerTitle")}
      >
        <form onSubmit={handleAddPlayer} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              label={t("firstName")}
              value={playerForm.firstName}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, firstName: e.target.value })
              }
              required
            />
            <Input
              id="lastName"
              label={t("lastName")}
              value={playerForm.lastName}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="jerseyNumber"
              label={t("jersey")}
              type="number"
              value={playerForm.jerseyNumber}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, jerseyNumber: e.target.value })
              }
            />
            <Select
              id="bats"
              label={t("bats")}
              value={playerForm.bats}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, bats: e.target.value })
              }
              options={[
                { value: "right", label: t("right") },
                { value: "left", label: t("left") },
                { value: "switch", label: t("switch") },
              ]}
            />
            <Select
              id="throws"
              label={t("throws")}
              value={playerForm.throwsHand}
              onChange={(e) =>
                setPlayerForm({ ...playerForm, throwsHand: e.target.value })
              }
              options={[
                { value: "right", label: t("right") },
                { value: "left", label: t("left") },
              ]}
            />
          </div>
          <Select
            id="position"
            label={t("primaryPosition")}
            value={playerForm.primaryPosition}
            onChange={(e) =>
              setPlayerForm({ ...playerForm, primaryPosition: e.target.value })
            }
            options={[
              { value: "", label: t("select") },
              ...POSITIONS.map((p) => ({ value: p, label: p })),
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowAddPlayer(false)}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("adding") : t("addPlayerTitle")}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Season Modal */}
      <Modal
        isOpen={showCreateSeason}
        onClose={() => setShowCreateSeason(false)}
        title={t("createSeasonTitle")}
      >
        <form onSubmit={handleCreateSeason} className="space-y-4">
          <Input
            id="seasonName"
            label={t("seasonNameLabel")}
            placeholder={t("seasonNamePlaceholder")}
            value={seasonName}
            onChange={(e) => setSeasonName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowCreateSeason(false)}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("creating") : t("createSeason")}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete All Games Confirmation */}
      <Modal
        isOpen={showDeleteGames}
        onClose={() => setShowDeleteGames(false)}
        title={t("deleteAllGamesTitle")}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t.rich("deleteAllConfirm", {
              count: team._count?.games ?? team.games.length,
              name: team.name,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="text-sm font-medium text-red-600">{t("cannotBeUndone")}</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteGames(false)}>
              {tc("cancel")}
            </Button>
            <Button variant="danger" onClick={handleDeleteAllGames} disabled={deleting}>
              {deleting ? t("deleting") : t("deleteAllGamesTitle")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Team Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title={t("teamSettings")}
      >
        <form onSubmit={handleSaveSettings} className="space-y-4">
          {settingsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
              {settingsError}
            </div>
          )}
          <Input
            id="settingsTeamName"
            label={td("teamNameLabel")}
            value={settingsName}
            onChange={(e) => setSettingsName(e.target.value)}
            required
          />
          <TeamSettingsFields idPrefix="settings" value={settingsValues} onChange={setSettingsValues} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowSettings(false)}>
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Player Modal */}
      <Modal
        isOpen={!!editingPlayer}
        onClose={() => setEditingPlayer(null)}
        title={t("editPlayerTitle")}
      >
        <form onSubmit={handleEditPlayer} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="editFirstName"
              label={t("firstName")}
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
              required
            />
            <Input
              id="editLastName"
              label={t("lastName")}
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="editJerseyNumber"
              label={t("jersey")}
              type="number"
              value={editForm.jerseyNumber}
              onChange={(e) =>
                setEditForm({ ...editForm, jerseyNumber: e.target.value })
              }
            />
            <Select
              id="editBats"
              label={t("bats")}
              value={editForm.bats}
              onChange={(e) =>
                setEditForm({ ...editForm, bats: e.target.value })
              }
              options={[
                { value: "right", label: t("right") },
                { value: "left", label: t("left") },
                { value: "switch", label: t("switch") },
              ]}
            />
            <Select
              id="editThrows"
              label={t("throws")}
              value={editForm.throwsHand}
              onChange={(e) =>
                setEditForm({ ...editForm, throwsHand: e.target.value })
              }
              options={[
                { value: "right", label: t("right") },
                { value: "left", label: t("left") },
              ]}
            />
          </div>
          <Select
            id="editPosition"
            label={t("primaryPosition")}
            value={editForm.primaryPosition}
            onChange={(e) =>
              setEditForm({ ...editForm, primaryPosition: e.target.value })
            }
            options={[
              { value: "", label: t("select") },
              ...POSITIONS.map((p) => ({ value: p, label: p })),
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditingPlayer(null)}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
