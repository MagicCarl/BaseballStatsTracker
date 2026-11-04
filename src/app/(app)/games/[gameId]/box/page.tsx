"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useApi } from "@/hooks/useApi";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { BASE_PLAY_LABELS, RESULT_LABELS } from "@/lib/constants";
import { buildBoxScore } from "@/lib/box-score";

export default function BoxScorePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { apiFetch } = useApi();
  const t = useTranslations("games.box");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/games/${gameId}`)
      .then(setGame)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiFetch, gameId]);

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

  const { boxLines, innings, ourRunsByInning, oppRunsByInning, ourHits, oppHits, ourErrors, oppErrors } = buildBoxScore(game);

  // Team display names
  const ourTeamName = game.team?.name || "Us";
  const oppTeamName = game.opponentName;

  // Top row = away team, bottom row = home team
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
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href={`/games/${gameId}/live`}
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        &larr; {t("backToGame")}
      </Link>

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
                      game.currentInning === i + 1 && game.status !== "final"
                        ? "text-blue-500"
                        : "text-gray-500"
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
              {/* Away team (top of inning) */}
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="whitespace-nowrap px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">{topName}</td>
                {topRuns.map((r, i) => {
                  const played = game.status === "final" || game.currentInning >= i + 1;
                  return (
                    <td
                      key={i}
                      className={`px-1.5 py-1.5 text-center ${
                        game.currentInning === i + 1 && game.status !== "final" ? "font-bold text-blue-500" : ""
                      }`}
                    >
                      {played ? r : "\u2014"}
                    </td>
                  );
                })}
                <td className="border-l border-gray-300 px-2 py-1.5 text-center font-bold dark:border-gray-600">{topR}</td>
                <td className="px-2 py-1.5 text-center">{topH}</td>
                <td className="px-2 py-1.5 text-center">{topE}</td>
              </tr>
              {/* Home team (bottom of inning) */}
              <tr>
                <td className="whitespace-nowrap px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-blue-500">{botName}</td>
                {botRuns.map((r, i) => {
                  const played = game.status === "final" || game.currentInning > i + 1 || (game.currentInning === i + 1 && game.isTopOfInning === false);
                  return (
                    <td
                      key={i}
                      className={`px-1.5 py-1.5 text-center ${
                        game.currentInning === i + 1 && game.status !== "final" ? "font-bold text-blue-500" : ""
                      }`}
                    >
                      {played ? r : "\u2014"}
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
        <p className="mt-2 text-center text-xs text-gray-500">
          {game.status === "final"
            ? t("final")
            : t("inProgress", { half: game.isTopOfInning ? t("top") : t("bot"), inning: game.currentInning })}
        </p>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          {t("batting")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                <th className="px-2 py-1 font-medium">{t("player")}</th>
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
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
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

      {/* Play-by-play */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          {t("playByPlay")}
        </h3>
        <div className="space-y-1">
          {[
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...game.atBats.map((ab: any) => ({ ...ab, order: ab.atBatNumberInGame })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(game.basePlays ?? []).map((bp: any) => ({ ...bp, order: bp.sequence, isBasePlay: true })),
          ]
            .sort((a, b) => a.order - b.order)
            .map((play) => {
              const batterName = play.player
                ? `${play.player.firstName} ${play.player.lastName}`
                : play.opponentBatter?.name || t("unknown");
              return (
                <div
                  key={play.id}
                  className="flex items-center justify-between rounded px-2 py-1 text-sm odd:bg-gray-50 dark:odd:bg-gray-800/50"
                >
                  <span>
                    {play.isBasePlay ? (
                      <span className="italic">{BASE_PLAY_LABELS[play.type] || play.type}</span>
                    ) : (
                      <>
                        <span className="font-medium">{batterName}</span>
                        {" - "}
                        {RESULT_LABELS[play.result] || play.result}
                      </>
                    )}
                    {play.runsScored > 0 && ` (${play.runsScored} R)`}
                    {play.rbi > 0 && ` (${play.rbi} RBI)`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {play.isTop ? "T" : "B"}{play.inning}
                  </span>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
}
