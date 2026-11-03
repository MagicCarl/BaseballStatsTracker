"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { useApi } from "@/hooks/useApi";
import { Team } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import BuyButton from "@/components/ui/BuyButton";
import { LEVELS, suggestedInnings } from "@/lib/constants";
import TeamSettingsFields, { TeamSettingsValues } from "@/components/teams/TeamSettingsFields";

export default function DashboardPage() {
  const { appUser } = useAuth();
  const { apiFetch } = useApi();
  const router = useRouter();
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [modalView, setModalView] = useState<"pick" | "create">("pick");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamSettings, setNewTeamSettings] = useState<TeamSettingsValues>({
    sport: "baseball",
    level: "little_league",
    defaultInnings: suggestedInnings("baseball", "little_league"),
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set when the user lands back from a successful Stripe checkout. The webhook
  // flips isPaid server-side; this optimistically reflects it in the UI (the
  // cached appUser.isPaid catches up on the next natural load).
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("purchase") === "success") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL can only be read in the browser
      setPurchaseSuccess(true);
    }
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await apiFetch("/api/teams");
      setTeams(data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads data on mount; state changes after the request
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    setError(null);

    try {
      await apiFetch("/api/teams", {
        method: "POST",
        body: JSON.stringify({
          name: newTeamName,
          ...newTeamSettings,
        }),
      });
      setNewTeamName("");
      setShowTeamModal(false);
      await fetchTeams();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("createError");
      setError(message);
      console.error("Create team error:", err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {purchaseSuccess && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            {t("purchaseSuccess")}
          </p>
        </div>
      )}
      {appUser && !appUser.isPaid && !purchaseSuccess && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            {t("viewOnlyBanner")}
          </p>
          <BuyButton className="mt-1 inline-block text-sm font-medium text-amber-700 underline hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300">
            {t("purchaseCta")}
          </BuyButton>
        </div>
      )}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
        <Button onClick={() => { setShowTeamModal(true); setModalView(teams.length > 0 ? "pick" : "create"); setError(null); }}>{t("newTeam")}</Button>
      </div>

      {teams.length === 0 ? (
        <Card className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("emptyState")}
          </p>
          <Button className="mt-4" onClick={() => { setShowTeamModal(true); setModalView("create"); setError(null); }}>
            {t("createTeam")}
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="group flex cursor-pointer items-center gap-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-500/50">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                  {team.name.trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold">{team.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {LEVELS.find((l) => l.value === team.level)?.label || team.level}
                  </p>
                  <div className="mt-1 flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{t("playersCount", { count: team._count?.players || 0 })}</span>
                    <span>{t("gamesCount", { count: team._count?.games || 0 })}</span>
                  </div>
                </div>
                <svg className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        title={modalView === "pick" ? t("selectTeamTitle") : t("createTeamTitle")}
      >
        {modalView === "pick" ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("chooseOrCreate")}
            </p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setShowTeamModal(false);
                    router.push(`/teams/${team.id}`);
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {LEVELS.find((l) => l.value === team.level)?.label || team.level}
                      {" · "}
                      {t("playersCount", { count: team._count?.players || 0 })}
                    </p>
                  </div>
                  <span className="text-gray-400">&rarr;</span>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <Button
                className="w-full"
                onClick={() => setModalView("create")}
              >
                {t("createNewTeam")}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateTeam} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </div>
            )}
            <Input
              id="teamName"
              label={t("teamNameLabel")}
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder={t("teamNamePlaceholder")}
              required
            />
            <TeamSettingsFields
              idPrefix="newTeam"
              value={newTeamSettings}
              onChange={setNewTeamSettings}
            />
            <div className="flex justify-end gap-3">
              {teams.length > 0 && (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setModalView("pick")}
                >
                  {tc("back")}
                </Button>
              )}
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowTeamModal(false)}
              >
                {tc("cancel")}
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? t("creating") : t("createTeam")}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
