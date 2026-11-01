import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/learn/baseball-spray-chart-guide";
const PUBLISHED = "2026-07-01";
const MODIFIED = "2026-07-01";

export const metadata: Metadata = {
  title: "How to Read a Baseball Spray Chart (Coaching Guide)",
  description:
    "What a baseball spray chart shows, how to read hit locations and color coding, and how youth coaches use them to set the lineup and position the defense.",
  keywords: [
    "baseball spray chart",
    "how to read a spray chart",
    "spray chart baseball meaning",
    "hitting spray chart",
    "defensive positioning youth baseball",
    "baseball hit chart",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "How to Read a Baseball Spray Chart (and Actually Use It)",
    description:
      "Read hit locations, spot pull vs. opposite-field tendencies, and position your defense with spray charts.",
    images: ["/og-image.png"],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Read a Baseball Spray Chart (Coaching Guide)",
    description: "Read hit locations, spot tendencies, and position your defense with spray charts.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "What is a baseball spray chart?",
    a: "A spray chart is a diagram of the field with a dot for every ball a hitter puts in play, placed where the ball went. Over a season it shows a player's tendencies at a glance — where they hit the ball most often and with what results.",
  },
  {
    q: "What do the colors on a spray chart mean?",
    a: "Most spray charts color-code hits by outcome. In Baseball Stats Tracker: singles are green, doubles blue, triples orange, home runs red, and outs gray. The colors let you separate 'where they hit it' from 'how well they hit it' in one picture.",
  },
  {
    q: "How do coaches use spray charts?",
    a: "Two main ways: positioning the defense (shift fielders toward where a hitter actually hits) and building the lineup (pair pull hitters and opposite-field hitters intelligently). It turns gut feel into evidence.",
  },
  {
    q: "How do I make a spray chart without drawing it by hand?",
    a: "Tap the field location for each batted ball while you score the game, and the chart builds itself. Baseball Stats Tracker generates spray charts automatically for every player, all season, as part of a one-time $39 purchase.",
  },
];

export default function SprayChartGuidePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <ArticleSchema
        headline="How to Read a Baseball Spray Chart (and Actually Use It)"
        crumb="Baseball Spray Chart Guide"
        url={URL}
        published={PUBLISHED}
        modified={MODIFIED}
        faqs={faqs}
      />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <Breadcrumb label="Baseball Spray Chart Guide" />
        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          How to read a baseball spray chart
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">By Carl Andrews · Updated July 2026</p>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          A spray chart turns a season of at-bats into one picture: where your hitter actually
          hits the ball. Once you can read it, you stop guessing — you know which kid pulls
          everything, who slaps it the other way, and where to stand your fielders before the
          pitch. Here&apos;s how to read one, and how to use it.
        </p>

        <Section title="What a spray chart is">
          <p>
            It&apos;s a field diagram with a dot for every batted ball, placed where it went.
            Left side of the chart is left field, right side is right field. Cluster the dots
            over a season and a pattern appears — that pattern is the whole point.
          </p>
        </Section>

        <Section title="Reading location and color coding">
          <p>
            Location tells you <em>direction</em>; color tells you <em>outcome</em>. In
            Baseball Stats Tracker, singles are green, doubles blue, triples orange, home runs
            red, and outs gray. A wall of green dots to the pull side means a hitter who
            consistently pulls singles; scattered red and blue means real power to all fields.
          </p>
        </Section>

        <Section title="Pull hitter vs. opposite-field hitter">
          <p>
            A right-handed hitter who sprays everything to the left side is a{" "}
            <strong>pull hitter</strong>. One who consistently goes to right field is an{" "}
            <strong>opposite-field hitter</strong>. Most youth hitters lean one way — and
            once you can see it on the chart, you can coach it and defend it.
          </p>
        </Section>

        <Section title="Using it to position your defense">
          <p>
            If the chart shows a hitter pulls the ball 80% of the time, shade your infield and
            outfield toward that side before the pitch. You&apos;ll turn more of their hardest
            contact into outs — the same idea the pros use, scaled down to your field.
          </p>
        </Section>

        <Section title="Using it to build the lineup">
          <p>
            Spray charts also reveal who actually drives the ball versus who just makes
            contact. Pair that with{" "}
            <Link href="/learn/baseball-stats-explained" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              on-base and slugging numbers
            </Link>{" "}
            and your lineup decisions stop being guesses.
          </p>
        </Section>

        <Section title="Build one automatically while you score">
          <p>
            You never have to plot a dot by hand. Tap the field location for each batted ball
            as you{" "}
            <Link href="/features" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              score with Baseball Stats Tracker
            </Link>
            , and the spray chart builds itself for every hitter, all season — part of a{" "}
            <Link href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              one-time $39 purchase
            </Link>{" "}
            with no subscription. See how it{" "}
            <Link href="/compare" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              compares to other apps
            </Link>
            .
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
      <p className="text-2xl leading-snug font-bold text-white">Spray charts, built for you.</p>
      <p className="mt-2 text-gray-300">Tap the field, get the chart. $39 once, no subscription.</p>
      <Link href="/pricing" className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Get Instant Access — $39
      </Link>
    </div>
  );
}

function RelatedLinks() {
  return (
    <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
      <Link href="/learn/baseball-stats-explained" className="hover:underline">→ Baseball stats explained</Link>
      <Link href="/learn/how-to-keep-score-in-baseball" className="hover:underline">→ How to keep score</Link>
      <Link href="/features" className="hover:underline">→ See the features</Link>
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
