import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Features - Baseball & Softball Stats App for Youth Teams",
  description:
    "Live game scoring, automatic batting stats (AVG, OBP, SLG, OPS), pitch tracking, spray charts, box scores, and opponent tracking. The best baseball and softball stats app for Little League, travel ball, and high school teams.",
  keywords: [
    "baseball stats app features",
    "softball stats app features",
    "live baseball scoring app",
    "baseball spray chart app",
    "youth baseball stats tracker features",
    "baseball box score app",
    "baseball OBP calculator",
    "baseball SLG calculator",
    "travel ball stats app",
  ],
  alternates: {
    canonical: "https://www.baseballstatstracker.com/features",
  },
};

const statKeys = [
  { stat: "AVG", key: "statAVG" },
  { stat: "OBP", key: "statOBP" },
  { stat: "SLG", key: "statSLG" },
  { stat: "OPS", key: "statOPS" },
  { stat: "H", key: "statH" },
  { stat: "2B", key: "stat2B" },
  { stat: "3B", key: "stat3B" },
  { stat: "HR", key: "statHR" },
  { stat: "RBI", key: "statRBI" },
  { stat: "BB", key: "statBB" },
  { stat: "K", key: "statK" },
  { stat: "SB", key: "statSB" },
] as const;

export default async function FeaturesPage() {
  const t = await getTranslations("marketing.features");
  const tc = await getTranslations("marketing.common");
  const b = { b: (c: React.ReactNode) => <strong>{c}</strong> };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.baseballstatstracker.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Features",
                item: "https://www.baseballstatstracker.com/features",
              },
            ],
          }),
        }}
      />
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="32" r="30" fill="#f5f5f5" stroke="#cc0000" strokeWidth="2"/>
            <path d="M20 8 C22 14, 22 20, 20 26 C18 32, 18 38, 20 44 C22 50, 22 56, 20 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M44 8 C42 14, 42 20, 44 26 C46 32, 46 38, 44 44 C42 50, 42 56, 44 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-bold tracking-tight">Baseball Stats Tracker</span>
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {tc("getStarted")}
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl leading-snug font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t("h1")}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {t("intro")}
        </p>

        {/* Live Game Scoring */}
        <section className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("liveH2")}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("liveIntro")}
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
            <li>{t.rich("liveBullet1", b)}</li>
            <li>{t.rich("liveBullet2", b)}</li>
            <li>{t.rich("liveBullet3", b)}</li>
            <li>{t.rich("liveBullet4", b)}</li>
            <li>{t.rich("liveBullet5", b)}</li>
          </ul>
        </section>

        {/* Batting Stats */}
        <section className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("battingH2")}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("battingIntro")}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statKeys.map((s) => (
              <div
                key={s.stat}
                className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{s.stat}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t(s.key)}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {t("battingFormula")}
          </p>
        </section>

        {/* Pitching Stats */}
        <section className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("pitchingH2")}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("pitchingP1")}
          </p>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("pitchingP2")}
          </p>
        </section>

        {/* Spray Charts */}
        <section className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("sprayH2")}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("sprayIntro")}
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
            <li>{t.rich("sprayBullet1", b)}</li>
            <li>{t.rich("sprayBullet2", b)}</li>
            <li>{t.rich("sprayBullet3", b)}</li>
          </ul>
        </section>

        {/* Box Scores */}
        <section className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("boxH2")}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("boxP")}
          </p>
        </section>

        {/* Advanced Stats Search */}
        <section className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("searchH2")}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("searchIntro")}
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
            <li>{t("searchQ1")}</li>
            <li>{t("searchQ2")}</li>
            <li>{t("searchQ3")}</li>
            <li>{t("searchQ4")}</li>
          </ul>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("searchOutro")}
          </p>
        </section>

        {/* Opponent Tracking */}
        <section className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("oppH2")}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("oppP")}
          </p>
        </section>

        {/* Pricing */}
        <section className="mt-16 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("pricingH2")}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {t("pricingP")}
          </p>
          <div className="mt-6">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">$39</span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">{t("oneTime")}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("pricingUnlimited")}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link
              href="/signup"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              {t("getStartedFree")}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("pricingSub")}
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("cmpH2")}
          </h2>
          <div className="mt-6 overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison table">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">{t("cmpColFeature")}</th>
                  <th className="pb-3 font-semibold text-blue-600 dark:text-blue-400">Baseball Stats Tracker</th>
                  <th className="pb-3 font-semibold text-gray-500 dark:text-gray-400">{t("cmpColOther")}</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("cmpRowPrice")}</td>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{t("cmpPriceUs")}</td>
                  <td className="py-3">{t("cmpPriceOther")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("cmpRowLive")}</td>
                  <td className="py-3 font-medium text-green-700 dark:text-green-400">{t("cmpIncluded")}</td>
                  <td className="py-3">{t("cmpIncluded")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("cmpRowSpray")}</td>
                  <td className="py-3 font-medium text-green-700 dark:text-green-400">{t("cmpIncluded")}</td>
                  <td className="py-3">{t("cmpPremium")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("cmpRowSplits")}</td>
                  <td className="py-3 font-medium text-green-700 dark:text-green-400">{t("cmpIncluded")}</td>
                  <td className="py-3">{t("cmpPremium")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("cmpRowSync")}</td>
                  <td className="py-3 font-medium text-green-700 dark:text-green-400">{t("cmpIncluded")}</td>
                  <td className="py-3">{t("cmpPremium")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("cmpRowPitch")}</td>
                  <td className="py-3 font-medium text-green-700 dark:text-green-400">{t("cmpIncluded")}</td>
                  <td className="py-3">{t("cmpPremium")}</td>
                </tr>
                <tr>
                  <td className="py-3">{t("cmpRowAnnual")}</td>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{t("cmpAnnualUs")}</td>
                  <td className="py-3">{t("cmpAnnualOther")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Weighing your options?{" "}
            <Link href="/learn/gamechanger-alternatives" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              See our honest breakdown of GameChanger alternatives
            </Link>{" "}
            — including who each app is actually right for.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
