import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LandingClient from "./LandingClient";
import BuyButton from "@/components/ui/BuyButton";
import SoroBlog from "@/components/SoroBlog";
import Footer from "@/components/layout/Footer";
import Testimonials from "@/components/Testimonials";
import LazyVideo from "@/components/LazyVideo";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.baseballstatstracker.com",
  },
};

export default async function LandingPage() {
  const t = await getTranslations("marketing.landing");

  const cmp = [
    ["cmpGet1", "cmpRep1"],
    ["cmpGet2", "cmpRep2"],
    ["cmpGet3", "cmpRep3"],
    ["cmpGet4", "cmpRep4"],
    ["cmpGet5", "cmpRep5"],
    ["cmpGet6", "cmpRep6"],
    ["cmpGet7", "cmpRep7"],
  ] as const;

  const richTags = {
    em: (c: React.ReactNode) => <em>{c}</em>,
    b: (c: React.ReactNode) => <span className="font-semibold">{c}</span>,
    red: (c: React.ReactNode) => <span className="text-red-600 dark:text-red-400">{c}</span>,
    green: (c: React.ReactNode) => <span className="text-green-700 dark:text-green-400">{c}</span>,
    featuresLink: (c: React.ReactNode) => (
      <Link href="/features" className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">{c}</Link>
    ),
    pricingLink: (c: React.ReactNode) => (
      <Link href="/pricing" className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">{c}</Link>
    ),
    learnLink: (c: React.ReactNode) => (
      <Link href="/learn/gamechanger-alternatives" className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">{c}</Link>
    ),
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      {/* FAQPage schema lives here (not in layout.tsx) so the site has only
          one FAQPage per page, per Google's structured-data guidelines. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the best baseball stats app for youth teams with no subscription?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Baseball Stats Tracker is the leading no-subscription baseball stats app for youth and amateur teams. It is a one-time $39 purchase that includes live game scoring, automatic batting stats (AVG, OBP, SLG, OPS), pitching stats (IP, ERA, strikeouts), interactive spray charts, and real-time sync across devices — no monthly fees ever.",
                },
              },
              {
                "@type": "Question",
                name: "How do I keep baseball stats on my phone during a game?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "With Baseball Stats Tracker, open the app on your phone or tablet and score each at-bat as it happens. Tap the result — hit, out, walk, strikeout — and all stats calculate automatically in real time. The app syncs every 3 seconds so other parents and coaches can follow along live from their own devices.",
                },
              },
              {
                "@type": "Question",
                name: "Does Baseball Stats Tracker work for softball as well as baseball?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Baseball Stats Tracker works for both baseball and softball at every level — Little League, travel ball, rec leagues, high school, and college. The scoring system, stat calculations, and spray charts are identical for both sports with no extra setup.",
                },
              },
              {
                "@type": "Question",
                name: "How much does a youth baseball stats app cost?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Baseball Stats Tracker costs $39 as a one-time purchase. There are no monthly fees, no subscriptions, and no in-app purchases. Most competing apps charge $5–$15 per month. Over a full season, Baseball Stats Tracker costs a fraction of the price.",
                },
              },
              {
                "@type": "Question",
                name: "What are spray charts and how do they help youth baseball coaches?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Spray charts plot where each player hits the ball on a diamond diagram. During live scoring, tap the field location for every batted ball. Over a season the chart reveals each hitter's tendencies — pull hitter, opposite-field hitter, ground ball tendency — helping coaches make better lineup and defensive positioning decisions. Hits are color-coded: singles (green), doubles (blue), triples (orange), home runs (red), outs (gray).",
                },
              },
              {
                "@type": "Question",
                name: "Can parents see live baseball stats during the game?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Baseball Stats Tracker syncs the live box score across all devices every 3 seconds. Share access with parents and they can follow every at-bat, see the current score, and track their child's stats in real time from anywhere — even from home.",
                },
              },
            ],
          }),
        }}
      />
      <LandingClient testimonials={<Testimonials />}>

      {/* ============================================================
          SECTION 1 — INTRO (skimmable hook + video)
          ============================================================ */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-4">
        <div className="rounded-xl border border-gray-200 bg-white p-8 sm:p-10 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-3xl font-bold leading-snug tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t("introHeadline")}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <p>{t("introP1")}</p>
            <p>{t("introP2")}</p>
          </div>

          {/* Video — visual break (autoplay muted loop; tap to unmute via controls) */}
          <div className="my-8 flex justify-center">
            <LazyVideo
              src="/coach-ad.mp4"
              poster="/coach-ad-poster.jpg"
              captions="/coach-ad.vtt"
              label="Coach scoring a youth baseball game with Baseball Stats Tracker"
              className="w-full max-w-[300px] rounded-2xl shadow-xl"
            />
          </div>

          <h3 className="text-2xl font-bold leading-snug tracking-tight text-gray-900 dark:text-white">
            {t("introSub1")}
          </h3>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <p>{t("introP3")}</p>
            <p>{t("introP4")}</p>
            <p>{t("introP5")}</p>
          </div>

          <h3 className="mt-8 text-2xl font-bold leading-snug tracking-tight text-gray-900 dark:text-white">
            {t("introSub2")}
          </h3>
          <div className="mt-4 space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{t("introP6")}</p>
            <p>{t("introP7")}</p>
            <p>{t("introP8")}</p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2 — LOGIC (The Offer + Proof)
          ============================================================ */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            {t("offerEyebrow")}
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-snug tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t("offerH2")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t("offerSub")}
          </p>
        </div>

        {/* What you get vs. what it replaces */}
        <div className="mt-10 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700 sm:border-b sm:border-r dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {t("colGet")}
            </div>
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {t("colReplaces")}
            </div>

            {cmp.map(([getKey, repKey], i) => (
              <div key={i} className="contents">
                <div className="border-t border-gray-200 px-6 py-4 text-gray-900 sm:border-r dark:border-gray-700 dark:text-gray-100">
                  &#10003;&nbsp; {t(getKey)}
                </div>
                <div className="border-t border-gray-200 px-6 py-4 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  {t(repKey)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The math */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("mathH3")}</h3>
          <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
            <li>{t.rich("mathLine1", richTags)}</li>
            <li>{t.rich("mathLine2", richTags)}</li>
            <li>{t.rich("mathLine3", richTags)}</li>
          </ul>
          <p className="mt-5 text-gray-700 dark:text-gray-300">
            {t("mathBody")}
          </p>
        </div>

        {/* SEO content */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white">
            {t("seoH2")}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t.rich("seoBody", richTags)}
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("cardLiveTitle")}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("cardLiveDesc")}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("cardBattingTitle")}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("cardBattingDesc")}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("cardSprayTitle")}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("cardSprayDesc")}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("cardSplitsTitle")}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("cardSplitsDesc")}
            </p>
          </div>
        </div>

        {/* Who it's for */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white">
            {t("levelsH2")}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("levelLLTitle")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("levelLLDesc")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("levelTravelTitle")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("levelTravelDesc")}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("levelHSTitle")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t("levelHSDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white">
            {t("faqH2")}
          </h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("faqQ1")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t("faqA1")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("faqQ2")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t("faqA2")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("faqQ3")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t("faqA3")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("faqQ4")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t("faqA4")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("faqQ5")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t("faqA5")}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("faqQ6")}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t.rich("faqA6", richTags)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3 — URGENCY (The Close)
          ============================================================ */}
      <section className="bg-gradient-to-b from-transparent to-blue-50 px-6 pb-24 pt-8 dark:to-gray-900">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 sm:p-12 dark:border-blue-500 dark:bg-gray-800">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              {t("urgencyEyebrow")}
            </p>
            <h2 className="mt-2 text-3xl font-bold leading-snug tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t("urgencyH2")}
            </h2>
            <ul className="mt-6 space-y-3 text-lg text-gray-700 dark:text-gray-300">
              <li>{t("urgencyBullet1")}</li>
              <li>{t("urgencyBullet2")}</li>
              <li>{t.rich("urgencyBullet3", richTags)}</li>
            </ul>
            <p className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
              {t("urgencyClose")}
            </p>

            <div className="mt-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  {t("oneTimePurchase")}
                </p>
                <div className="mt-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">$39</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">{t("forever")}</span>
                </div>
              </div>
              <ul className="mt-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>&#10003;&nbsp; {t("closeBullet1")}</li>
                <li>&#10003;&nbsp; {t("closeBullet2")}</li>
                <li>&#10003;&nbsp; {t("closeBullet3")}</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <BuyButton className="w-full rounded-lg bg-blue-600 px-8 py-4 text-center text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 sm:w-auto">
                {t("ctaPrimary")}
              </BuyButton>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("ctaSub2")}
              </p>

              <div className="mt-4 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />
                <span>{t("tryFreeOr")}</span>
                <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />
              </div>
              <Link
                href="/signup"
                className="w-full rounded-lg border-2 border-blue-600 px-8 py-3 text-center text-base font-semibold text-blue-600 transition hover:bg-blue-50 sm:w-auto dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/20"
              >
                {t("tryFreeCta")}
              </Link>
              <p className="max-w-md text-center text-sm text-gray-600 dark:text-gray-400">
                {t("tryFreeNote")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SORO BLOG EMBED
          ============================================================ */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <SoroBlog />
      </section>

      {/* ============================================================
          DIRECTORY LISTING BADGE
          ============================================================ */}
      <section className="px-6 pb-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Listed on
          </p>
          {/* nofollow is deliberate: the badge is the price of a free directory
              listing, so it stays, but the homepage doesn't pass ranking signal
              to an off-topic startup directory. Their check only verifies the
              badge is present, not its rel attribute. */}
          <a
            href="https://sellwithboost.com"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="opacity-80 transition hover:opacity-100"
          >
            {/* loading="lazy" stops React from preloading a third-party asset
                that sits below the fold; width/height are the SVG's intrinsic
                160x40 so reserving the box avoids a shift when it does load. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://sellwithboost.com/badge/listing.svg"
              alt="Listed on Sell With Boost"
              width={160}
              height={40}
              loading="lazy"
              decoding="async"
              className="h-10 w-auto"
            />
          </a>
        </div>
      </section>
      </LandingClient>

      {/* ============================================================
          FOOTER LINKS
          ============================================================ */}
      <Footer />
    </div>
  );
}
