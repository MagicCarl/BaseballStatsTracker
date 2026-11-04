"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/useApi";
import { AtBatRecord, LineupEntryRecord, OpponentPitcherRecord, OpponentBatterRecord, Player, Team } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { RESULT_LABELS, RESULT_FULL_NAMES, ALL_RESULTS, AT_BAT_RESULTS, PITCH_RESULTS, PITCH_RESULT_LABELS, PITCH_RESULT_COLORS } from "@/lib/constants";
import {
  BASE_PLAY_TYPES,
  BATTER,
  Base,
  Bases,
  Destination,
  EMPTY_BASES,
  RunnerMoves,
  buildPlays,
  checkMoves,
  defaultBasePlayMoves,
  defaultMoves,
  defaultRbi,
  gameLooksOver,
  nextBatterIndex,
  pitchCount,
  replayPlays,
  resultFromPitches,
  runsInMoves,
  setRunnerMove,
  weAreBatting,
  withoutNoOps,
} from "@/lib/game-state";
import BaseDiamond from "@/components/game/BaseDiamond";
import SprayChartDiamond from "@/components/spray-chart/SprayChartDiamond";
import StrikeZone from "@/components/pitch-chart/StrikeZone";

interface PitchingAppearanceRecord {
  id: string;
  player?: { firstName: string; lastName: string };
}

interface GameDetail {
  id: string;
  teamId: string;
  team?: { name: string };
  opponentName: string;
  gameDate: string;
  isHome: boolean;
  inningsCount: number;
  status: string;
  ourScore: number;
  opponentScore: number;
  currentInning: number;
  isTopOfInning: boolean;
  outsInCurrentInning: number;
  lineupEntries: (LineupEntryRecord & { player: { firstName: string; lastName: string; jerseyNumber: number | null } })[];
  atBats: AtBatRecord[];
  opponentPitchers: OpponentPitcherRecord[];
  opponentBatters: OpponentBatterRecord[];
  basePlays: BasePlayRecord[];
  pitchingAppearances: PitchingAppearanceRecord[];
}

interface BasePlayRecord {
  id: string;
  sequence: number;
  inning: number;
  isTop: boolean;
  isOurTeam: boolean;
  type: string;
  runnerMoves: unknown;
  extraOuts: number;
  extraRuns: number;
  runsScored: number;
}

type ScoringMode = "our_batting" | "opponent_batting";

const BATTED_BALL_EXCLUDED = ["walk", "hbp", "ibb", "catchers_interference", "strikeout_swinging", "strikeout_looking"];
const isBattedBall = (result: string | null) => !!result && !BATTED_BALL_EXCLUDED.includes(result);

