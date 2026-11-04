import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import KeywordPage, { PageSection, proseLink } from "@/components/KeywordPage";

const URL = "https://www.baseballstatstracker.com/baseball-scorekeeping-app";

export const metadata: Metadata = {
  title: "Baseball Scorekeeping App for Youth Teams",
  description:
    "Keep score from your phone and let the app do the math. Box scores, batting stats and spray charts build as you tap. First game free, then $39 once.",
  keywords: [
    "baseball scorekeeping app",
    "baseball score keeping app",
    "baseball scorebook app",
    "softball scorekeeping app",
    "little league scorekeeping app",
    "digital baseball scorebook",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Baseball Scorekeeping App for Youth Teams",
    description:
      "Tap each at-bat on your phone. Box scores, batting stats and spray charts build themselves. First game free, then $39 once.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseball Scorekeeping App for Youth Teams",
    description: "Tap each at-bat on your phone and let the app do the math. First game free, then $39 once.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "Do I need to know scorekeeping notation to use it?",
    a: "No. You tap what happened, such as a single, a walk or a strikeout, and the app records it. You don't need to know symbols like 6-3 or the backwards K to get accurate stats.",
  },
  {
    q: "Does it work on iPhone and Android?",
    a: "Yes. Baseball Stats Tracker is a web app, so it runs in the browser on iPhone, Android, iPad, laptop or desktop. There's nothing to download from an app store, and you can add it to your phone's home screen.",
  },
  {
    q: "Does it work for softball?",
    a: "Yes. Scoring, stats, spray charts and live sharing work the same way for softball as they do for baseball.",
  },
  {
    q: "Does it work without a signal?",
    a: "No. It needs an internet connection to save plays. A normal cell signal is enough, but if your field has no service, a paper scorecard is the safer choice.",
  },
  {
    q: "How much does it cost?",
    a: "Your first game is free. After that, it's a one-time $39 payment for unlimited games, with no subscription.",
  },
];

const tableRows = [
  ["Batting averages", "Worked out by hand", "Calculated after every at-bat"],
  ["Box score", "Copied out after the game", "Built automatically"],
  ["Spray charts", "Not practical", "Tap where the ball went"],
  ["Fixing a mistake", "Eraser", "Undo the last play"],
  ["Season totals", "Add up every game yourself", "Updated automatically"],
  ["No cell signal", "Works anywhere", "Needs a connection"],
];

export default function BaseballScorekeepingAppPage() {
  return (
    <KeywordPage
      url={URL}
      crumb="Baseball Scorekeeping App"
      headline="A baseball scorekeeping app that does the math for you"
      intro="Baseball Stats Tracker turns your phone into a scorebook. Tap what happened on each at-bat, and your box score, batting stats and spray charts build themselves. It works for youth baseball and softball, with no scorekeeping experience needed."
      faqs={faqs}
      related={[
        { href: "/live-baseball-scoring-app", label: "Live scoring for family" },
        { href: "/learn/how-to-keep-score-in-baseball", label: "How to keep score" },
        { href: "/free-baseball-scorecard", label: "Free printable scorecard" },
        { href: "/compare", label: "Compare apps" },
      ]}
    >
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-lg dark:border-gray-700">
        <Image
          src="/screenshots/live-scoring-light.svg"
          alt="The scorekeeping screen: score, outs, the current batter and one-tap result buttons"
          width={800}
          height={600}
          priority
          className="h-auto w-full dark:hidden"
        />
        <Image
          src="/screenshots/live-scoring.svg"
          alt="The scorekeeping screen: score, outs, the current batter and one-tap result buttons"
          width={800}
          height={600}
          priority
          className="hidden h-auto w-full dark:block"
        />
      </div>

      <PageSection title="How keeping score works">
        <ol className="list-inside list-decimal space-y-2">
          <li>Add your team and players.</li>
          <li>Create the game and set your lineup.</li>
          <li>Tap the result of each at-bat. The app moves on to the next batter.</li>
          <li>Tap the diamond to mark where the ball went, which builds your spray charts.</li>
          <li>Open the box score whenever you want it, during or after the game.</li>
        </ol>
      </PageSection>

      <PageSection title="What you get from every game">
        <ul className="list-inside list-disc space-y-2">
          <li>An inning-by-inning box score</li>
          <li>Batting stats for each player, including AVG, OBP, SLG and OPS, using standard MLB formulas</li>
          <li>Spray charts that show where each hitter puts the ball</li>
          <li>Season totals across all your games, which you can export as a CSV file</li>
          <li>Stat searches by opponent, opposing pitcher, pitcher handedness and date</li>
        </ul>
        <p>
          New to these numbers? Our guide to{" "}
          <Link href="/learn/baseball-stats-explained" className={proseLink}>baseball stats</Link>{" "}
          explains what each one means.
        </p>
      </PageSection>

      <PageSection title="Paper scorebook or scorekeeping app?">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Paper scorebook compared with the app">
          <table className="mt-2 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="py-2 pr-4 font-semibold">&nbsp;</th>
                <th className="py-2 pr-4 font-semibold">Paper scorebook</th>
                <th className="py-2 font-semibold">Baseball Stats Tracker</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(([row, paper, app]) => (
                <tr key={row} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4 font-medium">{row}</td>
                  <td className="py-2 pr-4">{paper}</td>
                  <td className="py-2">{app}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          If paper suits you better, our{" "}
          <Link href="/free-baseball-scorecard" className={proseLink}>free printable scorecard</Link>{" "}
          is yours to use, with no email required.
        </p>
      </PageSection>

      <PageSection title="When another app is the better choice">
        <p>
          If your league requires GameChanger, or you want live video, use GameChanger.
          Baseball Stats Tracker doesn&apos;t stream video. It&apos;s built for families and coaches who
          want clean stats without a yearly bill. See our{" "}
          <Link href="/learn/gamechanger-vs-baseball-stats-tracker" className={proseLink}>GameChanger comparison</Link>{" "}
          for the details.
        </p>
      </PageSection>
    </KeywordPage>
  );
}
