import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/faq";

export const metadata: Metadata = {
  title: "FAQ — Baseball Stats Tracker: Pricing, Live Sharing, Stats & Devices",
  description:
    "Every question answered before you buy: the one-time $39 price, the free first game, sharing live games with family (no account needed), pitch tracking, stat formulas, softball support, and what happens to your data.",
  keywords: [
    "baseball stats tracker faq",
    "baseball stats app questions",
    "baseball scoring app one time payment",
    "share baseball game live with family",
    "baseball stats app free trial",
    "youth baseball stats app help",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Baseball Stats Tracker FAQ",
    description:
      "Pricing, live game sharing, pitch tracking, stat formulas, softball, and data ownership — every question answered.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseball Stats Tracker FAQ",
    description:
      "Pricing, live game sharing, pitch tracking, stat formulas, softball, and data ownership — every question answered.",
    images: ["/og-image.png"],
  },
};

type Faq = { q: string; a: string; more?: React.ReactNode };

const pricingFaqs: Faq[] = [
  {
    q: "Is Baseball Stats Tracker really a one-time payment?",
    a: "Yes. $39 once covers everything — unlimited teams, seasons, and games, with lifetime access. There are no monthly fees, no per-team charges, no premium tiers, and no in-app purchases. Every feature is included.",
  },
  {
    q: "Can I try it before paying?",
    a: "Yes. Create a free account and fully score your first game — live scoring, automatic stats, and spray charts included — with no credit card required. The first game is a real, complete trial of the product. After that, the one-time $39 purchase unlocks unlimited games.",
  },
  {
    q: "How do I pay, and how quickly is my account activated?",
    a: "Payment is processed securely through Stripe. Your account is activated automatically the moment your payment completes — no waiting and no manual steps. No credit card information is stored on our servers.",
  },
  {
    q: "How does the price compare to subscription apps like GameChanger?",
    a: "Most stats apps bill every year, so families pay again each season. Baseball Stats Tracker is $39 once — over a multi-season youth career, that difference typically adds up to hundreds of dollars.",
    more: (
      <>
        See the full breakdown in our{" "}
        <Link href="/learn/gamechanger-vs-baseball-stats-tracker" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          GameChanger vs Baseball Stats Tracker comparison
        </Link>
        .
      </>
    ),
  },
];

const deviceFaqs: Faq[] = [
  {
    q: "What devices does it work on?",
    a: "Any device with a web browser — iPhone, Android, iPad, laptop, or desktop. There is nothing to install and no app store download. Open baseballstatstracker.com in a browser and you are ready to score.",
  },
  {
    q: "Do I need an internet connection at the field?",
    a: "Yes. Baseball Stats Tracker is a web app, and it needs a connection to save plays and keep shared viewers in sync. A normal cellular signal is enough — the scoring pages are lightweight and sync every few seconds.",
  },
  {
    q: "How long does setup take before a game?",
    a: "A few minutes. Create your team, add players (name, jersey number, batting and throwing hand, position), optionally create a season, then schedule the game with the opponent, date, and home/away. Do it the night before so on game day you just open the game and score.",
  },
  {
    q: "Is it available in languages other than English?",
    a: "Yes. The app is available in English, Spanish, Japanese, Korean, and Traditional Chinese, and you can switch languages in Settings.",
  },
];

const scoringFaqs: Faq[] = [
  {
    q: "How does live scoring work?",
    a: "You tap the result of each at-bat — single, double, walk, strikeout, groundout, and so on — and the app updates the score, outs, and inning automatically. Three outs end the half-inning on their own, double plays count two outs, and the scoreboard follows along.",
  },
  {
    q: "What if I make a mistake while scoring?",
    a: "Tap Undo Last to remove the most recent at-bat — it reverts the score, outs, and inning as needed. You can also expand any entry in the game log to update stolen bases or caught stealing after you have already moved on to the next batter.",
  },
  {
    q: "Can it track pitch-by-pitch?",
    a: "Yes, optionally. When the opposing team is batting, you can record each pitch — called strikes, swinging strikes, fouls, balls, and location — before logging the at-bat result. That builds a pitch-by-pitch record and running pitch counts for your own pitchers.",
  },
  {
    q: "Does it track my pitchers' stats?",
    a: "Yes. The app records pitching appearances with outs recorded, hits allowed, runs, earned runs, walks, strikeouts, home runs allowed, pitch count, hit batters, and wild pitches.",
  },
  {
    q: "Can I track the opposing team too?",
    a: "Yes. You can add opposing pitchers, so every one of your team's at-bats is linked to the pitcher your player faced, and add opposing batters — the app rotates through their lineup just like yours.",
  },
  {
    q: "Does it work for softball?",
    a: "Yes, identically. Scoring, stats, spray charts, and live sharing all work the same for softball as for baseball.",
    more: (
      <>
        New to keeping score? Start with our{" "}
        <Link href="/learn/how-to-keep-score-in-softball" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          softball scoring guide
        </Link>
        .
      </>
    ),
  },
];

