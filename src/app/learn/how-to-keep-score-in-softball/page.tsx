import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/learn/how-to-keep-score-in-softball";
const PUBLISHED = "2026-07-06";
const MODIFIED = "2026-07-06";

export const metadata: Metadata = {
  title: "How to Keep Score in Softball: The Ultimate Scoring Guide",
  description:
    "Learn how to keep score in softball step by step — the scorebook grid, every symbol, what's different from baseball, and the easier way to score live from your phone.",
  keywords: [
    "how to keep score in softball",
    "softball scorekeeping for beginners",
    "softball scorebook symbols",
    "how to score a softball game",
    "softball scoring guide",
    "fastpitch softball scorebook",
    "softball stats app",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "How to Keep Score in Softball (The Ultimate Guide for Parents)",
    description:
      "The scorebook grid, every symbol, what's different from baseball scoring, and the modern way to score live from your phone.",
    images: ["/og-image.png"],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Keep Score in Softball: The Ultimate Scoring Guide",
    description:
      "The scorebook grid, every symbol, and the easier way to score a softball game live from your phone.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "Is scoring softball different from scoring baseball?",
    a: "The symbols and position numbers are identical, so anything you learned for baseball transfers directly. The differences are structural: softball games are usually 7 innings instead of 9, many leagues bat more players (or the whole roster), fastpitch uses a Designated Player (DP) and Flex rule instead of baseball's DH, and run-ahead (mercy) rules end games early more often.",
  },
  {
    q: "What does DP and Flex mean in a softball lineup?",
    a: "The Designated Player (DP) bats for the Flex player, but unlike a baseball DH, both can also play defense and swap roles during the game. On the scorecard, the DP occupies a spot in the batting order while the Flex is listed 10th and plays defense only — until the coach starts moving them around. It's the single most confusing thing in fastpitch scorekeeping.",
  },
  {
    q: "What does a backwards K mean in softball scoring?",
    a: "Same as baseball: a regular K is a strikeout swinging, and a backwards K (ꓘ) means the batter took a called third strike without swinging. The strike zone and pitching style are different in softball, but the notation is identical.",
  },
  {
    q: "Is there an app that keeps softball stats for me?",
    a: "Yes. Baseball Stats Tracker works identically for softball and baseball — tap each at-bat as it happens and it builds the box score, batting and pitching stats, and spray charts automatically. It handles 7-inning games and any lineup size, for a one-time $39 purchase with no subscription.",
  },
];

const positions = [
  ["1", "Pitcher"],
  ["2", "Catcher"],
  ["3", "First base"],
  ["4", "Second base"],
  ["5", "Third base"],
  ["6", "Shortstop"],
  ["7", "Left field"],
  ["8", "Center field"],
  ["9", "Right field"],
];

const symbols = [
  ["1B", "Single"],
  ["2B", "Double"],
  ["3B", "Triple"],
  ["HR", "Home run"],
  ["BB", "Walk (base on balls)"],
  ["HBP", "Hit by pitch"],
  ["K", "Strikeout swinging"],
  ["ꓘ", "Strikeout looking"],
  ["F8", "Fly out (to center field)"],
  ["6-3", "Ground out (short to first)"],
  ["FC", "Fielder's choice"],
  ["E5", "Error (on third base)"],
  ["SB", "Stolen base"],
  ["SAC", "Sacrifice bunt"],
  ["SF", "Sacrifice fly"],
];

export default function HowToKeepScoreSoftballPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <ArticleSchema
        headline="How to Keep Score in Softball: The Ultimate Scoring Guide for Parents"
        crumb="How to Keep Score in Softball"
        url={URL}
        published={PUBLISHED}
        modified={MODIFIED}
        faqs={faqs}
      />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <Breadcrumb label="How to Keep Score in Softball" />
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          How to keep score in softball
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">By Carl Andrews · Updated July 2026</p>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          Softball scorekeeping uses the exact same language as baseball — the same
          position numbers, the same backwards K — but the game around it is different:
          seven innings, bigger lineups, the DP/Flex rule, and mercy rules that end games
          early. This guide covers the basics fast, then the softball-specific parts that
          trip everyone up.
        </p>

        <Section title="The basics: identical to baseball">
          <p>
            Every defensive position has a number, and scorekeepers use those numbers to
            record who fielded the ball:
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {positions.map(([n, name]) => (
              <li key={n}>
                <strong>{n}</strong> — {name}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            A ground out from shortstop to first is <strong>6-3</strong>. A fly out to
            center is <strong>F8</strong>. If you&apos;ve ever scored a baseball game,
            you already know this part — nothing changes.
          </p>
          <p>
            One wrinkle: in leagues that play with four outfielders (common in slowpitch
            and some rec fastpitch), the extra outfielder is position <strong>10</strong>.
          </p>
        </Section>

        <Section title="Every symbol you actually need">
          <div className="mt-2 overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison table">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="py-2 pr-4 font-semibold text-gray-900 dark:text-white">Symbol</th>
                  <th className="py-2 font-semibold text-gray-900 dark:text-white">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {symbols.map(([s, meaning]) => (
                  <tr key={s} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-1.5 pr-4 font-mono font-semibold">{s}</td>
                    <td className="py-1.5">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="What's different in softball">
          <p>
            <strong>Seven innings, not nine.</strong> Regulation fastpitch and slowpitch
            games are 7 innings (youth games are often 6 or time-limited). Your scorebook
            columns end sooner — and extra-inning tiebreakers often start with a runner
            placed on second base, which you should mark as a placed runner, not a hit.
          </p>
          <p>
            <strong>The DP/Flex rule.</strong> Fastpitch&apos;s answer to the DH, but more
            flexible and far more confusing. The <strong>Designated Player (DP)</strong>{" "}
            bats in one of the nine batting slots; the <strong>Flex</strong> plays defense
            only and is listed tenth. Unlike a baseball DH, the DP can also play defense,
            and the Flex can be brought in to bat for the DP. Scorekeepers survive this by
            recording <em>who actually batted and what happened</em> — let the coach worry
            about the legality.
          </p>
          <p>
            <strong>Bigger batting orders.</strong> Many youth and rec leagues bat 10, 11,
            or the entire roster instead of nine. Every extra batter needs a row in your
            book, and the wrap-around from the last batter to the first is where paper
            scorekeepers most often lose the plot.
          </p>
          <p>
            <strong>Run-ahead (mercy) rules.</strong> Games commonly end early when a team
            leads by 15 after 3 innings, 10 after 4, or 8 after 5 (rules vary by league).
            Note the final inning clearly so the shortened game doesn&apos;t look like a
            mistake later.
          </p>
          <p>
            <strong>Pitching is a different world.</strong> Windmill pitchers can throw
            far more innings than baseball pitchers, so one pitcher may go the whole game
            — but illegal-pitch calls (a ball awarded to the batter, runners advance) are a
            notation baseball scorebooks never need.
          </p>
        </Section>

        <Section title="Scoring an inning, step by step">
          <p>Each batter gets one box per inning. For every plate appearance:</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Write the result symbol (1B, BB, 6-3, ꓘ…) in the batter&apos;s box.</li>
            <li>Darken the diamond one base at a time as the runner advances.</li>
            <li>Fill the diamond completely when the runner scores; note the RBI on the batter who drove them in.</li>
            <li>Mark outs with a circled number (①, ②, ③) so you always know where the inning stands.</li>
            <li>Draw a diagonal line across the bottom-right of the last box when the inning ends.</li>
          </ol>
          <p className="mt-3">
            After the game, total each column: at-bats, hits, runs, RBIs, walks,
            strikeouts. That&apos;s your box score — and the pencil math is where most
            bleacher scorekeepers give up.
          </p>
        </Section>

        <Section title="The easier way: score from your phone">
          <p>
            Everything above works — it&apos;s how scorekeeping has been done for a century.
            But it means carrying a clipboard, doing math between innings, and hoping the
            book doesn&apos;t get left in a dugout. A scoring app replaces all of it: tap
            the result of each at-bat and the box score, season stats, and{" "}
            <Link href="/learn/baseball-spray-chart-guide" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              spray charts
            </Link>{" "}
            build themselves.
          </p>
          <p>
            <Link href="/features" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Baseball Stats Tracker
            </Link>{" "}
            works identically for softball and baseball — 7-inning games, any lineup size,
            batting the whole roster — and syncs live so the other parents can{" "}
            <Link href="/learn/how-to-keep-score-in-baseball" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              follow along
            </Link>{" "}
            from anywhere. It&apos;s a{" "}
            <Link href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              one-time $39 purchase
            </Link>
            , not a subscription. Prefer paper? Grab our{" "}
            <Link href="/free-baseball-scorecard" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              free printable scorecard
            </Link>{" "}
            — it works for softball too.
          </p>
        </Section>

        <FaqBlock faqs={faqs} />
        <CtaCard />
        <RelatedLinks />
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
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

function Breadcrumb({ label }: { label: string }) {
  return (
    <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span>{" "}
      <Link href="/learn" className="hover:underline">Learn</Link> <span aria-hidden>/</span> {label}
    </nav>
  );
}

function FaqBlock({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <>
      <h2 className="mt-12 text-2xl font-bold text-gray-900 dark:text-white">Frequently asked questions</h2>
      <div className="mt-4 space-y-6">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold text-gray-900 dark:text-white">{f.q}</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-300">{f.a}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function CtaCard() {
  return (
    <div className="mt-12 rounded-2xl bg-gray-900 p-8 text-center dark:bg-gray-800">
      <p className="text-2xl font-bold text-white">Softball stats without the pencil math.</p>
      <p className="mt-2 text-gray-300">Tap each at-bat; the app does the rest. $39 once, no subscription.</p>
      <Link href="/pricing" className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Get Instant Access — $39
      </Link>
    </div>
  );
}

function RelatedLinks() {
  return (
    <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
      <Link href="/learn/how-to-keep-score-in-baseball" className="hover:underline">→ How to keep score in baseball</Link>
      <Link href="/free-baseball-scorecard" className="hover:underline">→ Free printable scorecard</Link>
      <Link href="/learn/baseball-stats-explained" className="hover:underline">→ Stats explained</Link>
      <Link href="/compare" className="hover:underline">→ Compare apps</Link>
    </div>
  );
}

function ArticleSchema({
  headline, crumb, url, published, modified, faqs,
}: {
  headline: string; crumb: string; url: string; published: string; modified: string;
  faqs: { q: string; a: string }[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline,
            datePublished: published,
            dateModified: modified,
            author: { "@type": "Person", name: "Carl Andrews" },
            publisher: {
              "@type": "Organization",
              name: "Baseball Stats Tracker",
              logo: { "@type": "ImageObject", url: "https://www.baseballstatstracker.com/logo.png", width: 512, height: 512 },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.baseballstatstracker.com" },
              { "@type": "ListItem", position: 2, name: "Learn", item: "https://www.baseballstatstracker.com/learn" },
              { "@type": "ListItem", position: 3, name: crumb, item: url },
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
  );
}
