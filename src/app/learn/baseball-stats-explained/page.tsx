import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/learn/baseball-stats-explained";
const PUBLISHED = "2026-07-01";
const MODIFIED = "2026-07-01";

export const metadata: Metadata = {
  title: "Baseball Stats Explained: AVG, OBP, SLG & OPS",
  description:
    "AVG, OBP, SLG, OPS — what each baseball stat means, how it's calculated, and what counts as good, explained in plain English for parents and new coaches.",
  keywords: [
    "baseball stats explained",
    "what is OPS in baseball",
    "OBP meaning",
    "SLG vs AVG",
    "on base percentage explained",
    "what is a good OPS",
    "baseball stats for parents",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "Baseball Stats Explained: AVG, OBP, SLG & OPS (Plain English)",
    description:
      "What AVG, OBP, SLG, and OPS mean, how they're calculated, and what counts as good in youth baseball. A plain-English guide for parents.",
    images: ["/og-image.png"],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseball Stats Explained: AVG, OBP, SLG & OPS",
    description:
      "What AVG, OBP, SLG, and OPS mean, how they're calculated, and what's good in youth baseball. Plain English.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "What is a good OPS in youth baseball?",
    a: "It varies by age and level, but as a rough guide an OPS around .700 is solid, .800+ is very good, and .900+ is excellent for most youth levels. Because youth pitching and fielding are inconsistent, compare a player to their own team and league rather than to pro benchmarks.",
  },
  {
    q: "Is OBP better than batting average?",
    a: "For measuring how often a hitter helps the team, yes — OBP counts walks and hit-by-pitches, not just hits, so it reflects how often a player avoids making an out. A kid with a modest average but a great eye can have a high OBP and be very valuable at the top of the lineup.",
  },
  {
    q: "How do you calculate slugging percentage (SLG)?",
    a: "Add up total bases (single = 1, double = 2, triple = 3, home run = 4) and divide by at-bats. A player with 10 total bases in 20 at-bats has a .500 slugging percentage. It measures power, not just contact.",
  },
  {
    q: "What is OPS and why do coaches use it?",
    a: "OPS is On-base Plus Slugging — you simply add OBP and SLG together. It combines getting on base and hitting for power into one number, which is why coaches use it as a quick overall measure of a hitter's value.",
  },
];

