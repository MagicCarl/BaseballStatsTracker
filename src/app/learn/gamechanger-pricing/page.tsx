import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/learn/gamechanger-pricing";
const PUBLISHED = "2026-07-01";
const MODIFIED = "2026-10-16";

export const metadata: Metadata = {
  title: "GameChanger Pricing in 2026: What It Actually Costs",
  description:
    "A plain-English breakdown of GameChanger's pricing in 2026 — what's free, what's paid, who gets billed, and how the yearly cost compares to a $39 one-time app.",
  keywords: [
    "GameChanger pricing",
    "GameChanger cost",
    "how much is GameChanger",
    "is GameChanger free",
    "GameChanger subscription cost",
    "GameChanger alternative cost",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "article",
    url: URL,
    title: "GameChanger Pricing in 2026: What You'll Actually Pay",
    description:
      "What's free, what's paid, and how GameChanger's yearly cost compares to a one-time $39 app.",
    images: ["/og-image.png"],
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
  },
  twitter: {
    card: "summary_large_image",
    title: "GameChanger Pricing in 2026: What It Actually Costs",
    description: "What's free, what's paid, and how it compares to a one-time $39 app.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "Is GameChanger free?",
    a: "GameChanger has a free tier that covers basic scorekeeping and live game updates. The deeper features most parents actually want — full season stats, advanced insights, and video tools — sit behind a paid plan. So it's 'free to start,' but not free for everything.",
  },
  {
    q: "How much does GameChanger cost?",
    a: "As of October 2026, GameChanger's official pricing is: Plus at $9.99/month or $39.99/year, Premium at $14.99/month or $99.99/year, and the Premium Family Plan (up to 4 accounts) at $24.99/month or $179.99/year. All paid plans are subscriptions, so the cost repeats every year your child plays. Prices change, so confirm on GameChanger's site before buying.",
  },
  {
    q: "Who pays for GameChanger — the team or the parent?",
    a: "It depends on the plan. Some costs are carried by the team or organization, while individual premium features are paid by parents. Families are often surprised to find the stats they want are on a personal paid plan rather than covered by the team.",
  },
  {
    q: "Is there a cheaper alternative to GameChanger?",
    a: "Yes. If you mainly want live scoring, automatic stats, and spray charts without a yearly bill, Baseball Stats Tracker is a one-time $39 purchase with no subscription. See our full comparison for how the two stack up.",
  },
];

export default function GameChangerPricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <ArticleSchema
        headline="GameChanger Pricing in 2026: What You'll Actually Pay"
        crumb="GameChanger Pricing"
        url={URL}
        published={PUBLISHED}
        modified={MODIFIED}
        faqs={faqs}
      />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <Breadcrumb label="GameChanger Pricing" />
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          GameChanger pricing in 2026: what you&apos;ll actually pay
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">By Carl Andrews · Updated October 2026</p>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          GameChanger is the default for a lot of youth teams — but the pricing catches
          parents off guard when the free tier stops right where the good stats begin.
          Here&apos;s the honest breakdown of what&apos;s free, what&apos;s paid, who gets
          billed, and what it adds up to across a few seasons.
        </p>

        <Section title="What GameChanger includes for free">
          <p>
            The free tier handles the basics: you can score a game, follow live updates, and
            share the gamestream with family. For a lot of casual teams, that&apos;s enough to
            get through a season — and it&apos;s genuinely useful.
          </p>
        </Section>

        <Section title="What's behind the paid plan">
          <p>
            The features most stats-minded parents actually want — full season stats,
            advanced hitting and pitching breakdowns, and the video tools — are part of a paid
            plan billed on a recurring basis. The important part is the model:{" "}
            <strong>it recurs</strong>.
          </p>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Comparison table">
            <table className="mt-2 w-full text-left text-sm">
              <caption className="pb-2 text-left text-gray-500 dark:text-gray-400">
                GameChanger paid plans, from GameChanger&apos;s official pricing pages as of October 2026
              </caption>
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="py-2 pr-4 font-semibold">Plan</th>
                  <th className="py-2 pr-4 font-semibold">Monthly</th>
                  <th className="py-2 pr-4 font-semibold">Yearly</th>
                  <th className="py-2 font-semibold">5 seasons (yearly billing)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4">Plus</td>
                  <td className="py-2 pr-4">$9.99</td>
                  <td className="py-2 pr-4">$39.99</td>
                  <td className="py-2">~$200</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4">Premium</td>
                  <td className="py-2 pr-4">$14.99</td>
                  <td className="py-2 pr-4">$99.99</td>
                  <td className="py-2">~$500</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4">Premium Family (4 accounts)</td>
                  <td className="py-2 pr-4">$24.99</td>
                  <td className="py-2 pr-4">$179.99</td>
                  <td className="py-2">~$900</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold">Baseball Stats Tracker</td>
                  <td className="py-2 pr-4">—</td>
                  <td className="py-2 pr-4">—</td>
                  <td className="py-2 font-semibold">$39 once</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Prices change — confirm current rates on{" "}
            <a href="https://gc.com/pricing" rel="nofollow noopener" target="_blank" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              GameChanger&apos;s pricing page
            </a>{" "}
            before you buy.
          </p>
        </Section>

        <Section title="The real math over a youth-sports career">
          <p>
            A recurring plan can look small in April and still add up a lot by the time your
            kid has played several seasons across several years. A subscription that feels
            minor per season quietly becomes hundreds of dollars over a childhood in the game.
            That&apos;s the number worth thinking about — not the monthly or yearly sticker,
            but the total across every season you&apos;ll play.
          </p>
        </Section>

        <Section title="When GameChanger is worth it">
          <p>
            If your league standardizes on it, or you want its video and team-wide adoption,
            GameChanger earns its cost — it&apos;s a mature, polished platform. Use what your
            team mandates.
          </p>
        </Section>

        <Section title="When a one-time app makes more sense">
          <p>
            If the choice is yours and you mostly want clean stats, spray charts, and a live
            box score — without paying every year — a one-time purchase wins the long-run
            math. That&apos;s exactly why{" "}
            <Link href="/features" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Baseball Stats Tracker
            </Link>{" "}
            is a single{" "}
            <Link href="/pricing" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              $39 payment
            </Link>{" "}
            with no subscription. See the full{" "}
            <Link href="/compare" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              side-by-side comparison
            </Link>{" "}
            or our deeper look at{" "}
            <Link href="/learn/gamechanger-alternatives" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              GameChanger alternatives
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
      <span>Learn</span> <span aria-hidden>/</span> {label}
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
      <p className="text-2xl font-bold text-white">Pay once. Keep scoring.</p>
      <p className="mt-2 text-gray-300">$39 one-time, no subscription. Score your first game in 60 seconds.</p>
      <Link href="/pricing" className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Get Instant Access — $39
      </Link>
    </div>
  );
}

function RelatedLinks() {
  return (
    <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
      <Link href="/learn/gamechanger-vs-baseball-stats-tracker" className="hover:underline">→ GameChanger vs Baseball Stats Tracker</Link>
      <Link href="/learn/gamechanger-alternatives" className="hover:underline">→ GameChanger alternatives</Link>
      <Link href="/compare" className="hover:underline">→ Compare apps</Link>
      <Link href="/pricing" className="hover:underline">→ Our pricing</Link>
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
