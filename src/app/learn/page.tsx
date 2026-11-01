import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/learn";

export const metadata: Metadata = {
  title: "Baseball Guides for Parents & Coaches | Baseball Stats Tracker",
  description:
    "Plain-English guides on baseball stats, scorekeeping, spray charts, and stats apps — written for youth and travel ball parents and coaches.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Baseball Guides for Parents & Coaches",
    description:
      "Plain-English guides on baseball stats, scorekeeping, spray charts, and stats apps.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseball Guides for Parents & Coaches",
    description:
      "Plain-English guides on baseball stats, scorekeeping, spray charts, and stats apps.",
    images: ["/og-image.png"],
  },
};

const articles = [
  {
    href: "/learn/gamechanger-alternatives",
    title: "GameChanger Alternatives 2026: Top 5 for Youth Baseball",
    description:
      "Looking for a cheaper, simpler alternative to GameChanger? We compare 5 real options for youth baseball and softball families.",
    updated: "May 2026",
  },
  {
    href: "/learn/gamechanger-vs-baseball-stats-tracker",
    title: "GameChanger vs Baseball Stats Tracker: The True Lifetime Math",
    description:
      "An honest head-to-head — features, who each app fits, and what a full youth-sports career costs on a subscription vs $39 once.",
    updated: "July 2026",
  },
  {
    href: "/learn/gamechanger-pricing",
    title: "GameChanger Pricing in 2026: What It Actually Costs",
    description:
      "What's free, what's paid, who gets billed, and how the yearly cost compares to a $39 one-time app.",
    updated: "July 2026",
  },
  {
    href: "/learn/best-baseball-stats-apps",
    title: "Best Baseball Stats Apps in 2026: Top 5 Compared",
    description:
      "The best baseball stats apps for youth, travel, and high school teams — live scoring, spray charts, and pricing compared.",
    updated: "June 2026",
  },
  {
    href: "/learn/baseball-stats-explained",
    title: "Baseball Stats Explained: AVG, OBP, SLG & OPS",
    description:
      "What each baseball stat means, how it's calculated, and what counts as good — in plain English for parents and new coaches.",
    updated: "July 2026",
  },
  {
    href: "/learn/how-to-keep-score-in-baseball",
    title: "How to Keep Score in Baseball: A Beginner's Guide",
    description:
      "The scorebook grid, every symbol, and the easier way to do it live from your phone. A parent-friendly guide.",
    updated: "July 2026",
  },
  {
    href: "/learn/how-to-keep-score-in-softball",
    title: "How to Keep Score in Softball: The Ultimate Scoring Guide",
    description:
      "Same symbols as baseball, different game — 7 innings, DP/Flex, bigger lineups, and mercy rules, explained for parents.",
    updated: "July 2026",
  },
  {
    href: "/learn/baseball-spray-chart-guide",
    title: "How to Read a Baseball Spray Chart (Coaching Guide)",
    description:
      "What a spray chart shows, how to read hit locations, and how youth coaches use them to set the lineup and position the defense.",
    updated: "July 2026",
  },
];

export default function LearnIndexPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <CollectionSchema />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span>{" "}
          Learn
        </nav>
        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Baseball guides for parents &amp; coaches
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Plain-English guides on stats, scorekeeping, spray charts, and the apps that
          track them — written for youth and travel ball families, not front offices.
        </p>

        <div className="mt-10 space-y-6">
          {articles.map((a) => (
            <article
              key={a.href}
              className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                <Link href={a.href} className="hover:underline">
                  {a.title}
                </Link>
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{a.description}</p>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Updated {a.updated} ·{" "}
                <Link
                  href={a.href}
                  className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Read the guide
                </Link>
              </p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-gray-600 dark:text-gray-300">
          Ready to track your own team? See{" "}
          <Link href="/features" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            what Baseball Stats Tracker does
          </Link>
          , check the{" "}
          <Link href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            one-time $39 pricing
          </Link>
          , or see{" "}
          <Link href="/compare" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            how it compares to GameChanger
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}

function MarketingHeader() {
  return (
    <header className="border-b border-gray-200/70 dark:border-gray-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">Baseball Stats Tracker</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/features" className="text-gray-600 hover:underline dark:text-gray-300">Features</Link>
          <Link href="/pricing" className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700">Get Started</Link>
        </div>
      </div>
    </header>
  );
}

function CollectionSchema() {
  const json = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Baseball Guides for Parents & Coaches",
    url: URL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: `https://www.baseballstatstracker.com${a.href}`,
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