export default function BaseballStatsExplainedPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline:
                "Baseball Stats Explained: AVG, OBP, SLG & OPS (Plain English)",
              datePublished: PUBLISHED,
              dateModified: MODIFIED,
              author: { "@type": "Person", name: "Carl Andrews" },
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
              mainEntityOfPage: { "@type": "WebPage", "@id": URL },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.baseballstatstracker.com" },
                { "@type": "ListItem", position: 2, name: "Learn", item: "https://www.baseballstatstracker.com/learn/baseball-stats-explained" },
                { "@type": "ListItem", position: 3, name: "Baseball Stats Explained", item: URL },
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

      <header className="border-b border-gray-200/70 dark:border-gray-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">
            Baseball Stats Tracker
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/features" className="text-gray-600 hover:underline dark:text-gray-300">Features</Link>
            <Link href="/pricing" className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span>{" "}
          <span>Learn</span> <span aria-hidden>/</span> Baseball Stats Explained
        </nav>

        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Baseball stats explained: AVG, OBP, SLG &amp; OPS
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">By Carl Andrews · Updated July 2026</p>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          AVG, OBP, SLG, OPS — the alphabet soup on the back of a baseball card
          confuses a lot of parents. But each one answers a simple question about a
          hitter, and once you get them, you&apos;ll understand your kid&apos;s game
          on a whole new level. Here&apos;s each stat in plain English, how it&apos;s
          calculated, and what a &ldquo;good&rdquo; number looks like in youth ball.
        </p>

        <Section title="Batting average (AVG) — the classic">
          <p>
            Batting average is hits divided by at-bats. Get 1 hit in 4 at-bats and
            you&apos;re batting .250. It&apos;s the number everyone knows — but it has a
            blind spot: it ignores walks entirely. A patient hitter who draws a lot of
            walks can look &ldquo;average&rdquo; by AVG while actually helping the team
            a lot. Useful, but never the whole story.
          </p>
        </Section>

        <Section title="On-base percentage (OBP) — why coaches love it">
          <p>
            OBP measures how often a hitter reaches base <em>any</em> way that
            isn&apos;t an out — hits, walks, and hit-by-pitches — divided by their total
            plate appearances. That&apos;s why coaches prize it: a leadoff hitter with a
            great eye and a .420 OBP creates far more scoring chances than a
            free-swinger with a shiny average and a low OBP. Getting on base is the
            whole job at the top of the order.
          </p>
        </Section>

        <Section title="Slugging percentage (SLG) — measuring power">
          <p>
            Slugging weights <em>how far</em> a hitter gets, not just whether they
            reach. Add up total bases — single = 1, double = 2, triple = 3, home run =
            4 — and divide by at-bats. Two players can both hit .300, but the one
            cracking doubles and triples has a much higher slugging percentage. SLG is
            your power number.
          </p>
        </Section>

        <Section title="OPS — the one number that ties it together">
          <p>
            OPS is simply <strong>OBP + SLG</strong>. Add getting-on-base to
            hitting-for-power and you get a single, quick measure of a hitter&apos;s
            total offensive value. It&apos;s not perfect math, but it&apos;s the fastest
            honest snapshot of &ldquo;how good is this hitter,&rdquo; which is exactly
            why coaches and scouts lean on it.
          </p>
        </Section>

        <Section title="What counts as “good” at the youth level">
          <p>
            Pro benchmarks don&apos;t transfer cleanly to Little League, where pitching
            and fielding swing wildly game to game. As a rough guide, an OPS near .700
            is solid, .800+ is very good, and .900+ is excellent for most youth levels.
            The better move is to track each player against their own season and their
            own league — progress over time tells you more than any single number.
          </p>
        </Section>

        <Section title="Pitching stats in one minute">
          <p>
            <strong>ERA</strong> (earned run average) is earned runs per 7 innings —
            lower is better. <strong>WHIP</strong> is walks plus hits per inning
            pitched, a measure of how many baserunners a pitcher allows.{" "}
            <strong>K/BB</strong> is strikeouts divided by walks — command in one
            number. Those three tell you most of what you need about a young pitcher.
          </p>
        </Section>

        <Section title="Let the app do the math">
          <p>
            Here&apos;s the good news: you never have to calculate any of this by hand.
            When you{" "}
            <Link href="/features" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              score a game live with Baseball Stats Tracker
            </Link>
            , every one of these — AVG, OBP, SLG, OPS, ERA, and more — updates
            automatically after each at-bat, for every player, all season long. No
            spreadsheets, no scorebook math. And it&apos;s a{" "}
            <Link href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              one-time $39 purchase
            </Link>{" "}
            — no subscription. See{" "}
            <Link href="/compare" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              how it compares to other apps
            </Link>
            .
          </p>
        </Section>

        <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">Frequently asked questions</h2>
        <div className="mt-4 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.q}</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gray-900 p-8 text-center dark:bg-gray-800">
          <p className="text-2xl leading-snug font-bold text-white">Every stat, calculated for you.</p>
          <p className="mt-2 text-gray-300">Score your first game in 60 seconds. $39 once, no subscription.</p>
          <Link href="/pricing" className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Get Instant Access — $39
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
          <Link href="/learn/best-baseball-stats-apps" className="hover:underline">→ Best baseball stats apps</Link>
          <Link href="/learn/gamechanger-alternatives" className="hover:underline">→ GameChanger alternatives</Link>
          <Link href="/compare" className="hover:underline">→ Compare apps</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}
