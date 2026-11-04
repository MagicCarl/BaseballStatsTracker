"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { useApi } from "@/hooks/useApi";
import { Team, Season } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import BuyButton from "@/components/ui/BuyButton";

function localDateString(d: Date) {
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function NewGamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");
  const { appUser } = useAuth();
  const { apiFetch } = useApi();
  const t = useTranslations("games.new");
  const tc = useTranslations("common");

  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [form, setForm] = useState({
    teamId: teamId || "",
    seasonId: "",
    opponentName: "",
    gameDate: localDateString(new Date()),
    gameTime: "",
    location: "",
    isHome: true,
    inningsCount: 6,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Set when the backend reports the free 1-game trial is used up.
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    apiFetch("/api/teams")
      .then((data: Team[]) => {
        setTeams(data);
        // Start from the preselected team's regulation game length.
        setForm((f) => ({
          ...f,
          inningsCount: data.find((tm) => tm.id === f.teamId)?.defaultInnings ?? f.inningsCount,
        }));
      })
      .catch(() => {});
  }, [apiFetch]);

  useEffect(() => {
    if (form.teamId) {
      apiFetch(`/api/seasons?teamId=${form.teamId}`)
        .then(setSeasons)
        .catch(() => {});
    }
  }, [form.teamId, apiFetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setError("");
    try {
      const game = await apiFetch("/api/games", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push(`/games/${game.id}/live`);
    } catch (err) {
      // Free trial used up — show the upgrade prompt instead of a generic error.
      if ((err as { code?: string })?.code === "FREE_LIMIT_REACHED") {
        setLimitReached(true);
      } else {
        setError(t("createError"));
      }
    } finally {
      setSaving(false);
    }
  };

  // Free user who has already used their one free game: show the paywall.
  if (limitReached) {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
        <Card className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t("limitReached")}
          </p>
          <BuyButton className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
            {t("purchaseCta")}
          </BuyButton>
          <Link
            href="/dashboard"
            className="mt-2 block text-sm text-gray-500 hover:underline"
          >
            {t("backToDashboard")}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>

      {appUser && !appUser.isPaid && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
          {t("freeTrialNote")}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!teamId && (
            <Select
              id="teamId"
              label={t("teamLabel")}
              value={form.teamId}
              onChange={(e) =>
                setForm({
                  ...form,
                  teamId: e.target.value,
                  seasonId: "",
                  inningsCount:
                    teams.find((tm) => tm.id === e.target.value)?.defaultInnings ?? form.inningsCount,
                })
              }
              options={[
                { value: "", label: t("selectTeam") },
                ...teams.map((t) => ({ value: t.id, label: t.name })),
              ]}
            />
          )}

          {seasons.length > 0 && (
            <Select
              id="seasonId"
              label={t("seasonLabel")}
              value={form.seasonId}
              onChange={(e) => setForm({ ...form, seasonId: e.target.value })}
              options={[
                { value: "", label: t("noSeason") },
                ...seasons.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          )}

          <Input
            id="opponentName"
            label={t("opponentLabel")}
            value={form.opponentName}
            onChange={(e) => setForm({ ...form, opponentName: e.target.value })}
            placeholder={t("opponentPlaceholder")}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="gameDate"
              label={t("dateLabel")}
              type="date"
              value={form.gameDate}
              onChange={(e) => setForm({ ...form, gameDate: e.target.value })}
              required
            />
            <Input
              id="gameTime"
              label={t("timeLabel")}
              type="time"
              value={form.gameTime}
              onChange={(e) => setForm({ ...form, gameTime: e.target.value })}
            />
          </div>

          <Input
            id="location"
            label={t("locationLabel")}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder={t("locationPlaceholder")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="isHome"
              label={t("homeAwayLabel")}
              value={form.isHome ? "home" : "away"}
              onChange={(e) =>
                setForm({ ...form, isHome: e.target.value === "home" })
              }
              options={[
                { value: "home", label: t("home") },
                { value: "away", label: t("away") },
              ]}
            />
            <Input
              id="innings"
              label={t("inningsLabel")}
              type="number"
              min={1}
              max={12}
              value={form.inningsCount}
              onChange={(e) =>
                setForm({
                  ...form,
                  inningsCount:
                    parseInt(e.target.value) ||
                    teams.find((tm) => tm.id === form.teamId)?.defaultInnings ||
                    6,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={saving || !form.teamId}>
              {saving ? t("creating") : t("startGame")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
