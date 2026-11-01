import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";

const URL = "https://www.baseballstatstracker.com/learn/gamechanger-alternatives";
const PUBLISHED = "2026-05-21";
const MODIFIED = "2026-05-21";

export const metadata: Metadata = {
  title: "GameChanger Alternatives 2026: Top 5 for Youth Baseball",
  description:
    "Looking for a cheaper, simpler alternative to GameChanger? We compare 5 real options for youth baseball and softball families, including a $39 one-time-purchase app built by a baseball dad.",
  alternates: {
    canonical: URL,
  },
  openGraph: {
    type: "article",
    url: URL,
    title: "GameChanger Alternatives in 2026: 5 Honest Options",
    description:
      "Compare 5 real GameChanger alternatives for youth baseball + softball. Pricing, features, and the $39 one-time option.",
    images: ["/og-image.png"],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
  twitter: {
    card: "summary_large_image",
    title: "GameChanger Alternatives in 2026: 5 Honest Options",
    description:
      "Compare 5 real GameChanger alternatives for youth baseball + softball. Pricing, features, and the $39 one-time option.",
    images: ["/og-image.png"],
  },
};

export default async function GameChangerAlternativesPage() {
  const t = await getTranslations("marketing.learn");
  const tc = await getTranslations("marketing.common");
  const rich = {
    b: (c: React.ReactNode) => <strong>{c}</strong>,
    em: (c: React.ReactNode) => <em>{c}</em>,
    featuresLink: (c: React.ReactNode) => (
      <Link href="/features" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">{c}</Link>
    ),
    pricingLink: (c: React.ReactNode) => (
      <Link href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">{c}</Link>
    ),
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "GameChanger Alternatives in 2026: 5 Honest Options for Youth Baseball Parents",
            datePublished: PUBLISHED,
            dateModified: MODIFIED,
            author: { "@type": "Person", "name": "Carl Andrews" },
            publisher: {
              "@type": "Organization",
              name: "Baseball Stats Tracker",
              logo: {
                "@type": "ImageObject",
                url: "https://www.baseballstatstracker.com/logo.png",
                width: 512,
                height: 512,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": URL,
            },
            image: {
              "@type": "ImageObject",
              url: "https://www.baseballstatstracker.com/og-image.png",
              width: 1200,
              height: 630,
            },
          }),
        }}
      />
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
                name: "Learn",
                item: "https://www.baseballstatstracker.com/learn",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "GameChanger Alternatives",
                item: URL,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the best free GameChanger alternative for youth baseball?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Baseball Stats Tracker is the top-rated GameChanger alternative for youth baseball and softball. Unlike GameChanger, it requires no monthly subscription — you pay $39 once and get full access to live scoring, automatic stat calculations (AVG, OBP, SLG, OPS), spray charts, and real-time sync forever.",
                },
              },
              {
                "@type": "Question",
                name: "Does Baseball Stats Tracker work for Little League and travel ball?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Baseball Stats Tracker is designed specifically for youth and amateur baseball and softball at every level: Little League, travel ball, rec leagues, high school, and college. It works identically for baseball and softball with no extra setup.",
                },
              },
              {
                "@type": "Question",
                name: "How much does Baseball Stats Tracker cost compared to GameChanger?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Baseball Stats Tracker is a one-time $39 purchase with no monthly fees, no subscriptions, and no in-app purchases. GameChanger charges a recurring monthly or annual subscription for full features. Over two seasons, Baseball Stats Tracker costs significantly less.",
                },
              },
              {
                "@type": "Question",
                name: "Can I track pitching stats and spray charts without a subscription?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Baseball Stats Tracker includes full pitching stats (IP, ERA, strikeouts, walks, pitch counts) and interactive spray charts for every player — all included in the one-time $39 price, with no subscription required.",
                },
              },
              {
                "@type": "Question",
                name: "Will the price ever go up?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The price may increase for new buyers in the future. Anyone who has already purchased always keeps their access — that is the whole point of one-time pricing.",
                },
              },
            ],
          }),
        }}
      />

      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="32" r="30" fill="#f5f5f5" stroke="#cc0000" strokeWidth="2" />
            <path d="M20 8 C22 14, 22 20, 20 26 C18 32, 18 38, 20 44 C22 50, 22 56, 20 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 8 C42 14, 42 20, 44 26 C46 32, 46 38, 44 44 C42 50, 42 56, 44 56" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" />
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

      <main className="mx-auto max-w-3xl px-6 py-12">
        <article className="prose-baseball">
          <h1 className="text-4xl leading-snug font-bold text-gray-900 dark:text-white sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {t("byline")}
          </p>

          <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("whyH2")}
          </h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300">{t("whyP1")}</p>
          <p className="mt-3 text-gray-700 dark:text-gray-300">{t("whyP2")}</p>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t.rich("whyLi1", rich)}</li>
            <li>{t.rich("whyLi2", rich)}</li>
            <li>{t.rich("whyLi3", rich)}</li>
          </ol>
          <p className="mt-3 text-gray-700 dark:text-gray-300">{t("whyP3")}</p>

          <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("wantH2")}
          </h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300">{t("wantP")}</p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t.rich("wantLi1", rich)}</li>
            <li>{t.rich("wantLi2", rich)}</li>
            <li>{t.rich("wantLi3", rich)}</li>
            <li>{t.rich("wantLi4", rich)}</li>
            <li>{t.rich("wantLi5", rich)}</li>
            <li>{t.rich("wantLi6", rich)}</li>
          </ul>

          <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">
            {t("tableH2")}
          </h2>
          <div className="mt-6 overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison table">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">{t("colApp")}</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">{t("colPricing")}</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">{t("colLive")}</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">{t("colSpray")}</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">{t("colSync")}</th>
                  <th className="pb-3 font-semibold text-gray-900 dark:text-white">{t("colBest")}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 font-medium text-blue-600 dark:text-blue-400">{t("appUs")}</td>
                  <td className="py-3"><strong>{t("priceUs")}</strong></td>
                  <td className="py-3">{t("yes")}</td>
                  <td className="py-3">{t("yes")}</td>
                  <td className="py-3">{t("syncUs")}</td>
                  <td className="py-3">{t("bestUs")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("appIScore")}</td>
                  <td className="py-3">{t("priceIScore")}</td>
                  <td className="py-3">{t("yes")}</td>
                  <td className="py-3">{t("yes")}</td>
                  <td className="py-3">{t("yes")}</td>
                  <td className="py-3">{t("bestIScore")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("appGC")}</td>
                  <td className="py-3">{t("priceGC")}</td>
                  <td className="py-3">{t("yes")}</td>
                  <td className="py-3">{t("yes")}</td>
                  <td className="py-3">{t("yes")}</td>
                  <td className="py-3">{t("bestGC")}</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3">{t("appPaper")}</td>
                  <td className="py-3">{t("pricePaper")}</td>
                  <td className="py-3">{t("livePaper")}</td>
                  <td className="py-3">{t("no")}</td>
                  <td className="py-3">{t("no")}</td>
                  <td className="py-3">{t("bestPaper")}</td>
                </tr>
                <tr>
                  <td className="py-3">{t("appRadar")}</td>
                  <td className="py-3">{t("priceRadar")}</td>
                  <td className="py-3">{t("liveRadar")}</td>
                  <td className="py-3">{t("no")}</td>
                  <td className="py-3">{t("no")}</td>
                  <td className="py-3">{t("bestRadar")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            <em>{t("tableNote")}</em>
          </p>

          <p className="mt-6 text-gray-700 dark:text-gray-300">{t("goDeeper")}</p>

          <h3 className="mt-10 text-xl font-bold text-gray-900 dark:text-white">
            {t("s1H3")}
          </h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblPitch")}</strong> {t.rich("s1Pitch", rich)}
          </p>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("lblWell")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s1Well1")}</li>
            <li>{t("s1Well2")}</li>
            <li>{t("s1Well3")}</li>
            <li>{t("s1Well4")}</li>
            <li>{t("s1Well5")}</li>
            <li>{t("s1Well6")}</li>
            <li>{t.rich("s1Well7", rich)}</li>
            <li>{t.rich("s1Well8", rich)}</li>
            <li>{t("s1Well9")}</li>
          </ul>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("s1ShortLabel")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s1Short1")}</li>
            <li>{t.rich("s1Short2", rich)}</li>
            <li>{t("s1Short3")}</li>
          </ul>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            {t.rich("s1Links", rich)}
          </p>

          <h3 className="mt-10 text-xl font-bold text-gray-900 dark:text-white">{t("s2H3")}</h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblPitch")}</strong> {t("s2Pitch")}
          </p>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("lblWell")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s2Well1")}</li>
            <li>{t("s2Well2")}</li>
            <li>{t("s2Well3")}</li>
          </ul>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("s2ShortLabel")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s2Short1")}</li>
            <li>{t("s2Short2")}</li>
            <li>{t("s2Short3")}</li>
          </ul>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblVerdict")}</strong> {t("s2Verdict")}
          </p>

          <h3 className="mt-10 text-xl font-bold text-gray-900 dark:text-white">{t("s3H3")}</h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblPitch")}</strong> {t("s3Pitch")}
          </p>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("lblWell")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s3Well1")}</li>
            <li>{t("s3Well2")}</li>
            <li>{t("s3Well3")}</li>
            <li>{t("s3Well4")}</li>
          </ul>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("s3ShortLabel")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s3Short1")}</li>
            <li>{t("s3Short2")}</li>
            <li>{t.rich("s3Short3", rich)}</li>
          </ul>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblVerdict")}</strong> {t("s3Verdict")}
          </p>

          <h3 className="mt-10 text-xl font-bold text-gray-900 dark:text-white">
            {t("s4H3")}
          </h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblPitch")}</strong> {t("s4Pitch")}
          </p>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("lblWell")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s4Well1")}</li>
            <li>{t("s4Well2")}</li>
          </ul>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("s4ShortLabel")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s4Short1")}</li>
            <li>{t("s4Short2")}</li>
            <li>{t("s4Short3")}</li>
            <li>{t("s4Short4")}</li>
          </ul>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblVerdict")}</strong> {t("s4Verdict")}
          </p>

          <h3 className="mt-10 text-xl font-bold text-gray-900 dark:text-white">{t("s5H3")}</h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblPitch")}</strong> {t("s5Pitch")}
          </p>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("lblWell")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s5Well1")}</li>
            <li>{t("s5Well2")}</li>
          </ul>
          <p className="mt-3 font-semibold text-gray-900 dark:text-white">{t("s5ShortLabel")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t("s5Short1")}</li>
            <li>{t("s5Short2")}</li>
          </ul>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            <strong>{t("lblVerdict")}</strong> {t("s5Verdict")}
          </p>

          <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">{t("verdictH2")}</h2>
          <p className="mt-3 text-gray-700 dark:text-gray-300">{t("verdictP")}</p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
            <li>{t.rich("verdictLi1", rich)}</li>
            <li>{t.rich("verdictLi2", rich)}</li>
            <li>{t.rich("verdictLi3", rich)}</li>
          </ul>
          <p className="mt-3 text-gray-700 dark:text-gray-300">{t("verdictAfter")}</p>

          <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">{t("faqH2")}</h2>

          <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">{t("faqQ1")}</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{t("faqA1")}</p>

          <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">{t("faqQ2")}</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{t("faqA2")}</p>

          <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">{t("faqQ3")}</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{t("faqA3")}</p>

          <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">{t("faqQ4")}</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{t("faqA4")}</p>

          <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">{t("faqQ5")}</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{t("faqA5")}</p>

          <section className="mt-16 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">{t("ctaH2")}</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {t("ctaP")}
            </p>
            <div className="mt-6">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">$39</span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">{t("ctaOneTime")}</span>
            </div>
            <div className="mt-6">
              <Link
                href="/pricing"
                className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                {t("ctaBtn")}
              </Link>
            </div>
          </section>

          <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
            <Link href="/learn/gamechanger-pricing" className="hover:underline">
              → GameChanger pricing breakdown
            </Link>
            <Link href="/learn/best-baseball-stats-apps" className="hover:underline">
              → Best baseball stats apps
            </Link>
            <Link href="/compare" className="hover:underline">
              → Side-by-side app comparison
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
