import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/compare";
const MODIFIED = "2026-07-01";

export const metadata: Metadata = {
  title: "Baseball Stats App Comparison: GameChanger, iScore & More",
  description:
    "Compare the top youth baseball & softball stats apps side by side — GameChanger, iScore, paper scorebooks, spreadsheets, and the $39 one-time Baseball Stats Tracker. Pricing, live scoring, spray charts, and sync compared.",
  keywords: [
    "baseball stats app comparison",
    "GameChanger vs iScore",
    "best baseball scorekeeping app",
    "baseball stats app vs GameChanger",
    "youth baseball stats app comparison",
    "softball stats app comparison",
    "cheapest baseball stats app",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "Baseball Stats App Comparison: GameChanger, iScore & More (2026)",
    description:
      "Side-by-side comparison of the top youth baseball & softball stats apps. Pricing, features, and the $39 one-time option.",
    images: ["/og-image.png"],
    modifiedTime: MODIFIED,
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseball Stats App Comparison (2026): GameChanger, iScore & More",
    description:
      "Side-by-side comparison of the top youth baseball & softball stats apps. Pricing, features, and the $39 one-time option.",
    images: ["/og-image.png"],
  },
};

type Row = {
  app: string;
  price: string;
  liveScoring: string;
  sprayCharts: string;
  liveSync: string;
  bestFor: string;
  highlight?: boolean;
};

const rows: Row[] = [
  {
    app: "Baseball Stats Tracker",
    price: "$39 once",
    liveScoring: "Yes",
    sprayCharts: "Yes",
    liveSync: "Yes",
    bestFor: "Parents & coaches who want full stats without a monthly bill",
    highlight: true,
  },
  {
    app: "GameChanger",
    price: "Free basic; paid tier billed yearly",
    liveScoring: "Yes",
    sprayCharts: "Yes",
    liveSync: "Yes",
    bestFor: "Leagues that need team-wide adoption and video clips",
  },
  {
    app: "iScore",
    price: "One-time app fee (per platform)",
    liveScoring: "Yes",
    sprayCharts: "Limited",
    liveSync: "Add-on",
    bestFor: "Scorekeeping purists who want deep manual control",
  },
  {
    app: "Paper scorebook",
    price: "~$10",
    liveScoring: "Manual",
    sprayCharts: "No",
    liveSync: "No",
    bestFor: "Old-school scorekeepers who don't want a screen",
  },
  {
    app: "Spreadsheet",
    price: "Free",
    liveScoring: "No",
    sprayCharts: "No",
    liveSync: "No",
    bestFor: "DIY parents willing to enter every stat by hand later",
  },
];

const faqs = [
  {
    q: "What is the best baseball stats app for youth teams in 2026?",
    a: "For most youth baseball and softball families, the best value is an app that does live scoring, automatic stats, and spray charts without a recurring subscription. Baseball Stats Tracker delivers all three for a one-time $39 purchase, while most competitors charge monthly or yearly.",
  },
  {
    q: "How does Baseball Stats Tracker compare to GameChanger?",
    a: "GameChanger is powerful and popular, especially for leagues that want video and team-wide adoption, but its full stats features are billed on a recurring plan. Baseball Stats Tracker covers live scoring, batting and pitching stats, spray charts, box scores, and multi-device sync for a single $39 payment with no subscription.",
  },
  {
    q: "Is there a baseball stats app with no monthly subscription?",
    a: "Yes. Baseball Stats Tracker is a one-time $39 purchase with no monthly fees, no per-team charges, and no feature gates. You keep access across unlimited teams, seasons, and games.",
  },
  {
    q: "Do these apps work for softball too?",
    a: "Baseball Stats Tracker works identically for baseball and softball at every level — Little League, travel ball, rec, high school, and college. GameChanger and iScore also support softball. Paper and spreadsheets work for any sport but require manual entry.",
  },
];

export default function ComparePage() {
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
                  name: "Compare",
                  item: URL,
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

      {/* Simple marketing header */}
      <header className="border-b border-gray-200/70 dark:border-gray-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">
            Baseball Stats Tracker
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/features" className="text-gray-600 hover:underline dark:text-gray-300">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:underline dark:text-gray-300">
              Pricing
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span> Compare
        </nav>

        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Baseball stats app comparison
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Every youth baseball and softball family eventually asks the same question:
          which stats app is actually worth it? Here&apos;s an honest, side-by-side look at
          the real options in 2026 — what they cost, what they do, and who each one fits.
        </p>

        {/* Comparison table */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800" tabIndex={0} role="region" aria-label="Comparison table">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gray-100/70 dark:bg-gray-900">
                <th className="p-3 font-semibold">App</th>
                <th className="p-3 font-semibold">Pricing</th>
                <th className="p-3 font-semibold">Live scoring</th>
                <th className="p-3 font-semibold">Spray charts</th>
                <th className="p-3 font-semibold">Live sync</th>
                <th className="p-3 font-semibold">Best for</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.app}
                  className={
                    r.highlight
                      ? "bg-blue-50/60 dark:bg-blue-900/20"
                      : "border-t border-gray-200 dark:border-gray-800"
                  }
                >
                  <td className="p-3 font-semibold text-gray-900 dark:text-white">{r.app}</td>
                  <td className="p-3">{r.price}</td>
                  <td className="p-3">{r.liveScoring}</td>
                  <td className="p-3">{r.sprayCharts}</td>
                  <td className="p-3">{r.liveSync}</td>
                  <td className="p-3">{r.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verdict */}
        <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">The honest verdict</h2>
        <p className="mt-3">
          If your league <em>requires</em> a specific app, use what they mandate. But if the
          choice is yours and you mostly want clean stats, spray charts, and a live box score
          your family can follow — without paying every single month — a one-time purchase wins
          the math over a full youth-sports career. That&apos;s exactly why we built{" "}
          <Link href="/features" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            Baseball Stats Tracker
          </Link>{" "}
          as a{" "}
          <Link href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            $39 one-time app
          </Link>
          : every at-bat, every game, every season — saved forever, no subscription.
        </p>

        {/* FAQ */}
        <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">Frequently asked questions</h2>
        <div className="mt-4 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.q}</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{f.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gray-900 p-8 text-center dark:bg-gray-800">
          <p className="text-2xl leading-snug font-bold text-white">One price. Everything included.</p>
          <p className="mt-2 text-gray-300">
            $39 once. No subscription. Score your first game in 60 seconds.
          </p>
          <Link
            href="/pricing"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Get Instant Access — $39
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
          <Link href="/learn/gamechanger-vs-baseball-stats-tracker" className="hover:underline">
            → GameChanger vs Baseball Stats Tracker
          </Link>
          <Link href="/learn/gamechanger-alternatives" className="hover:underline">
            → GameChanger alternatives
          </Link>
          <Link href="/learn/gamechanger-pricing" className="hover:underline">
            → GameChanger pricing breakdown
          </Link>
          <Link href="/learn/best-baseball-stats-apps" className="hover:underline">
            → Best baseball stats apps
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
