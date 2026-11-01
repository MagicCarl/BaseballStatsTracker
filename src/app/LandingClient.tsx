"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import BuyButton from "@/components/ui/BuyButton";

const features = [
  {
    id: "live",
    imageLight: "/screenshots/live-scoring-light.svg",
    imageDark: "/screenshots/live-scoring.svg",
  },
  {
    id: "stats",
    imageLight: "/screenshots/season-stats-light.svg",
    imageDark: "/screenshots/season-stats.svg",
  },
  {
    id: "spray",
    imageLight: "/screenshots/spray-chart-light.svg",
    imageDark: "/screenshots/spray-chart.svg",
  },
] as const;

const featureKeys: Record<string, { title: string; desc: string }> = {
  live: { title: "featureLiveTitle", desc: "featureLiveDesc" },
  stats: { title: "featureStatsTitle", desc: "featureStatsDesc" },
  spray: { title: "featureSprayTitle", desc: "featureSprayDesc" },
};

export default function LandingClient({
  children,
  testimonials,
}: {
  children?: React.ReactNode;
  // Rendered just above the price card so the social proof sits next to the ask.
  testimonials?: React.ReactNode;
}) {
  const { user } = useAuth();
  const t = useTranslations("marketing.landing");
  const tc = useTranslations("marketing.common");
  const [previewFeature, setPreviewFeature] = useState<string | null>(null);
  const router = useRouter();

  // Signed-in users reach this page from the app logo, which passes the page
  // they were on as ?from. Only same-site paths are honored.
  const backToApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const from = new URLSearchParams(window.location.search).get("from");
    router.push(from && from.startsWith("/") && !from.startsWith("//") ? from : "/dashboard");
  };

  const activeFeature = features.find((f) => f.id === previewFeature);

  useEffect(() => {
    if (!previewFeature) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewFeature(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewFeature]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#FAF8F5]/85 backdrop-blur-md dark:border-white/10 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#f5f5f5" stroke="#cc0000" strokeWidth="2"/>
              <path d="M20 8 C22 14, 22 20, 20 26 C18 32, 18 38, 20 44 C22 50, 22 56, 20 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
              <path d="M44 8 C42 14, 42 20, 44 26 C46 32, 46 38, 44 44 C42 50, 42 56, 44 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
              <line x1="20" y1="10" x2="17" y2="8" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="15" x2="16" y2="14" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="20" x2="16" y2="20" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="26" x2="16" y2="27" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="19" y1="32" x2="15" y2="33" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="38" x2="16" y2="38" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="44" x2="16" y2="44" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="50" x2="17" y2="52" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="44" y1="10" x2="47" y2="8" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="44" y1="15" x2="48" y2="14" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="44" y1="20" x2="48" y2="20" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="44" y1="26" x2="48" y2="27" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="45" y1="32" x2="49" y2="33" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="44" y1="38" x2="48" y2="38" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="44" y1="44" x2="48" y2="44" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="44" y1="50" x2="47" y2="52" stroke="#cc0000" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display text-base font-bold leading-snug tracking-tight sm:text-xl">Baseball Stats Tracker</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-gray-600 lg:flex dark:text-gray-300">
            <Link href="/features" className="hover:text-gray-900 dark:hover:text-white">{tc("navFeatures")}</Link>
            <Link href="/pricing" className="hover:text-gray-900 dark:hover:text-white">{tc("navPricing")}</Link>
            <Link href="/faq" className="hover:text-gray-900 dark:hover:text-white">{tc("navFaq")}</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-black/5 hover:text-gray-900 focus-within:ring-2 focus-within:ring-blue-500 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" />
              </svg>
              <LanguageSwitcher
                placeholder={t("selectLanguage")}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard"
                onClick={backToApp}
                aria-label={t("backToAppLabel")}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {t("backToApp")}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="whitespace-nowrap px-1 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {t("signIn")}
                </Link>
                <BuyButton className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 md:inline-block">
                  {t("buyShort")}
                </BuyButton>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main">
        <section className="relative isolate overflow-hidden">
          {/* Phones/tablets: the photo is a full-strength banner above the copy.
              Desktop: it fills the right side and fades out behind the copy, so
              the slide itself is never washed out. */}
          <div className="relative aspect-[3/2] w-full lg:absolute lg:inset-y-0 lg:left-[30%] lg:right-0 lg:-z-10 lg:aspect-auto lg:w-auto">
            <Image
              src="/hero-slide-home.jpg"
              alt={t("heroImageAlt")}
              fill
              preload
              fetchPriority="high"
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-y-0 left-0 hidden w-2/3 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/50 to-transparent lg:block dark:from-gray-950 dark:via-gray-950/50" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[#FAF8F5] lg:h-40 dark:to-gray-950" />
          </div>

          <div className="relative mx-auto -mt-6 max-w-6xl px-4 pb-20 sm:px-6 lg:mt-0 lg:pb-40 lg:pt-28">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-600/25 bg-white px-3 py-1 text-xs font-medium text-blue-700 sm:text-sm dark:border-blue-400/30 dark:bg-gray-900 dark:text-blue-300">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
                {t("heroBadge")}
              </span>
              <h1 className="font-display mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block text-[#1A1A1A] dark:text-white">{t("heroLine1")}</span>
                <span className="block text-[#2563EB]">{t("heroLine2")}</span>
                <span className="block text-[#16A34A]">{t("heroLine3")}</span>
              </h1>
              <h2 className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-gray-700 sm:text-xl dark:text-gray-300">
                {t("subtitle")}
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                  {t("tryFreeCta")}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <BuyButton className="rounded-lg border-2 border-gray-900/80 bg-white/50 px-6 py-2.5 text-base font-semibold text-gray-900 backdrop-blur transition hover:bg-white dark:border-white/70 dark:bg-gray-900/40 dark:text-white dark:hover:bg-gray-900">
                  {t("ctaPrimary")}
                </BuyButton>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                {(["heroCheck1", "heroCheck2", "heroCheck3"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The app itself, right under the buttons. On desktop it tucks into the
            hero's faded bottom edge so it starts on the first screen without
            covering the photo's subject. */}
        <figure className="relative mx-auto -mt-8 mb-16 max-w-3xl px-4 sm:px-6 lg:-mt-28 lg:mb-20">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/25 dark:border-gray-700 dark:bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/live-scoring-light.svg" alt={t("heroShotAlt")} width={800} height={600} decoding="async" className="block h-auto w-full dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/live-scoring.svg" alt={t("heroShotAlt")} width={800} height={600} decoding="async" className="hidden h-auto w-full dark:block" />
          </div>
          <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
            {t("heroShotCaption")}
          </figcaption>
        </figure>

        <section className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-2xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {t("hook1")}
            <br />
            {t("hook2")}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {t("hookBody")}
          </p>
          <p className="mt-6 text-lg font-bold text-gray-900 dark:text-gray-100">
            {t("noSubs")}
          </p>
        </section>

        <section className="mx-auto mt-20 grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setPreviewFeature(feature.id)}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition-[border-color,box-shadow] hover:border-blue-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              <div className="aspect-[16/10] overflow-hidden border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={feature.imageLight} alt={t(featureKeys[feature.id].title)} loading="lazy" decoding="async" className="h-full w-full object-cover object-top dark:hidden" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={feature.imageDark} alt={t(featureKeys[feature.id].title)} loading="lazy" decoding="async" className="hidden h-full w-full object-cover object-top dark:block" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{t(featureKeys[feature.id].title)}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {t(featureKeys[feature.id].desc)}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-400">
                  {t("seeExample")}
                </span>
              </div>
            </button>
          ))}
        </section>

        <div className="mt-20">{testimonials}</div>

        <section className="mx-auto max-w-md px-6 pb-20 text-center">
          <Image
            src="/baseballstatstracker_bannerAd.png"
            alt="Cartoon baseball player holding a BaseballStatsTracker.com $39 banner"
            width={1536}
            height={1024}
            sizes="(max-width: 768px) 100vw, 448px"
            className="mb-6 h-auto w-full rounded-2xl shadow-2xl"
          />
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-2xl font-bold leading-snug">{t("getAllFeatures")}</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">$39</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">{t("oneTime")}</span>
            </div>
            <ul className="mt-6 space-y-2 text-left text-sm text-gray-600 dark:text-gray-400">
              <li>{t("planUnlimited")}</li>
              <li>{t("planLiveScoring")}</li>
              <li>{t("planSync")}</li>
              <li>{t("planSpray")}</li>
              <li>{t("planBox")}</li>
              <li>{t("planRoster")}</li>
              <li>{t("planSplits")}</li>
            </ul>
            <BuyButton className="mt-6 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700">
              {t("purchaseNow")}
            </BuyButton>
          </div>
        </section>
        {children}
      </main>

      {/* Feature preview modal */}
      {activeFeature && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewFeature(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feature-preview-title"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              onClick={() => setPreviewFeature(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 id="feature-preview-title" className="mb-4 text-xl font-bold">{t(featureKeys[activeFeature.id].title)}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFeature.imageLight}
              alt={t(featureKeys[activeFeature.id].title)}
              className="w-full rounded-lg dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFeature.imageDark}
              alt={t(featureKeys[activeFeature.id].title)}
              className="hidden w-full rounded-lg dark:block"
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t(featureKeys[activeFeature.id].desc)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
