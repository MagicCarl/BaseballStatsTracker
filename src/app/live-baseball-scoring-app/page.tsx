import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import KeywordPage, { PageSection, proseLink } from "@/components/KeywordPage";

const URL = "https://www.baseballstatstracker.com/live-baseball-scoring-app";

export const metadata: Metadata = {
  title: "Live Baseball Scoring App for Youth Teams",
  description:
    "Score youth baseball and softball games live from your phone and send family a link to follow along, with no account needed. First game free, then $39 once.",
  keywords: [
    "live baseball scoring app",
    "live scoring app for youth baseball",
    "share baseball game live with family",
    "live softball scoring app",
    "follow youth baseball game live",
    "real time baseball box score",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Live Baseball Scoring App for Youth Teams",
    description:
      "Score from the bleachers and send family a link to follow every play, with no account needed. First game free, then $39 once.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Baseball Scoring App for Youth Teams",
    description: "Score from the bleachers and send family a link to follow every play. First game free, then $39 once.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "Can family watch the game without an account?",
    a: "Yes. Tap Share on the live scoring page and send the link. Anyone who opens it sees the live scoreboard, box score and play-by-play, with nothing to install and no account to create.",
  },
  {
    q: "How quickly do updates appear?",
    a: "Within a few seconds. Open screens check for new plays automatically, so nobody has to refresh the page.",
  },
  {
    q: "Are shared game links private?",
    a: "Each game gets its own unique link, and only people you send it to can find it. Shared game pages aren't listed on the site and aren't indexed by search engines.",
  },
  {
    q: "Does it stream video of the game?",
    a: "No. Followers get the score, box score and play-by-play, not video. If live video matters most to you, look at GameChanger.",
  },
  {
    q: "Does it work for softball?",
    a: "Yes. Live scoring and sharing work the same way for softball as they do for baseball.",
  },
];

export default function LiveBaseballScoringAppPage() {
  return (
    <KeywordPage
      url={URL}
      crumb="Live Baseball Scoring App"
      headline="A live baseball scoring app your whole family can follow"
      intro="Score the game from the bleachers on your phone, then send everyone a link. Grandparents, teammates and the parent stuck at work can follow every play as it happens, with no account and nothing to install."
      faqs={faqs}
      related={[
        { href: "/baseball-scorekeeping-app", label: "Baseball scorekeeping app" },
        { href: "/features", label: "All features" },
        { href: "/learn/gamechanger-alternatives", label: "GameChanger alternatives" },
        { href: "/pricing", label: "Our pricing" },
      ]}
    >
      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-lg dark:border-gray-700">
        <Image
          src="/screenshots/live-scoring-light.svg"
          alt="The live scoring screen: score, outs, the current batter and one-tap result buttons"
          width={800}
          height={600}
          priority
          className="h-auto w-full dark:hidden"
        />
        <Image
          src="/screenshots/live-scoring.svg"
          alt="The live scoring screen: score, outs, the current batter and one-tap result buttons"
          width={800}
          height={600}
          priority
          className="hidden h-auto w-full dark:block"
        />
      </div>

      <PageSection title="Score every play from your phone">
        <p>
          The live scoring screen shows the score, outs and current batter, with one-tap
          buttons for each result. Stats update as you go, and if you tap the wrong thing,
          you can undo the last play and carry on.
        </p>
        <p>
          It runs in your phone&apos;s browser, so there&apos;s no app store download. It needs a
          connection to save plays, but a normal cell signal is enough.
        </p>
      </PageSection>

      <PageSection title="What family sees">
        <p>Tap Share and send the link by text or group chat. Anyone who opens it gets:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>A live scoreboard</li>
          <li>The batting box score</li>
          <li>Play-by-play, with the latest play first</li>
        </ul>
        <p>Everything updates by itself within a few seconds, so nobody has to refresh.</p>
      </PageSection>

      <PageSection title="Follow along on more than one device">
        <p>
          One person scores at the field while coaches and parents watch from their own
          phones. A coach in the dugout sees the same game as a grandparent three states
          away, however many people are following.
        </p>
      </PageSection>

      <PageSection title="Live scoring without a subscription">
        <p>
          Your first game is free, including live scoring and sharing. After that, it&apos;s a
          one-time{" "}
          <Link href="/pricing" className={proseLink}>$39 payment</Link>{" "}
          for unlimited games. If you want live video or your league requires a particular
          app, go with that instead. Our{" "}
          <Link href="/learn/gamechanger-vs-baseball-stats-tracker" className={proseLink}>GameChanger comparison</Link>{" "}
          lays out the differences.
        </p>
      </PageSection>
    </KeywordPage>
  );
}