const sharingFaqs: Faq[] = [
  {
    q: "Can grandparents and family watch the game live without an account?",
    a: "Yes. Tap Share on the live scoring page and send the link. Anyone who opens it sees the live scoreboard, box score, and play-by-play, updating automatically every few seconds — with no account and nothing to install.",
  },
  {
    q: "Does the shared link stop working when the game ends?",
    a: "No. The link keeps working after the game, so family can check the final score and box score later.",
  },
  {
    q: "Are shared game links private?",
    a: "Each game gets its own unique link, and only people you send it to can find it. Shared game pages are not listed anywhere on the site and are not indexed by search engines.",
  },
  {
    q: "Can more than one person follow the same game at once?",
    a: "Yes. One person scores at the field while any number of others — coaches, parents, the team group chat — watch live from their own devices. Everything syncs automatically every few seconds.",
  },
];

const statsFaqs: Faq[] = [
  {
    q: "What stats does it calculate?",
    a: "Batting: games, at-bats, hits, doubles, triples, home runs, RBI, walks, strikeouts, stolen bases, AVG, OBP, SLG, and OPS — all calculated automatically from your scoring using standard MLB formulas. Pitching stats are tracked per appearance.",
    more: (
      <>
        Not sure what OPS or OBP actually mean? Our{" "}
        <Link href="/learn/baseball-stats-explained" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          baseball stats explained guide
        </Link>{" "}
        covers every stat in plain English.
      </>
    ),
  },
  {
    q: "How does it calculate on-base percentage (OBP)?",
    a: "With the standard MLB formula: (H + BB + HBP + CI) ÷ (AB + BB + HBP + SF + CI). That correctly accounts for hit-by-pitches, sacrifice flies, and catcher's interference — details that hand-kept scorebooks often miss.",
  },
  {
    q: "What is a spray chart, and do I get one?",
    a: "A spray chart is a diamond diagram showing where each batted ball went. When you record a ball in play, you tap the spot where it landed or was fielded; the app builds per-game and season spray charts, color-coded by result — singles, doubles, triples, home runs, and outs.",
    more: (
      <>
        See examples in the{" "}
        <Link href="/learn/baseball-spray-chart-guide" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          spray chart guide
        </Link>
        .
      </>
    ),
  },
  {
    q: "Can I filter stats — like how my players hit against lefties?",
    a: "Yes. The Stats Search page filters by team, opponent, opposing pitcher, pitcher handedness, and date range — so you can see how a player hits against lefties vs. righties, or how the team did against a specific opponent.",
  },
  {
    q: "Is there a box score for each game?",
    a: "Yes. Every game has a box score you can view during or after the game, and it is included on the public share page family sees.",
  },
];

const dataFaqs: Faq[] = [
  {
    q: "Can I track multiple teams?",
    a: "Yes — unlimited teams, seasons, and games on one account, at any level: Little League, travel, recreational, high school, or college. Coach three teams across two age groups? One account covers everything.",
  },
  {
    q: "What happens to my data if I stop using the app?",
    a: "It stays yours. There is no subscription to lapse, so your games and stats do not disappear — past seasons remain viewable whenever you come back.",
  },
  {
    q: "Can I delete my data?",
    a: "Yes. You can delete individual seasons, and each team page has a Delete All Games option (with a confirmation step) that permanently removes a team's games and stats — useful for clearing test data or starting fresh.",
  },
];

const sections: { title: string; faqs: Faq[] }[] = [
  { title: "Pricing and payment", faqs: pricingFaqs },
  { title: "Getting started and devices", faqs: deviceFaqs },
  { title: "Live scoring", faqs: scoringFaqs },
  { title: "Sharing games with family", faqs: sharingFaqs },
  { title: "Stats and charts", faqs: statsFaqs },
  { title: "Teams, seasons, and your data", faqs: dataFaqs },
];

const allFaqs = sections.flatMap((s) => s.faqs);

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: allFaqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.baseballstatstracker.com" },
                { "@type": "ListItem", position: 2, name: "FAQ", item: URL },
              ],
            },
          ]),
        }}
      />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span> FAQ
        </nav>
        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          Everything people ask before (and after) buying Baseball Stats Tracker — the
          one-time price, sharing games live with family, what gets tracked, and what
          happens to your data. If your question isn&apos;t here,{" "}
          <Link href="/signup" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            create a free account
          </Link>{" "}
          and see the answer for yourself: your first game is a full, free trial.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mt-12">
            <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">{section.title}</h2>
            <div className="mt-4 space-y-6">
              {section.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{f.q}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{f.a}</p>
                  {f.more ? (
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{f.more}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 rounded-2xl bg-gray-900 p-8 text-center dark:bg-gray-800">
          <p className="text-2xl leading-snug font-bold text-white">Still deciding? Score a game first.</p>
          <p className="mt-2 text-gray-300">
            Your first game is completely free — live scoring, automatic stats, and spray charts. No credit card.
          </p>
          <Link
            href="/signup"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Try It Free — Score Your First Game
          </Link>
          <p className="mt-3 text-sm text-gray-400">
            Then $39 once for unlimited games.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
          <Link href="/features" className="hover:underline">→ All features</Link>
          <Link href="/pricing" className="hover:underline">→ Pricing</Link>
          <Link href="/compare" className="hover:underline">→ App comparison</Link>
          <Link href="/learn" className="hover:underline">→ Guides</Link>
        </div>
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
