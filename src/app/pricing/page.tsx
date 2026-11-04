import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Testimonials from "@/components/Testimonials";
import { getTranslations } from "next-intl/server";
import BuyButton from "@/components/ui/BuyButton";

export const metadata: Metadata = {
  title: "Pricing - $39 One-Time Baseball & Softball Stats App",
  description:
    "Baseball Stats Tracker costs $39 one-time with no monthly fees or subscriptions. Unlimited teams, seasons, and games. Live scoring, spray charts, batting stats, pitch tracking, and box scores for youth baseball and softball.",
  keywords: [
    "baseball stats app price",
    "cheap baseball stats app",
    "affordable baseball scorekeeping app",
    "baseball stats app no subscription",
    "one time purchase baseball app",
    "best value baseball stats tracker",
    "softball stats app pricing",
  ],
  alternates: {
    canonical: "https://www.baseballstatstracker.com/pricing",
  },
};

export default async function PricingPage() {
  const t = await getTranslations("marketing.pricing");
  const tc = await getTranslations("marketing.common");
  const feats = ["feat1", "feat2", "feat3", "feat4", "feat5", "feat6", "feat7", "feat8", "feat9", "feat10", "feat11"] as const;
  // Built from the same translated strings the visible FAQ section renders,
  // so the schema always matches the on-page content in every locale.
  const faqs = ([1, 2, 3, 4, 5, 6] as const).map((n) => ({
    q: t(`faqQ${n}`),
    a: t(`faqA${n}`),
  }));

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
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
                  name: "Pricing",
                  item: "https://www.baseballstatstracker.com/pricing",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]),
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

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-4xl leading-snug font-bold text-gray-900 dark:text-white sm:text-5xl">
          {t("h1")}
        </h1>
        <p className="mt-4 text-center text-lg text-gray-600 dark:text-gray-400">
          {t("intro")}
        </p>

        {/* Pricing Card */}
        <div className="mx-auto mt-12 max-w-md rounded-2xl border-2 border-blue-600 bg-white p-8 text-center shadow-lg dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{t("allFeatures")}</h2>
          <div className="mt-4">
            <span className="text-6xl font-bold text-gray-900 dark:text-white">$39</span>
            <span className="ml-2 text-xl text-gray-500 dark:text-gray-400">{t("oneTime")}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("lifetime")}
          </p>

          <ul className="mt-8 space-y-3 text-left text-sm text-gray-700 dark:text-gray-300">
            {feats.map((k) => (
              <li key={k} className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>

          <BuyButton className="mt-8 inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700">
            {t("purchaseCta")}
          </BuyButton>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {t("securePayment")}
          </p>
        </div>

        {/* Value comparison */}
        <div className="mt-16">
          <h2 className="text-center text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("compareH2")}
          </h2>
          <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
            {t("compareIntro")}
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("season1")}</h3>
              <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">$39</div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("season1Vs")}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("season2")}</h3>
              <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">$39</div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("season2Vs")}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t("season5")}</h3>
              <div className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{t("season5Price")}</div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("season5Vs")}</p>
            </div>
          </div>
        </div>

        <Testimonials />

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">{t("faqH2")}</h2>
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
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t("faqA6")}</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Have more questions?{" "}
            <Link href="/faq" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Read the full FAQ
            </Link>{" "}
            — live sharing, pitch tracking, stat formulas, devices, and more.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
          >
            {t("bottomCta")}
          </Link>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("bottomSub")}
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Not sure yet?{" "}
            <Link href="/learn/gamechanger-alternatives" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Read our honest comparison of GameChanger alternatives
            </Link>{" "}
            to see how we stack up, or see{" "}
            <Link href="/learn/gamechanger-pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              what GameChanger actually costs
            </Link>{" "}
            per year.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
