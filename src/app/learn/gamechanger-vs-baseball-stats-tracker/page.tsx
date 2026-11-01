import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/learn/gamechanger-vs-baseball-stats-tracker";
const PUBLISHED = "2026-07-06";
const MODIFIED = "2026-07-06";

export const metadata: Metadata = {
  title: "GameChanger vs Baseball Stats Tracker: The True Lifetime Math",
  description:
    "GameChanger vs Baseball Stats Tracker compared honestly — features, what each is best at, and what a youth-sports career actually costs on a subscription vs $39 once.",
  keywords: [
    "GameChanger vs Baseball Stats Tracker",
    "GameChanger alternative",
    "GameChanger comparison",
    "baseball stats app comparison",
    "GameChanger vs",
    "cheaper than GameChanger",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "GameChanger vs Baseball Stats Tracker: The True Lifetime Math",
    description:
      "An honest head-to-head — features, who each app fits, and what a full youth-sports career costs on a subscription vs $39 once.",
    images: ["/og-image.png"],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
  twitter: {
    card: "summary_large_image",
    title: "GameChanger vs Baseball Stats Tracker",
    description:
      "An honest head-to-head — features, fit, and the true lifetime cost of a subscription vs $39 once.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "Is Baseball Stats Tracker better than GameChanger?",
    a: "It depends on what you need. GameChanger is better if you want video clips or your league already standardizes on it. Baseball Stats Tracker is better if you want live scoring, automatic stats, spray charts, and family sharing without a recurring subscription — it's a one-time $39 purchase.",
  },
  {
    q: "How much cheaper is Baseball Stats Tracker than GameChanger?",
    a: "Baseball Stats Tracker is $39 once, forever. GameChanger's premium features are billed on a recurring plan that families pay again every year. Over a multi-season youth career, a recurring plan typically costs several times more than a single $39 purchase — check GameChanger's site for their current rates and do the multiplication for your own timeline.",
  },
  {
    q: "Can family watch games live on Baseball Stats Tracker like GameChanger?",
    a: "Yes. Tap Share on the live scoring page and anyone with the link can follow the game in real time — live scoreboard, box score, and play-by-play — with no account and no app to install.",
  },
  {
    q: "Does Baseball Stats Tracker have video like GameChanger?",
    a: "No, and that's a deliberate choice. Video streaming is the single most expensive feature to run — it's a big part of why GameChanger needs a subscription. If video clips are your priority, GameChanger is the right pick. If stats are the priority, you shouldn't have to pay yearly for them.",
  },
];

const rows: [string, string, string][] = [
  ["Price", "$39 once, forever", "Free tier; premium billed yearly, every year"],
  ["Live scoring", "Yes — tap each at-bat", "Yes"],
  ["Automatic stats (AVG, OBP, SLG, OPS)", "Yes, standard MLB formulas", "Yes; deeper stats on paid tiers"],
  ["Spray charts", "Yes — per game and season", "Yes, on paid plans"],
  ["Family follows live", "Yes — share link, no account needed", "Yes — viewers use the GameChanger app"],
  ["Stat splits & filtering", "Yes — by opponent, pitcher, handedness, date", "Varies by plan"],
  ["Video clips & streaming", "No — by design (it's why we have no subscription)", "Yes — its standout feature"],
  ["Team messaging & scheduling", "No — we do stats, not chat", "Yes"],
  ["Works for softball", "Yes, identically", "Yes"],
  ["Data after you stop paying", "Yours forever — there's nothing to cancel", "Premium features end with the subscription"],
];

export default function GameChangerVsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <ArticleSchema
        headline="GameChanger vs Baseball Stats Tracker: The True Lifetime Math"
        crumb="GameChanger vs Baseball Stats Tracker"
        url={URL}
        published={PUBLISHED}
        modified={MODIFIED}
        faqs={faqs}
      />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <Breadcrumb label="GameChanger vs Baseball Stats Tracker" />
        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          GameChanger vs Baseball Stats Tracker
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">By Carl Andrews · Updated July 2026</p>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          Full disclosure up front: we make Baseball Stats Tracker, and GameChanger is a
          good product — that&apos;s why your league probably uses it. This comparison is
          honest about where each app wins, because the two are built on opposite bets:
          GameChanger bundles everything (video, chat, scheduling) behind a subscription;
          we do stats exceptionally well for one payment of $39.
        </p>

        <Section title="Head to head">
          <div className="mt-2 overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison table">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="py-2 pr-3 font-semibold text-gray-900 dark:text-white"><span className="sr-only">Feature</span></th>
                  <th className="py-2 pr-3 font-semibold text-blue-600 dark:text-blue-400">Baseball Stats Tracker</th>
                  <th className="py-2 font-semibold text-gray-900 dark:text-white">GameChanger</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, us, them]) => (
                  <tr key={label} className="border-b border-gray-100 align-top dark:border-gray-800">
                    <td className="py-2 pr-3 font-medium text-gray-900 dark:text-white">{label}</td>
                    <td className="py-2 pr-3">{us}</td>
                    <td className="py-2">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="The true lifetime math">
          <p>
            The number that matters isn&apos;t this season&apos;s price — it&apos;s the
            whole youth-sports career. Kids who start at 7 and play through high school
            put in <strong>8–10 seasons</strong>. A subscription gets paid again every
            single one of those years; a one-time purchase doesn&apos;t.
          </p>
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="font-semibold text-gray-900 dark:text-white">
              A typical stats-app subscription at ~$99–$180/year:
            </p>
            <ul className="mt-2 space-y-1">
              <li>3 seasons ≈ <strong>$300–$540</strong></li>
              <li>5 seasons ≈ <strong>$500–$900</strong></li>
              <li>Full career (8+ seasons) ≈ <strong>$800–$1,400+</strong></li>
            </ul>
            <p className="mt-3 font-semibold text-blue-600 dark:text-blue-400">
              Baseball Stats Tracker over the same career: $39. Total.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Subscription prices change — check GameChanger&apos;s site for current rates
              and run the math for your own timeline. Our full{" "}
              <Link href="/learn/gamechanger-pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                GameChanger pricing breakdown
              </Link>{" "}
              covers what&apos;s free and what&apos;s paid.
            </p>
          </div>
          <p className="mt-3">
            That difference is real money — it&apos;s a season of new cleats, a bat, or a
            tournament weekend. If the stats are what you actually use, paying for them
            yearly is the most expensive way to get them.
          </p>
        </Section>

        <Section title="Pick GameChanger if…">
          <ul className="list-inside list-disc space-y-1">
            <li>Your league or organization mandates it — don&apos;t fight the league.</li>
            <li>Automatic video clips of your kid&apos;s at-bats are worth a yearly fee to you.</li>
            <li>You want team chat, RSVPs, and scheduling bundled with the stats.</li>
          </ul>
        </Section>

        <Section title="Pick Baseball Stats Tracker if…">
          <ul className="list-inside list-disc space-y-1">
            <li>You want live scoring, automatic stats, spray charts, and box scores without a subscription.</li>
            <li>You&apos;re the family scorekeeper and want to share a live link grandparents can open with zero setup.</li>
            <li>You want splits a college program would envy — by opponent, pitcher, and handedness.</li>
            <li>You&apos;d rather spend the yearly difference on your kid than on software.</li>
          </ul>
          <p className="mt-3">
            You don&apos;t have to take our word for it —{" "}
            <Link href="/signup" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              score your first game free
            </Link>
            , no credit card required, and compare the experience yourself.
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
      <Link href="/learn" className="hover:underline">Learn</Link> <span aria-hidden>/</span> {label}
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
      <p className="text-2xl leading-snug font-bold text-white">One payment. Every season.</p>
      <p className="mt-2 text-gray-300">Live scoring, automatic stats, spray charts. $39 once, no subscription.</p>
      <Link href="/pricing" className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Get Instant Access — $39
      </Link>
    </div>
  );
}

function RelatedLinks() {
  return (
    <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
      <Link href="/learn/gamechanger-pricing" className="hover:underline">→ GameChanger pricing breakdown</Link>
      <Link href="/learn/gamechanger-alternatives" className="hover:underline">→ All GameChanger alternatives</Link>
      <Link href="/compare" className="hover:underline">→ Full app comparison</Link>
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