export default function LiveScoringPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { apiFetch } = useApi();
  const t = useTranslations("games.live");
  const tc = useTranslations("common");
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Our batting state
  const [currentBatterIndex, setCurrentBatterIndex] = useState(0);
  const [manualBatterIndex, setManualBatterIndex] = useState<number | null>(null);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [moves, setMoves] = useState<RunnerMoves>({});
  const [rbiOverride, setRbiOverride] = useState<number | null>(null);
  const [hitLocation, setHitLocation] = useState<{ x: number; y: number } | null>(null);
  const [selectedPitcherId, setSelectedPitcherId] = useState<string>("");

  // Opponent batting state
  const [currentOppBatterIndex, setCurrentOppBatterIndex] = useState(0);
  const [manualOppBatterIndex, setManualOppBatterIndex] = useState<number | null>(null);
  const [oppSelectedResult, setOppSelectedResult] = useState<string | null>(null);
  const [oppMoves, setOppMoves] = useState<RunnerMoves>({});
  const [oppRbiOverride, setOppRbiOverride] = useState<number | null>(null);
  const [oppResultAuto, setOppResultAuto] = useState(false);
  const [oppHitLocation, setOppHitLocation] = useState<{ x: number; y: number } | null>(null);
  const [selectedOurPitcherId, setSelectedOurPitcherId] = useState<string>("");

  // Pitch tracking state
  const [currentPitches, setCurrentPitches] = useState<{ result: string; locationX: number | null; locationY: number | null }[]>([]);
  const [pitchLocation, setPitchLocation] = useState<{ x: number; y: number } | null>(null);
  const [selectedPitchResult, setSelectedPitchResult] = useState<string | null>(null);

  // Modals
  const [showPitcherModal, setShowPitcherModal] = useState(false);
  const [newPitcherName, setNewPitcherName] = useState("");
  const [newPitcherHand, setNewPitcherHand] = useState("right");
  const [showBatterModal, setShowBatterModal] = useState(false);
  const [newBatterName, setNewBatterName] = useState("");
  const [newBatterNumber, setNewBatterNumber] = useState("");
  const [newBatterHand, setNewBatterHand] = useState("right");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Shown briefly after the 3rd out so the out registers before the count resets.
  const [sideRetired, setSideRetired] = useState<ScoringMode | null>(null);
  const sideRetiredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
  const [showLineupSetup, setShowLineupSetup] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [lineupDraft, setLineupDraft] = useState<{ playerId: string; position: string }[]>([]);

  // Edit at-bat state (for correcting previous at-bats)
  const [editingAtBatId, setEditingAtBatId] = useState<string | null>(null);
  const [editResult, setEditResult] = useState("");
  const [editMoves, setEditMoves] = useState<RunnerMoves | null>(null);
  const [editRbi, setEditRbi] = useState<number | null>(0);
  const [editRuns, setEditRuns] = useState(0);

  // A play between at-bats, started by tapping a runner
  const [runnerPlay, setRunnerPlay] = useState<{ type: string; runner: string | null; moves: RunnerMoves } | null>(null);
  const [showEndHalf, setShowEndHalf] = useState(false);
  const [endHalfRuns, setEndHalfRuns] = useState(0);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const rosterAutoLoadedRef = useRef(false);
  // One id per play being entered, so a retry after a lost response can't save it twice.
  const playIdRef = useRef(crypto.randomUUID());
  // A play saved on any device clears a half-finished form, which would be out of date.
  const lastRunnersKeyRef = useRef<string | null>(null);
  const lastBatterKeyRef = useRef<string | null>(null);
  const appliedSeqRef = useRef(0);
  const pollStartedRef = useRef(0);
  // A slow poll must not overwrite the newer score from a save that finished first.
  const fetchSeqRef = useRef(0);
  // Last half-inning seen (inning * 2, +1 for the bottom), to detect changes.
  const lastHalfRef = useRef<number | null>(null);
  const selectedPitcherIdRef = useRef(selectedPitcherId);
  const selectedOurPitcherIdRef = useRef(selectedOurPitcherId);
  useEffect(() => {
    selectedPitcherIdRef.current = selectedPitcherId;
    selectedOurPitcherIdRef.current = selectedOurPitcherId;
  }, [selectedPitcherId, selectedOurPitcherId]);

  // The runners changed, but the same batter is still up.
  const clearPlayEntry = useCallback(() => {
    playIdRef.current = crypto.randomUUID();
    setSelectedResult(null);
    setMoves({});
    setRbiOverride(null);
    setOppSelectedResult(null);
    setOppMoves({});
    setOppRbiOverride(null);
    setOppResultAuto(false);
    setRunnerPlay(null);
  }, []);

  const clearForms = useCallback(() => {
    clearPlayEntry();
    setHitLocation(null);
    setManualBatterIndex(null);
    setOppHitLocation(null);
    setManualOppBatterIndex(null);
    setCurrentPitches([]);
    setPitchLocation(null);
    setSelectedPitchResult(null);
  }, [clearPlayEntry]);

  const fetchGame = useCallback(async () => {
    const seq = ++fetchSeqRef.current;
    try {
      let data = await apiFetch(`/api/games/${gameId}`);

      // Auto-load opponent roster from a matching team on the dashboard (runs once, before setting state)
      if (!rosterAutoLoadedRef.current) {
        rosterAutoLoadedRef.current = true;
        if (!data.opponentBatters || data.opponentBatters.length === 0) {
          try {
            const teams: Team[] = await apiFetch("/api/teams");
            const opponentName = data.opponentName.toLowerCase();
            const matchingTeam = teams.find(
              (t) => t.name.toLowerCase() === opponentName && t.id !== data.teamId
            );
            if (matchingTeam) {
              const players: Player[] = await apiFetch(`/api/teams/${matchingTeam.id}/players`);
              if (players.length > 0) {
                for (const player of players) {
                  await apiFetch(`/api/games/${gameId}/opponent-batters`, {
                    method: "POST",
                    body: JSON.stringify({
                      name: `${player.firstName} ${player.lastName}`,
                      jerseyNumber: player.jerseyNumber,
                      bats: player.bats,
                    }),
                  });
                }
                data = await apiFetch(`/api/games/${gameId}`);
              }
            }
          } catch {
            // Auto-load failed — user can still add batters manually
          }
        }
      }

      // Only a response older than what's on screen is dropped, so slow networks still update.
      if (seq < appliedSeqRef.current) return;
      appliedSeqRef.current = seq;
      setGame(data);

      // Follow the game: whoever is batting in the current half-inning gets the
      // scoring screen (home bats in the bottom). Runs on first load and whenever
      // the half-inning changes — from a 3rd out here, another device, or undo.
      // The toggle still lets the scorer override it within a half-inning.
      const half = data.currentInning * 2 + (data.isTopOfInning ? 0 : 1);
      if (lastHalfRef.current !== half) {
        const mode: ScoringMode = weAreBatting(data.isHome, data.isTopOfInning) ? "our_batting" : "opponent_batting";
        if (lastHalfRef.current !== null && half > lastHalfRef.current && data.status !== "final") {
          setSideRetired(mode);
          if (sideRetiredTimerRef.current) clearTimeout(sideRetiredTimerRef.current);
          sideRetiredTimerRef.current = setTimeout(() => setSideRetired(null), 5000);
        }
        lastHalfRef.current = half;
      }

      const batterKey = data.atBats.map((ab: AtBatRecord) => ab.id).join() + half;
      const runnersKey = JSON.stringify([
        data.atBats.map((ab: AtBatRecord) => ab.runnerMoves),
        data.basePlays.map((bp: BasePlayRecord) => [bp.id, bp.runnerMoves]),
      ]);
      if (lastBatterKeyRef.current !== null && lastBatterKeyRef.current !== batterKey) {
        clearForms();
      } else if (lastRunnersKeyRef.current !== null && lastRunnersKeyRef.current !== runnersKey) {
        clearPlayEntry();
      }
      lastBatterKeyRef.current = batterKey;
      lastRunnersKeyRef.current = runnersKey;

      if (data.opponentPitchers.length > 0 && !selectedPitcherIdRef.current) {
        setSelectedPitcherId(data.opponentPitchers[data.opponentPitchers.length - 1].id);
      }
      // Advance our batter: cycle through lineup based on our team's at-bats
      if (data.lineupEntries.length > 0) {
        const ourAtBats = data.atBats.filter((ab: AtBatRecord) => ab.playerId);
        setCurrentBatterIndex(
          nextBatterIndex(
            data.lineupEntries.map((e: LineupEntryRecord) => e.playerId),
            ourAtBats[ourAtBats.length - 1]?.playerId,
            ourAtBats[ourAtBats.length - 1]?.lineupSpot
          )
        );
      }
      // Advance opponent batter
      if (data.opponentBatters?.length > 0) {
        const oppAtBats = data.atBats.filter((ab: AtBatRecord) => ab.opponentBatterId);
        setCurrentOppBatterIndex(
          nextBatterIndex(
            data.opponentBatters.map((b: OpponentBatterRecord) => b.id),
            oppAtBats[oppAtBats.length - 1]?.opponentBatterId
          )
        );
      }
      // Set our pitcher if available
      if (data.pitchingAppearances?.length > 0 && !selectedOurPitcherIdRef.current) {
        setSelectedOurPitcherId(data.pitchingAppearances[data.pitchingAppearances.length - 1].id);
      }
    } catch {
      // The next poll tries again
    } finally {
      if (seq >= appliedSeqRef.current) setLoading(false);
    }
  }, [apiFetch, clearForms, clearPlayEntry, gameId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads data on mount; state changes after the request
    fetchGame();
  }, [fetchGame]);

  const gameStatus = game?.status;

  // Poll for updates every 3 seconds so other devices see changes in real time
  useEffect(() => {
    if (gameStatus === "final") return;
    const interval = setInterval(() => {
      // Don't stack requests on a slow connection, but don't wait forever on a stuck one.
      if (Date.now() - pollStartedRef.current < 15000) return;
      pollStartedRef.current = Date.now();
      fetchGame().finally(() => {
        pollStartedRef.current = 0;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [gameStatus, fetchGame]);

  const replay = useMemo(
    () => (game ? replayPlays(buildPlays(game.atBats, game.basePlays ?? [])) : null),
    [game]
  );
  const bases: Bases = replay?.bases ?? EMPTY_BASES;
  const outs = game?.outsInCurrentInning ?? 0;

  // The pitches can decide the result. Undoing that pitch undoes the result.
  const resultFromCount = resultFromPitches(currentPitches);
  useEffect(() => {
    if (resultFromCount && !oppSelectedResult) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- preselects a result the scorer can still change, so it can't be derived
      setOppSelectedResult(resultFromCount);
      setOppMoves(defaultMoves(resultFromCount, bases, outs));
      setOppRbiOverride(null);
      setOppResultAuto(true);
    } else if (!resultFromCount && oppResultAuto) {
      setOppSelectedResult(null);
      setOppMoves({});
      setOppResultAuto(false);
    }
  }, [resultFromCount, oppSelectedResult, oppResultAuto, bases, outs]);

  // Our batting
  const activeBatterIndex = manualBatterIndex ?? currentBatterIndex;
  const currentBatter = game?.lineupEntries?.[activeBatterIndex];

  // Opponent batting
  const activeOppBatterIndex = manualOppBatterIndex ?? currentOppBatterIndex;
  const currentOppBatter = game?.opponentBatters?.[activeOppBatterIndex];

  const handleRecordAtBat = async () => {
    if (!selectedResult || !currentBatter || !game) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      await apiFetch(`/api/games/${gameId}/at-bats`, {
        method: "POST",
        body: JSON.stringify({
          id: playIdRef.current,
          playerId: currentBatter.playerId,
          opponentPitcherId: selectedPitcherId || null,
          result: selectedResult,
          runnerMoves: moves,
          rbi: rbiOverride ?? defaultRbi(selectedResult, moves),
          lineupSpot: activeBatterIndex + 1,
          hitLocationX: isBattedBall(selectedResult) ? hitLocation?.x ?? null : null,
          hitLocationY: isBattedBall(selectedResult) ? hitLocation?.y ?? null : null,
        }),
      });

      clearForms();
      await fetchGame();
    } catch {
      setErrorMsg(t("errAtBat"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordOppAtBat = async () => {
    if (!oppSelectedResult || !currentOppBatter || !game) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      await apiFetch(`/api/games/${gameId}/at-bats`, {
        method: "POST",
        body: JSON.stringify({
          id: playIdRef.current,
          opponentBatterId: currentOppBatter.id,
          result: oppSelectedResult,
          runnerMoves: oppMoves,
          rbi: oppRbiOverride ?? defaultRbi(oppSelectedResult, oppMoves),
          hitLocationX: isBattedBall(oppSelectedResult) ? oppHitLocation?.x ?? null : null,
          hitLocationY: isBattedBall(oppSelectedResult) ? oppHitLocation?.y ?? null : null,
          pitches: currentPitches,
        }),
      });

      clearForms();
      await fetchGame();
    } catch {
      setErrorMsg(t("errOppAtBat"));
    } finally {
      setSubmitting(false);
    }
  };

  const openRunnerPlay = (runner: string | null) => {
    setRunnerPlay({ type: "stolen_base", runner, moves: defaultBasePlayMoves("stolen_base", bases, runner) });
  };

  const handleSaveRunnerPlay = async () => {
    if (!runnerPlay) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await apiFetch(`/api/games/${gameId}/base-plays`, {
        method: "POST",
        body: JSON.stringify({
          id: playIdRef.current,
          type: runnerPlay.type,
          runnerMoves: withoutNoOps(runnerPlay.moves, bases),
        }),
      });
      setRunnerPlay(null);
      playIdRef.current = crypto.randomUUID();
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndHalf = async () => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      await apiFetch(`/api/games/${gameId}/base-plays`, {
        method: "POST",
        body: JSON.stringify({ id: playIdRef.current, type: "end_half", extraRuns: endHalfRuns }),
      });
      setShowEndHalf(false);
      setEndHalfRuns(0);
      playIdRef.current = crypto.randomUUID();
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPitch = () => {
    if (!selectedPitchResult) return;
    setCurrentPitches([
      ...currentPitches,
      {
        result: selectedPitchResult,
        locationX: pitchLocation?.x ?? null,
        locationY: pitchLocation?.y ?? null,
      },
    ]);
    setPitchLocation(null);
    setSelectedPitchResult(null);
  };

  const handleRemoveLastPitch = () => {
    setCurrentPitches(currentPitches.slice(0, -1));
  };

  const selectResult = (result: string) => {
    setMoves(defaultMoves(result, bases, outs));
    setRbiOverride(null);
    setSelectedResult(result);
  };

  const selectOppResult = (result: string) => {
    setOppMoves(defaultMoves(result, bases, outs));
    setOppRbiOverride(null);
    setOppSelectedResult(result);
    setOppResultAuto(false);
  };

  const handleUndo = async () => {
    if (!game || submitting) return;
    const last = playsInOrder(game).pop();
    if (!last) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      const path = last.isBasePlay ? "base-plays" : "at-bats";
      await apiFetch(`/api/games/${gameId}/${path}/${last.id}`, { method: "DELETE" });
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAtBat = async () => {
    if (!editingAtBatId) return;
    const ab = game?.atBats.find((a) => a.id === editingAtBatId);
    try {
      await apiFetch(`/api/games/${gameId}/at-bats/${editingAtBatId}`, {
        method: "PATCH",
        body: JSON.stringify(
          ab?.runnerMoves
            ? {
                result: editResult,
                rbi: editRbi ?? defaultRbi(editResult, editMoves ?? {}),
                ...(editMoves ? { runnerMoves: editMoves } : {}),
              }
            : { result: editResult, rbi: editRbi ?? 0, runsScored: editRuns }
        ),
      });
      setEditingAtBatId(null);
      await fetchGame();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : t("errSave"));
    }
  };

  const handleSwitchHomeAway = async () => {
    if (!game) return;
    try {
      await apiFetch(`/api/games/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({ isHome: !game.isHome }),
      });
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    }
  };

  const handleEndGame = async () => {
    try {
      await apiFetch(`/api/games/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "final" }),
      });
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    }
  };

  const handleReopenGame = async () => {
    try {
      await apiFetch(`/api/games/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "in_progress" }),
      });
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    }
  };

  const handleAddPitcher = async () => {
    if (!newPitcherName.trim()) return;
    try {
      const pitcher = await apiFetch(`/api/games/${gameId}/opponent-pitchers`, {
        method: "POST",
        body: JSON.stringify({
          name: newPitcherName.trim(),
          throwsHand: newPitcherHand,
        }),
      });
      setSelectedPitcherId(pitcher.id);
      setNewPitcherName("");
      setShowPitcherModal(false);
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    }
  };

  const handleAddBatter = async () => {
    if (!newBatterName.trim()) return;
    try {
      await apiFetch(`/api/games/${gameId}/opponent-batters`, {
        method: "POST",
        body: JSON.stringify({
          name: newBatterName.trim(),
          jerseyNumber: newBatterNumber ? parseInt(newBatterNumber) : null,
          bats: newBatterHand,
        }),
      });
      setNewBatterName("");
      setNewBatterNumber("");
      setShowBatterModal(false);
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    }
  };

  const openLineupSetup = async () => {
    if (!game) return;
    try {
      const players = await apiFetch(`/api/teams/${game.teamId}/players`);
      setAvailablePlayers(players);
      setLineupDraft(
        game.lineupEntries.length > 0
          ? game.lineupEntries.map((e) => ({ playerId: e.playerId, position: e.position || "DH" }))
          : players.slice(0, 10).map((p: Player) => ({
              playerId: p.id,
              position: p.primaryPosition || "DH",
            }))
      );
      setShowLineupSetup(true);
    } catch {
      setErrorMsg(t("errSave"));
    }
  };

  const handleSaveLineup = async () => {
    if (!game || lineupDraft.length === 0) return;
    try {
      await apiFetch(`/api/games/${gameId}/lineup`, {
        method: "PUT",
        body: JSON.stringify({
          lineup: lineupDraft.map((entry, idx) => ({
            playerId: entry.playerId,
            battingOrder: idx + 1,
            position: entry.position,
          })),
        }),
      });
      setShowLineupSetup(false);
      await fetchGame();
    } catch {
      setErrorMsg(t("errSave"));
    }
  };

  const addToLineup = (playerId: string) => {
    const player = availablePlayers.find((p) => p.id === playerId);
    if (!player) return;
    setLineupDraft([
      ...lineupDraft,
      { playerId, position: player.primaryPosition || "DH" },
    ]);
  };

  const removeFromLineup = (index: number) => {
    setLineupDraft(lineupDraft.filter((_, i) => i !== index));
  };

  const moveInLineup = (index: number, direction: "up" | "down") => {
    const newDraft = [...lineupDraft];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newDraft.length) return;
    [newDraft[index], newDraft[target]] = [newDraft[target], newDraft[index]];
    setLineupDraft(newDraft);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!game) {
    return <p className="py-10 text-center text-gray-500">{t("gameNotFound")}</p>;
  }

  const isFinal = game.status === "final";
  const scoringMode: ScoringMode = weAreBatting(game.isHome, game.isTopOfInning) ? "our_batting" : "opponent_batting";
  const hasPlays = game.atBats.length + (game.basePlays?.length ?? 0) > 0;
  const hasRunners = !!(bases[1] || bases[2] || bases[3]);
  const nameFor = (id: string) => {
    const ab = game.atBats.find((a) => a.id === id);
    if (!ab) return t("unknown");
    return ab.player ? `${ab.player.firstName} ${ab.player.lastName}` : ab.opponentBatter?.name || t("unknown");
  };
  const batterName = scoringMode === "our_batting"
    ? `${currentBatter?.player?.firstName ?? ""} ${currentBatter?.player?.lastName ?? ""}`.trim()
    : currentOppBatter?.name ?? "";

  // Pitch count for current at-bat in progress
  const { balls: countBalls, strikes: countStrikes } = pitchCount(currentPitches);

  const handleShare = async () => {
    setShareCopied(false);
    setShowShareModal(true);
    if (shareUrl) return;
    try {
      const { shareToken } = await apiFetch(`/api/games/${gameId}/share`, {
        method: "POST",
      });
      setShareUrl(`${window.location.origin}/watch/${shareToken}`);
    } catch {
      setShowShareModal(false);
    }
  };

  const handleCopyShareUrl = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {
      // clipboard unavailable — the link is still selectable in the input
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.share({
        title: `${game.team?.name || "Our team"} vs ${game.opponentName}`,
        url: shareUrl,
      });
    } catch {
      // user closed the share sheet — no-op
    }
  };

  return (
    <div className="space-y-4">
      {/* Share game modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={t("shareTitle")}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("shareExplain")}
          </p>
          {shareUrl ? (
            <>
              <input
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
              />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleCopyShareUrl}>
                  {shareCopied ? t("shareCopied") : t("shareCopy")}
                </Button>
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <Button variant="ghost" className="flex-1" onClick={handleNativeShare}>
                    {t("shareVia")}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("shareNote")}
          </p>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/teams/${game.teamId}`}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          &larr; {tc("back")}
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            {t("share")}
          </Button>
          <Link href={`/games/${gameId}/box`}>
            <Button variant="ghost" size="sm">{t("boxScore")}</Button>
          </Link>
          {!isFinal && (
            <Button variant="danger" size="sm" onClick={() => setShowEndGameConfirm(true)}>
              {t("endGame")}
            </Button>
          )}
        </div>
      </div>

      {/* Scoreboard */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="max-w-24 truncate text-sm font-semibold">{game.team?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {game.isHome ? t("home") : t("away")}
            </p>
            <p className="text-3xl font-bold">{game.ourScore}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {isFinal
                ? t("final")
                : `${game.isTopOfInning ? t("top") : t("bot")} ${game.currentInning}`}
            </p>
            <p className="text-sm text-gray-400">{t("vsOpponent", { name: game.opponentName })}</p>
            {!isFinal && (
              <div className="mt-1 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-full border ${
                      i < game.outsInCurrentInning
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-400"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-gray-500">{t("outs")}</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="max-w-24 truncate text-sm font-semibold">{game.opponentName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {game.isHome ? t("away") : t("home")}
            </p>
            <p className="text-3xl font-bold">{game.opponentScore}</p>
          </div>
        </div>
      </Card>

      {sideRetired && !isFinal && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 dark:border-yellow-500/40 dark:bg-yellow-500/10"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-3 w-3 rounded-full border border-yellow-500 bg-yellow-500" />
            ))}
          </div>
          <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
            {t("sideRetired")}{" "}
            <span className="font-normal">
              {sideRetired === "our_batting"
                ? t("nowBattingUs")
                : t("nowBattingThem", { name: game.opponentName })}
            </span>
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {isFinal ? (
        <Card className="text-center">
          <p className="text-lg font-semibold">{t("gameOver")}</p>
          <p className="text-sm text-gray-500">
            {t("finalScore", { our: game.ourScore, opp: game.opponentScore })}
          </p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={handleReopenGame}>
            {t("reopenGame")}
          </Button>
        </Card>
      ) : (
        <>
          {/* Who's on base */}
          <Card>
            <BaseDiamond
              bases={bases}
              nameFor={nameFor}
              onRunnerTap={openRunnerPlay}
              emptyLabel={t("basesEmpty")}
            />
            {hasRunners && <p className="mt-2 text-center text-xs text-gray-400">{t("tapRunnerHint")}</p>}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
              <button onClick={() => setShowEndHalf(true)} className="text-blue-600 hover:underline">
                {t("endHalf")}
              </button>
              {!hasPlays && (
                <button onClick={handleSwitchHomeAway} className="text-blue-600 hover:underline">
                  {t("switchHomeAway")}
                </button>
              )}
            </div>
          </Card>

          {gameLooksOver(game, playsInOrder(game).some((p) => p.inning === game.currentInning && p.isTop === game.isTopOfInning)) && (
            <div role="status" className="flex items-center justify-between gap-3 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 dark:border-blue-500/40 dark:bg-blue-500/10">
              <p className="text-sm font-semibold">{t("gameLooksOver")}</p>
              <Button size="sm" onClick={() => setShowEndGameConfirm(true)}>{t("endGame")}</Button>
            </div>
          )}

          {/* ========== OUR TEAM BATTING ========== */}
          {scoringMode === "our_batting" && (
            <>
              {game.lineupEntries.length === 0 ? (
                <Card className="text-center">
                  <p className="mb-2 text-gray-500">{t("noLineup")}</p>
                  <Button onClick={openLineupSetup}>{t("setLineup")}</Button>
                </Card>
              ) : (
                <>
                  <Card>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">
                          {manualBatterIndex !== null ? t("selectedPlayer") : t("nowBatting")}
                        </p>
                        <p className="text-lg font-bold">
                          #{currentBatter?.player?.jerseyNumber ?? "-"}{" "}
                          {currentBatter?.player?.firstName} {currentBatter?.player?.lastName}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {currentBatter?.position} | {t("spot")} #{(activeBatterIndex + 1)}
                        {manualBatterIndex !== null && (
                          <button
                            onClick={() => setManualBatterIndex(null)}
                            className="ml-2 text-xs text-blue-600 hover:underline"
                          >
                            {t("backToNextUp")}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Opponent Pitcher */}
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-xs text-gray-500">{t("pitcher")}</span>
                      <select
                        value={selectedPitcherId}
                        onChange={(e) => setSelectedPitcherId(e.target.value)}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                      >
                        <option value="">{t("unknown")}</option>
                        {game.opponentPitchers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.throwsHand === "left" ? "L" : "R"})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowPitcherModal(true)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {t("addNew")}
                      </button>
                    </div>

                    {/* Result Buttons */}
                    <ResultButtons
                      selectedResult={selectedResult}
                      onSelectResult={selectResult}
                    />

                    {selectedResult && (
                      <RunnersPanel
                        bases={bases}
                        moves={moves}
                        setMoves={setMoves}
                        batterName={batterName}
                        nameFor={nameFor}
                        result={selectedResult}
                        rbi={rbiOverride}
                        setRbi={setRbiOverride}
                      />
                    )}

                    {/* Spray Chart */}
                    {isBattedBall(selectedResult) && (
                      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <p className="mb-2 text-xs font-medium text-gray-500 uppercase">
                          {t("ballLocation")}
                        </p>
                        <SprayChartDiamond
                          interactive
                          selectedLocation={hitLocation}
                          onLocationSelect={setHitLocation}
                          hits={[]}
                          size={250}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleUndo}
                        disabled={!hasPlays || submitting}
                      >
                        {t("undoLast")}
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleRecordAtBat}
                        disabled={!selectedResult || submitting || !!checkMoves(moves, bases, true)}
                      >
                        {submitting ? t("recording") : t("recordAtBat")}
                      </Button>
                    </div>
                  </Card>

                  {/* Lineup */}
                  <Card>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{t("battingOrder")}</h3>
                      <button onClick={openLineupSetup} className="text-xs text-blue-600 hover:underline">
                        {t("editLineup")}
                      </button>
                    </div>
                    <p className="mb-2 text-xs text-gray-400">{t("tapPlayerHint")}</p>
                    <div className="space-y-1">
                      {game.lineupEntries.map((entry, idx) => (
                        <button
                          key={entry.id}
                          onClick={() => setManualBatterIndex(idx === activeBatterIndex ? null : idx)}
                          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-left transition-colors ${
                            idx === activeBatterIndex
                              ? "bg-blue-50 font-medium ring-1 ring-blue-300 dark:bg-blue-900/30 dark:ring-blue-700"
                              : idx === currentBatterIndex
                              ? "bg-gray-50 dark:bg-gray-800/50"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <span>
                            {idx + 1}. #{entry.player.jerseyNumber ?? "-"}{" "}
                            {entry.player.firstName} {entry.player.lastName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{entry.position}</span>
                            {idx === currentBatterIndex && manualBatterIndex !== null && (
                              <span className="text-xs text-blue-500">{t("nextUp")}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </>
          )}

          {/* ========== OPPONENT BATTING ========== */}
          {scoringMode === "opponent_batting" && (
            <>
              {(!game.opponentBatters || game.opponentBatters.length === 0) ? (
                <Card className="text-center">
                  <p className="mb-2 text-gray-500">
                    {t("noOppBatters")}
                  </p>
                  <Button onClick={() => setShowBatterModal(true)}>
                    {t("addOppBatter")}
                  </Button>
                </Card>
              ) : (
                <>
                  <Card>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-red-500 uppercase">
                          {manualOppBatterIndex !== null ? t("selectedBatter") : t("nowBatting")} ({game.opponentName})
                        </p>
                        <p className="text-lg font-bold">
                          #{currentOppBatter?.jerseyNumber ?? "-"}{" "}
                          {currentOppBatter?.name}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {currentOppBatter?.bats === "left" ? "L" : currentOppBatter?.bats === "switch" ? "S" : "R"} | {t("spot")} #{(activeOppBatterIndex + 1)}
                        {manualOppBatterIndex !== null && (
                          <button
                            onClick={() => setManualOppBatterIndex(null)}
                            className="ml-2 text-xs text-red-600 hover:underline"
                          >
                            {t("backToNextUp")}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Our Pitcher */}
                    {game.pitchingAppearances && game.pitchingAppearances.length > 0 && (
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-xs text-gray-500">{t("ourPitcher")}</span>
                        <select
                          value={selectedOurPitcherId}
                          onChange={(e) => setSelectedOurPitcherId(e.target.value)}
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                        >
                          {game.pitchingAppearances.map((pa) => (
                            <option key={pa.id} value={pa.id}>
                              {pa.player ? `${pa.player.firstName} ${pa.player.lastName}` : t("unknown")}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Pitch Tracking */}
                    <div className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">
                          {t("pitchTracking")}
                        </h4>
                        <span className="text-sm font-mono font-bold">
                          {countBalls}-{countStrikes}
                        </span>
                      </div>

                      {/* Pitch sequence display */}
                      {currentPitches.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {currentPitches.map((p, i) => (
                            <span
                              key={i}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: PITCH_RESULT_COLORS[p.result] || "#6b7280" }}
                              title={PITCH_RESULT_LABELS[p.result]}
                            >
                              {i + 1}
                            </span>
                          ))}
                          <button
                            onClick={handleRemoveLastPitch}
                            className="inline-flex h-6 items-center rounded px-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            {t("undo")}
                          </button>
                        </div>
                      )}

                      {/* Strike Zone + Pitch result buttons */}
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <StrikeZone
                            interactive
                            selectedLocation={pitchLocation}
                            onLocationSelect={setPitchLocation}
                            pitches={currentPitches.flatMap((p, i) =>
                              p.locationX === null || p.locationY === null
                                ? []
                                : [{ x: p.locationX, y: p.locationY, result: p.result, pitchNumber: i + 1 }]
                            )}
                            size={160}
                          />
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {PITCH_RESULTS.map((result) => (
                            <button
                              key={result}
                              onClick={() => setSelectedPitchResult(result)}
                              className={`block w-full rounded border px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                                selectedPitchResult === result
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                              }`}
                            >
                              <span
                                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: PITCH_RESULT_COLORS[result] }}
                              />
                              {PITCH_RESULT_LABELS[result]}
                            </button>
                          ))}
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={handleAddPitch}
                            disabled={!selectedPitchResult}
                          >
                            {t("addPitch")}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* At-Bat Result Buttons */}
                    <ResultButtons
                      selectedResult={oppSelectedResult}
                      onSelectResult={selectOppResult}
                    />

                    {oppSelectedResult && (
                      <RunnersPanel
                        bases={bases}
                        moves={oppMoves}
                        setMoves={setOppMoves}
                        batterName={batterName}
                        nameFor={nameFor}
                        result={oppSelectedResult}
                        rbi={oppRbiOverride}
                        setRbi={setOppRbiOverride}
                      />
                    )}

                    {/* Spray Chart for opponent batted balls */}
                    {isBattedBall(oppSelectedResult) && (
                      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <p className="mb-2 text-xs font-medium text-gray-500 uppercase">
                          {t("ballLocation")}
                        </p>
                        <SprayChartDiamond
                          interactive
                          selectedLocation={oppHitLocation}
                          onLocationSelect={setOppHitLocation}
                          hits={[]}
                          size={250}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleUndo}
                        disabled={!hasPlays || submitting}
                      >
                        {t("undoLast")}
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleRecordOppAtBat}
                        disabled={!oppSelectedResult || submitting || !!checkMoves(oppMoves, bases, true)}
                      >
                        {submitting ? t("recording") : t("recordOppAtBat", { name: game.opponentName })}
                      </Button>
                    </div>
                  </Card>

                  {/* Opponent Batting Order */}
                  <Card>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{t("oppBattingOrder", { name: game.opponentName })}</h3>
                      <button
                        onClick={() => setShowBatterModal(true)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {t("addBatterLink")}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {game.opponentBatters.map((batter, idx) => (
                        <button
                          key={batter.id}
                          onClick={() => setManualOppBatterIndex(idx === activeOppBatterIndex ? null : idx)}
                          className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-sm text-left transition-colors ${
                            idx === activeOppBatterIndex
                              ? "bg-red-50 font-medium ring-1 ring-red-300 dark:bg-red-900/30 dark:ring-red-700"
                              : idx === currentOppBatterIndex
                              ? "bg-gray-50 dark:bg-gray-800/50"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <span>
                            {idx + 1}. #{batter.jerseyNumber ?? "-"}{" "}
                            {batter.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {batter.bats === "left" ? "L" : batter.bats === "switch" ? "S" : "R"}
                            </span>
                            {idx === currentOppBatterIndex && manualOppBatterIndex !== null && (
                              <span className="text-xs text-red-500">{t("nextUp")}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </>
          )}

          {/* Game Log */}
          <Card>
            <h3 className="mb-2 text-sm font-semibold">{t("gameLog")} <span className="font-normal text-gray-400">{t("gameLogHint")}</span></h3>
            {!hasPlays ? (
              <p className="text-sm text-gray-400">{t("noAtBats")}</p>
            ) : (
              <div className={`space-y-1 ${editingAtBatId ? "" : "max-h-72 overflow-y-auto"}`}>
                {playsInOrder(game).reverse().map((play, index) => {
                  if (play.isBasePlay) {
                    const moved = Object.entries((play.runnerMoves ?? {}) as RunnerMoves);
                    return (
                      <div key={play.id} className="flex items-center justify-between rounded px-2 py-1 text-sm">
                        <span>
                          <span className="italic text-gray-600 dark:text-gray-400">{t(`play_${play.type}`)}</span>
                          {moved.map(([id, to]) => (
                            <span key={id} className="ml-1 text-xs text-gray-500">
                              {nameFor(id)} → {destinationLabel(to, t)}
                            </span>
                          ))}
                          {play.runsScored > 0 && (
                            <span className="ml-1 text-xs font-semibold text-green-600">({play.runsScored} R)</span>
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {play.isTop ? t("top") : t("bot")} {play.inning}
                        </span>
                      </div>
                    );
                  }
                  const ab = game.atBats.find((a) => a.id === play.id);
                  if (!ab) return null;
                  const isOurs = !!ab.playerId;
                  const logName = nameFor(ab.id);
                  const isEditing = editingAtBatId === ab.id;
                  const isLatest = index === 0;
                  const tracked = !!ab.runnerMoves;
                  const before = isEditing && isLatest
                    ? replayPlays(buildPlays(game.atBats, game.basePlays).filter((p) => p.id !== ab.id))
                    : null;
                  const basesBefore = before?.bases ?? null;
                  return (
                    <div key={ab.id}>
                      <div
                        onClick={() => {
                          if (isEditing) {
                            setEditingAtBatId(null);
                          } else {
                            setEditingAtBatId(ab.id);
                            setEditResult(ab.result);
                            setEditRbi(ab.rbi);
                            setEditRuns(ab.runsScored);
                            setEditMoves(tracked && isLatest ? (ab.runnerMoves as RunnerMoves) : null);
                          }
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm ${
                          isEditing
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : isOurs
                            ? "odd:bg-gray-50 dark:odd:bg-gray-800/50"
                            : "odd:bg-red-50/50 dark:odd:bg-red-900/10"
                        }`}
                      >
                        <span>
                          {!isOurs && (
                            <span className="mr-1 text-xs text-red-500">[OPP]</span>
                          )}
                          <span className="font-medium">{logName}</span>
                          {" - "}
                          <span className="text-gray-600 dark:text-gray-400">
                            {RESULT_LABELS[ab.result] || ab.result}
                          </span>
                          {ab.runsScored > 0 && (
                            <span className="ml-1 text-xs font-semibold text-green-600">
                              ({ab.runsScored} R)
                            </span>
                          )}
                          {ab.rbi > 0 && (
                            <span className="ml-1 text-xs text-green-600">
                              ({ab.rbi} RBI)
                            </span>
                          )}
                          {ab.stolenBases > 0 && (
                            <span className="ml-1 text-xs text-blue-600">
                              ({ab.stolenBases} SB)
                            </span>
                          )}
                          {ab.caughtStealing > 0 && (
                            <span className="ml-1 text-xs text-red-600">
                              ({ab.caughtStealing} CS)
                            </span>
                          )}
                          {ab.pitches && ab.pitches.length > 0 && (
                            <span className="ml-1 text-xs text-gray-400">
                              ({ab.pitches.length}p)
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {ab.isTop ? t("top") : t("bot")} {ab.inning}
                        </span>
                      </div>
                      {isEditing && (
                        <div className="space-y-3 rounded-b bg-blue-50 px-3 py-3 dark:bg-blue-900/20">
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                            {t("result")}
                            <select
                              value={editResult}
                              onChange={(e) => {
                                setEditResult(e.target.value);
                                if (before && editMoves) {
                                  setEditMoves(defaultMoves(e.target.value, before.bases, before.state.outsInCurrentInning));
                                  setEditRbi(null);
                                }
                              }}
                              className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
                            >
                              {ALL_RESULTS.map((result) => (
                                <option key={result} value={result}>
                                  {RESULT_LABELS[result]} - {RESULT_FULL_NAMES[result]}
                                </option>
                              ))}
                            </select>
                          </label>
                          {basesBefore && editMoves ? (
                            <RunnersPanel
                              bases={basesBefore}
                              moves={editMoves}
                              setMoves={(m) => {
                                setEditMoves(m);
                                setEditRbi(null);
                              }}
                              batterName={logName}
                              nameFor={nameFor}
                              result={editResult}
                              rbi={editRbi}
                              setRbi={setEditRbi}
                            />
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              {!tracked && (
                                <Stepper
                                  label={t("runsOnPlay")}
                                  value={editRuns}
                                  onChange={(n) => {
                                    setEditRuns(n);
                                    setEditRbi(Math.min(editRbi ?? 0, n));
                                  }}
                                  max={4}
                                />
                              )}
                              <Stepper
                                label="RBI"
                                value={editRbi ?? 0}
                                onChange={setEditRbi}
                                max={tracked ? ab.runsScored : editRuns}
                              />
                            </div>
                          )}
                          {tracked && !isLatest && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t("undoToChangeRunners")}</p>
                          )}
                          <button
                            onClick={handleEditAtBat}
                            disabled={!!(basesBefore && editMoves && checkMoves(editMoves, basesBefore, true))}
                            className="rounded bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            {tc("save")}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </>
      )}

      {/* Runner play modal */}
      <Modal
        isOpen={!!runnerPlay}
        onClose={() => setRunnerPlay(null)}
        title={t("runnerPlayTitle")}
      >
        {runnerPlay && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {BASE_PLAY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setRunnerPlay({ ...runnerPlay, type, moves: defaultBasePlayMoves(type, bases, runnerPlay.runner) })
                  }
                  className={`rounded-lg border px-2 py-2 text-sm ${
                    runnerPlay.type === type
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {t(`play_${type}`)}
                </button>
              ))}
            </div>
            <RunnersPanel
              bases={bases}
              moves={runnerPlay.moves}
              setMoves={(m) => setRunnerPlay({ ...runnerPlay, moves: m })}
              nameFor={nameFor}
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setRunnerPlay(null)}>
                {tc("cancel")}
              </Button>
              <Button
                onClick={handleSaveRunnerPlay}
                disabled={
                  submitting ||
                  Object.keys(withoutNoOps(runnerPlay.moves, bases)).length === 0 ||
                  !!checkMoves(runnerPlay.moves, bases, false)
                }
              >
                {tc("save")}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* End half-inning modal */}
      <Modal
        isOpen={showEndHalf}
        onClose={() => setShowEndHalf(false)}
        title={t("endHalf")}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t("endHalfExplain")}</p>
          <Stepper label={t("runsThisHalf")} value={endHalfRuns} onChange={setEndHalfRuns} max={99} />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowEndHalf(false)}>
              {tc("cancel")}
            </Button>
            <Button onClick={handleEndHalf} disabled={submitting}>{t("endHalf")}</Button>
          </div>
        </div>
      </Modal>

      {/* Add Pitcher Modal */}
      <Modal
        isOpen={showPitcherModal}
        onClose={() => setShowPitcherModal(false)}
        title={t("addOpponentPitcher")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("name")}
            </label>
            <input
              value={newPitcherName}
              onChange={(e) => setNewPitcherName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              placeholder={t("pitcherNamePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("throws")}
            </label>
            <div className="mt-1 flex gap-3">
              <button
                onClick={() => setNewPitcherHand("right")}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  newPitcherHand === "right"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {t("right")}
              </button>
              <button
                onClick={() => setNewPitcherHand("left")}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  newPitcherHand === "left"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {t("left")}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowPitcherModal(false)}>
              {tc("cancel")}
            </Button>
            <Button onClick={handleAddPitcher}>{t("addPitcher")}</Button>
          </div>
        </div>
      </Modal>

      {/* Add Opponent Batter Modal */}
      <Modal
        isOpen={showBatterModal}
        onClose={() => setShowBatterModal(false)}
        title={t("addBatterTitle", { name: game.opponentName })}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("name")}
            </label>
            <input
              value={newBatterName}
              onChange={(e) => setNewBatterName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              placeholder={t("batterNamePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("jerseyOptional")}
            </label>
            <input
              value={newBatterNumber}
              onChange={(e) => setNewBatterNumber(e.target.value)}
              type="number"
              className="mt-1 block w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              placeholder="#"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("bats")}
            </label>
            <div className="mt-1 flex gap-3">
              {["right", "left", "switch"].map((hand) => (
                <button
                  key={hand}
                  onClick={() => setNewBatterHand(hand)}
                  className={`rounded-lg border px-4 py-2 text-sm capitalize ${
                    newBatterHand === hand
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {hand === "switch" ? t("switch") : hand === "left" ? t("left") : t("right")}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowBatterModal(false)}>
              {tc("cancel")}
            </Button>
            <Button onClick={handleAddBatter}>{t("addBatter")}</Button>
          </div>
        </div>
      </Modal>

      {/* Lineup Setup Modal */}
      <Modal
        isOpen={showLineupSetup}
        onClose={() => setShowLineupSetup(false)}
        title={t("setBattingOrder")}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            {lineupDraft.map((entry, idx) => {
              const player = availablePlayers.find((p) => p.id === entry.playerId);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded border border-gray-200 px-2 py-1.5 text-sm dark:border-gray-700"
                >
                  <span className="w-6 text-center font-medium text-gray-500">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-medium">
                    #{player?.jerseyNumber ?? "-"} {player?.firstName}{" "}
                    {player?.lastName}
                  </span>
                  <select
                    value={entry.position}
                    onChange={(e) => {
                      const updated = [...lineupDraft];
                      updated[idx] = { ...entry, position: e.target.value };
                      setLineupDraft(updated);
                    }}
                    className="rounded border border-gray-300 px-1 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-800"
                  >
                    {["P","C","1B","2B","3B","SS","LF","CF","RF","DH","EH"].map(
                      (pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    onClick={() => moveInLineup(idx, "up")}
                    disabled={idx === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    &#9650;
                  </button>
                  <button
                    onClick={() => moveInLineup(idx, "down")}
                    disabled={idx === lineupDraft.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    &#9660;
                  </button>
                  <button
                    onClick={() => removeFromLineup(idx)}
                    className="text-red-400 hover:text-red-600"
                  >
                    &#10005;
                  </button>
                </div>
              );
            })}
          </div>

          {availablePlayers.filter(
            (p) => !lineupDraft.some((e) => e.playerId === p.id)
          ).length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">
                {t("addToLineup")}
              </p>
              <div className="flex flex-wrap gap-1">
                {availablePlayers
                  .filter((p) => !lineupDraft.some((e) => e.playerId === p.id))
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToLineup(p.id)}
                      className="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                    >
                      #{p.jerseyNumber ?? "-"} {p.firstName} {p.lastName}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowLineupSetup(false)}
            >
              {tc("cancel")}
            </Button>
            <Button
              onClick={handleSaveLineup}
              disabled={lineupDraft.length === 0}
            >
              {t("saveLineup", { count: lineupDraft.length })}
            </Button>
          </div>
        </div>
      </Modal>

      {/* End Game Confirmation Modal */}
      <Modal
        isOpen={showEndGameConfirm}
        onClose={() => setShowEndGameConfirm(false)}
        title={t("endGameTitle")}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t.rich("endGameConfirm", {
              score: `${game.ourScore} - ${game.opponentScore}`,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowEndGameConfirm(false)}>
              {tc("cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                setShowEndGameConfirm(false);
                await handleEndGame();
              }}
            >
              {t("endGame")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ========== Shared Sub-Components ==========

function ResultButtons({
  selectedResult,
  onSelectResult,
}: {
  selectedResult: string | null;
  onSelectResult: (result: string) => void;
}) {
  const t = useTranslations("games.live");
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-xs font-medium text-gray-500 uppercase">{t("hits")}</p>
        <div className="grid grid-cols-4 gap-2">
          {AT_BAT_RESULTS.hits.map((result) => (
            <button
              key={result}
              title={RESULT_FULL_NAMES[result]}
              onClick={() => onSelectResult(result)}
              className={`flex flex-col items-center rounded-lg border px-2 py-1.5 transition-colors ${
                selectedResult === result
                  ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium">{RESULT_LABELS[result]}</span>
              <span className="text-[10px] leading-tight text-gray-400">{RESULT_FULL_NAMES[result]}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-gray-500 uppercase">{t("walks")}</p>
        <div className="grid grid-cols-4 gap-2">
          {AT_BAT_RESULTS.walks.map((result) => (
            <button
              key={result}
              title={RESULT_FULL_NAMES[result]}
              onClick={() => onSelectResult(result)}
              className={`flex flex-col items-center rounded-lg border px-2 py-1.5 transition-colors ${
                selectedResult === result
                  ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium">{RESULT_LABELS[result]}</span>
              <span className="text-[10px] leading-tight text-gray-400">{RESULT_FULL_NAMES[result]}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-gray-500 uppercase">{t("outsSection")}</p>
        <div className="grid grid-cols-5 gap-2">
          {AT_BAT_RESULTS.outs.map((result) => (
            <button
              key={result}
              title={RESULT_FULL_NAMES[result]}
              onClick={() => onSelectResult(result)}
              className={`flex flex-col items-center rounded-lg border px-1 py-1.5 transition-colors ${
                selectedResult === result
                  ? "border-gray-500 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium">{RESULT_LABELS[result]}</span>
              <span className="text-[10px] leading-tight text-gray-400">{RESULT_FULL_NAMES[result]}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-gray-500 uppercase">{t("reachedOnError")}</p>
        <div className="grid grid-cols-4 gap-2">
          {AT_BAT_RESULTS.errors.map((result) => (
            <button
              key={result}
              title={RESULT_FULL_NAMES[result]}
              onClick={() => onSelectResult(result)}
              className={`flex flex-col items-center rounded-lg border px-2 py-1.5 transition-colors ${
                selectedResult === result
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-sm font-medium">{RESULT_LABELS[result]}</span>
              <span className="text-[10px] leading-tight text-gray-400">{RESULT_FULL_NAMES[result]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  max: number;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`${label} -`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="rounded bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700"
        >
          -
        </button>
        <span className="w-6 text-center font-medium">{value}</span>
        <button
          type="button"
          aria-label={`${label} +`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="rounded bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700"
        >
          +
        </button>
      </div>
    </div>
  );
}

function destinationLabel(to: Destination, t: ReturnType<typeof useTranslations>) {
  if (to === "home") return t("baseHome");
  if (to === "out") return t("baseOut");
  return t(`base${to}`);
}

function playsInOrder(game: GameDetail) {
  return [
    ...game.atBats.map((ab) => ({
      id: ab.id,
      order: ab.atBatNumberInGame,
      isBasePlay: false,
      runnerMoves: ab.runnerMoves,
      type: "",
      runsScored: ab.runsScored,
      inning: ab.inning,
      isTop: ab.isTop,
    })),
    ...(game.basePlays ?? []).map((bp) => ({
      id: bp.id,
      order: bp.sequence,
      isBasePlay: true,
      runnerMoves: bp.runnerMoves,
      type: bp.type,
      runsScored: bp.runsScored,
      inning: bp.inning,
      isTop: bp.isTop,
    })),
  ].sort((a, b) => a.order - b.order);
}

/** Where everyone ended up. Filled in from the result, for the scorer to correct. */
function RunnersPanel({
  bases,
  moves,
  setMoves,
  batterName,
  nameFor,
  result,
  rbi,
  setRbi,
}: {
  bases: Bases;
  moves: RunnerMoves;
  setMoves: (moves: RunnerMoves) => void;
  /** Left out for plays between at-bats, when the batter stays up. */
  batterName?: string;
  nameFor: (id: string) => string;
  result?: string;
  rbi?: number | null;
  setRbi?: (rbi: number | null) => void;
}) {
  const t = useTranslations("games.live");
  const runs = runsInMoves(moves);
  const hasBatter = batterName !== undefined;
  const problem = checkMoves(moves, bases, hasBatter);
  const shownRbi = Math.min(rbi ?? defaultRbi(result ?? null, moves), runs);

  const rows: { id: string; label: string; from: Base | 0 }[] = [
    ...([3, 2, 1] as Base[]).flatMap((b) =>
      bases[b] ? [{ id: bases[b] as string, label: nameFor(bases[b] as string), from: b }] : []
    ),
    ...(hasBatter ? [{ id: BATTER, label: batterName ?? "", from: 0 as const }] : []),
  ];

  return (
    <div className="mt-4 space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
      <p className="text-xs font-medium text-gray-500 uppercase">{t("whereRunners")}</p>
      {rows.map(({ id, label, from }) => {
        const current: Destination | null = moves[id] ?? (from === 0 ? null : from);
        return (
          <div key={id}>
            <p className="mb-1 text-sm font-medium">
              {label}{" "}
              <span className="text-xs font-normal text-gray-400">
                {from === 0 ? t("batterTag") : t("fromBase", { base: destinationLabel(from, t) })}
              </span>
            </p>
            <div className="grid grid-cols-5 gap-1">
              {([1, 2, 3, "home", "out"] as Destination[]).map((to) => (
                <button
                  key={to}
                  type="button"
                  aria-pressed={current === to}
                  disabled={typeof to === "number" && to < from}
                  onClick={() => setMoves(setRunnerMove(moves, bases, id, to))}
                  className={`rounded border px-1 py-2 text-xs font-medium disabled:opacity-30 ${
                    current === to
                      ? to === "home"
                        ? "border-green-500 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : to === "out"
                        ? "border-red-500 bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        : "border-blue-500 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {destinationLabel(to, t)}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {problem && (
        <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">{t("movesProblem")}</p>
      )}
      {setRbi && (
        <div className="flex items-end justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("runsOnPlay")}</p>
            <p className="text-2xl font-bold" data-testid="runs-on-play">{runs}</p>
          </div>
          <Stepper label="RBI" value={shownRbi} onChange={setRbi} max={runs} />
        </div>
      )}
    </div>
  );
}
