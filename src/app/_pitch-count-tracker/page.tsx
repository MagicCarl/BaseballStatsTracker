import type { Metadata } from "next";
import Link from "next/link";
import KeywordPage, { PageSection, proseLink } from "@/components/KeywordPage";

const URL = "https://www.baseballstatstracker.com/pitch-count-tracker";

export const metadata: Metadata = {
  title: "Pitch Count Tracker: Limits & Rest Days",
  description:
    "Little League pitch limits by age and required rest days, how to keep an accurate pitch count, and what Baseball Stats Tracker does and doesn't track.",
  keywords: [
    "pitch count tracker",
    "pitch count tracker app",
    "little league pitch count rules",
    "pitch count by age",
    "pitch count rest days",
    "youth baseball pitch limits",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Pitch Count Tracker: Limits & Rest Days",
    description:
      "Little League pitch limits by age, required rest days, and how to keep an accurate count.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pitch Count Tracker: Limits & Rest Days",
    description: "Little League pitch limits by age, required rest days, and how to keep an accurate count.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "What is the pitch limit for a 12-year-old?",
    a: "In Little League Baseball's regular season, the daily limit for league ages 11-12 is 85 pitches. Other leagues and tournaments can set different limits, so check yours.",
  },
  {
    q: "How many days of rest does a pitcher need after 50 pitches?",
    a: "Under Little League's regular season rules, a pitcher aged 14 or under needs two calendar days of rest after 36-50 pitches. A 15- or 16-year-old needs one calendar day after 31-45 pitches, or two after 46-60.",
  },
  {
    q: "Can a pitcher finish the batter after reaching the limit?",
    a: "Yes, under Little League rules. The pitcher can keep pitching until the batter reaches base or is put out, or until the third out ends the half-inning.",
  },
  {
    q: "Does Baseball Stats Tracker add up a pitcher's total pitches?",
    a: "Not at the moment. It records each pitch and shows the count for each at-bat, but it doesn't total pitches by pitcher, warn you at a limit or work out rest days.",
  },
  {
    q: "Do softball pitchers have pitch limits?",
    a: "Little League Softball limits innings, not pitches. In Minors and Little League (Majors), a player can pitch up to 12 innings in a day, and pitching seven or more innings requires one calendar day of rest.",
  },
];

const dailyLimits = [
  ["6-8", "50"],
  ["9-10", "75"],
  ["11-12", "85"],
  ["13-16", "95"],
];

const restDays = [
  ["1-20", "1-30", "None"],
  ["21-35", "31-45", "1 day"],
  ["36-50", "46-60", "2 days"],
  ["51-65", "61-75", "3 days"],
  ["66 or more", "76 or more", "4 days"],
];

export default function PitchCountTrackerPage() {
  return (
    <KeywordPage
      url={URL}
      crumb="Pitch Count Tracker"
      headline="Pitch count tracker: limits, rest days and keeping an accurate count"
      intro="Pitch limits protect young arms, but they only work if someone keeps an accurate count. Here are Little League's limits and rest days, how to keep the count at the field, and exactly what our app can and can't do for you."
      faqs={faqs}
      related={[
        { href: "/baseball-scorekeeping-app", label: "Baseball scorekeeping app" },
        { href: "/free-baseball-scorecard", label: "Free printable scorecard" },
        { href: "/learn/baseball-stats-explained", label: "Baseball stats explained" },
      ]}
    >
      <PageSection title="Little League pitch limits by age">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Daily pitch limits by league age">
          <table className="mt-2 w-full text-left text-sm">
            <caption className="pb-2 text-left text-gray-500 dark:text-gray-400">
              Little League Baseball regular season, checked November 2026
            </caption>
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="py-2 pr-4 font-semibold">League age</th>
                <th className="py-2 font-semibold">Pitches per day</th>
              </tr>
            </thead>
            <tbody>
              {dailyLimits.map(([age, limit]) => (
                <tr key={age} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4">{age}</td>
                  <td className="py-2">{limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection title="Required days of rest">
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Required days of rest by pitches thrown">
          <table className="mt-2 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="py-2 pr-4 font-semibold">Pitches, age 14 and under</th>
                <th className="py-2 pr-4 font-semibold">Pitches, ages 15-16</th>
                <th className="py-2 font-semibold">Calendar days of rest</th>
              </tr>
            </thead>
            <tbody>
              {restDays.map(([younger, older, rest]) => (
                <tr key={rest} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 pr-4">{younger}</td>
                  <td className="py-2 pr-4">{older}</td>
                  <td className="py-2">{rest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>No player may pitch on three consecutive days, whatever the count.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Rules change, and travel teams, tournaments and high schools often follow different
          ones. Always check your own league&apos;s rules and{" "}
          <a href="https://www.littleleague.org/playing-rules/pitch-count/" rel="nofollow noopener" target="_blank" className={proseLink}>
            Little League&apos;s current pitch count page
          </a>
          .
        </p>
      </PageSection>

      <PageSection title="How to keep an accurate pitch count">
        <ul className="list-inside list-disc space-y-2">
          <li>Count every pitch to a batter: balls, strikes, fouls and balls in play.</li>
          <li>Give the job to one person who isn&apos;t also coaching or keeping the book, if you can.</li>
          <li>Compare counts with the other team between innings, so a mistake doesn&apos;t grow.</li>
          <li>Write down each pitcher&apos;s final count and the date, so you can work out their rest days.</li>
        </ul>
        <p>If your league names an official pitch counter, that count is the one that decides.</p>
      </PageSection>

      <PageSection title="What Baseball Stats Tracker does today">
        <p>
          We&apos;d rather tell you this up front. Baseball Stats Tracker is a scoring app with
          pitch-by-pitch tracking, not a dedicated pitch limit tool.
        </p>
        <p className="font-semibold text-gray-900 dark:text-white">What it does:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>Records each pitch when the other team is batting, with its result and location on a strike zone</li>
          <li>Shows the ball-strike count as you go</li>
          <li>Shows how many pitches each at-bat took in the game log</li>
        </ul>
        <p className="font-semibold text-gray-900 dark:text-white">What it doesn&apos;t do yet:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>Keep a running total for each pitcher</li>
          <li>Warn you when a pitcher nears a limit</li>
          <li>Work out rest days</li>
        </ul>
        <p>
          If those are what you need at the field, look at a dedicated tool. On the App Store,{" "}
          <a href="https://apps.apple.com/us/app/llbb-tracker/id6743416831" rel="nofollow noopener" target="_blank" className={proseLink}>LLBB Tracker</a>{" "}
          lists Little League limits and rest dates, and{" "}
          <a href="https://apps.apple.com/us/app/id1632819693" rel="nofollow noopener" target="_blank" className={proseLink}>Track-A-Pitch</a>{" "}
          lists rest and recovery guidelines. Prefer paper? Our{" "}
          <Link href="/free-baseball-scorecard" className={proseLink}>free printable scorecard</Link>{" "}
          has ball and strike boxes for every at-bat.
        </p>
      </PageSection>
    </KeywordPage>
  );
}
