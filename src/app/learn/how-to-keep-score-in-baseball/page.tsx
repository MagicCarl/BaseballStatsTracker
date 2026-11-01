import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/learn/how-to-keep-score-in-baseball";
const PUBLISHED = "2026-07-01";
const MODIFIED = "2026-07-01";

export const metadata: Metadata = {
  title: "How to Keep Score in Baseball: A Beginner's Guide",
  description:
    "Learn how to keep score in baseball step by step — the scorebook grid, every symbol, and the easier way to do it live from your phone. A parent-friendly guide.",
  keywords: [
    "how to keep score in baseball",
    "baseball scorekeeping for beginners",
    "baseball scorebook symbols",
    "how to score a baseball game",
    "backwards K meaning",
    "how to read a baseball scorebook",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "How to Keep Score in Baseball (Beginner's Guide for Parents)",
    description:
      "The scorebook grid, every symbol you need, and the modern way to score a game live from your phone.",
    images: ["/og-image.png"],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Keep Score in Baseball: A Beginner's Guide",
    description:
      "The scorebook grid, every symbol, and the easier way to score a game live from your phone.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "What does a backwards K mean in baseball scoring?",
    a: "A regular K means a strikeout swinging. A backwards K (ꓘ) means the batter struck out looking — they took a called third strike without swinging. It's a small notation that tells you exactly how the strikeout happened.",
  },
  {
    q: "What does 6-4-3 mean on a scorecard?",
    a: "Those numbers are fielding positions: 6 is the shortstop, 4 is the second baseman, 3 is the first baseman. A 6-4-3 is a double play where the shortstop fields the ball, throws to second, who throws to first. Every position has a number 1–9, which is how scorekeepers record who touched the ball.",
  },
  {
    q: "Do I have to use a paper scorebook to keep stats?",
    a: "No. Paper works, but it's slow and easy to lose. A scoring app records each at-bat with a tap and calculates every stat automatically, so you keep the same information without the pencil math — and it never gets left in a gym bag.",
  },
  {
    q: "Is there an app that keeps score for me?",
    a: "Yes. Baseball Stats Tracker lets you tap the result of each at-bat as it happens, then builds the box score, batting and pitching stats, and spray charts for you automatically — for a one-time $39 purchase with no subscription.",
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

export default function HowToKeepScorePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <ArticleSchema
        headline="How to Keep Score in Baseball: A Beginner's Guide for Parents"
        crumb="How to Keep Score in Baseball"
        url={URL}
        published={PUBLISHED}
        modified={MODIFIED}
        faqs={faqs}
      />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <Breadcrumb label="How to Keep Score in Baseball" />
        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          How to keep score in baseball
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">By Carl Andrews · Updated July 2026</p>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          The first time someone hands you a scorebook in the bleachers, it looks like a
          math test written in hieroglyphics — little numbers, backwards K&apos;s, diagonal
          lines everywhere. But keeping score isn&apos;t hard once you learn a handful of
          symbols, and it&apos;s the only way to actually remember what your kid did at the
          plate three weeks from now. Here&apos;s the simple version.
        </p>

        <Section title="Why keep score at all">
          <p>
            A scorebook turns a blur of innings into a record you can actually use: who&apos;s
            hot, who&apos;s struggling, how the game really went. Coaches use it to build the
            lineup; parents use it to remember the big moments. Without it, the season just
            evaporates.
          </p>
        </Section>

        <Section title="The position numbers (learn these first)">
          <p>Every defensive position has a number. Scorekeepers use them to record who fielded the ball:</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {positions.map(([n, name]) => (
              <li key={n}>
                <strong>{n}</strong> — {name}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            So a ground out from shortstop to first base is written <strong>6-3</strong>. A
            fly out to center field is <strong>F8</strong>.
          </p>
        </Section>

        <Section title="The symbols you'll actually use">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>1B, 2B, 3B, HR</strong> — single, double, triple, home run</li>
            <li><strong>K</strong> — strikeout swinging · <strong>ꓘ</strong> (backwards K) — strikeout looking</li>
            <li><strong>BB</strong> — walk · <strong>HBP</strong> — hit by pitch</li>
            <li><strong>F7 / F8 / F9</strong> — fly out to left / center / right</li>
            <li><strong>6-3, 5-3, 4-3</strong> — ground outs (fielder to first base)</li>
            <li><strong>FC</strong> — fielder&apos;s choice · <strong>E6</strong> — error on the shortstop</li>
          </ul>
        </Section>

        <Section title="Scoring one at-bat, step by step">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Find the batter&apos;s box for that inning.</li>
            <li>Watch the result — hit, out, walk, or strikeout.</li>
            <li>Write the symbol (e.g. <strong>1B</strong> for a single).</li>
            <li>Trace the runner around the little diamond as they advance.</li>
            <li>Fill the diamond in when they score.</li>
          </ol>
          <p className="mt-3">That&apos;s it. Repeat for nine hitters, nine innings.</p>
        </Section>

        <Section title="Common beginner mistakes">
          <ul className="list-disc space-y-1 pl-5">
            <li>Forgetting to advance runners on the next hit — do it in the moment, not later.</li>
            <li>Mixing up a hit and a fielder&apos;s choice or error (only clean hits are hits).</li>
            <li>Falling behind during a big inning — this is where paper hurts the most.</li>
          </ul>
        </Section>

        <Section title="The modern way: let your phone do it">
          <p>
            You don&apos;t have to draw a single diamond. With{" "}
            <Link href="/features" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Baseball Stats Tracker
            </Link>{" "}
            you tap the result of each at-bat as it happens, and the app builds the box
            score, batting and pitching stats, and{" "}
            <Link href="/learn/baseball-spray-chart-guide" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              spray charts
            </Link>{" "}
            automatically — no pencil math, nothing to lose. It&apos;s a{" "}
            <Link href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              one-time $39 purchase
            </Link>
            , no subscription.
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

/* ---- shared bits (kept local to the article) ---- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">{title}</h2>
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
      <span>Learn</span> <span aria-hidden>/</span> {label}
    </nav>
  );
}

function FaqBlock({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <>
      <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">Frequently asked questions</h2>
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
      <p className="text-2xl leading-snug font-bold text-white">Score without the pencil math.</p>
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
      <Link href="/learn/how-to-keep-score-in-softball" className="hover:underline">→ Softball scoring guide</Link>
      <Link href="/free-baseball-scorecard" className="hover:underline">→ Free printable scorecard</Link>
      <Link href="/learn/baseball-stats-explained" className="hover:underline">→ Baseball stats explained</Link>
      <Link href="/learn/baseball-spray-chart-guide" className="hover:underline">→ Spray chart guide</Link>
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
              { "@type": "ListItem", position: 2, name: "Learn", item: url },
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
