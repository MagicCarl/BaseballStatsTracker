import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const URL = "https://www.baseballstatstracker.com/free-baseball-scorecard";

export const metadata: Metadata = {
  title: "Free Printable Baseball Scorecard (PDF) | Baseball Stats Tracker",
  description:
    "Download a free printable baseball & softball scorecard PDF — 10 player rows, 9 innings, pitch-count boxes, and a full symbol key. No email required.",
  keywords: [
    "free printable baseball scorecard",
    "baseball scorecard PDF",
    "printable baseball score sheet",
    "softball scorecard printable",
    "baseball scorebook template",
    "free baseball score sheet PDF",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Free Printable Baseball Scorecard (PDF)",
    description:
      "A clean, print-ready baseball & softball scorecard — 10 player rows, 9 innings, pitch counts, and a symbol key. Free, no email required.",
    images: ["/scorecard-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Printable Baseball Scorecard (PDF)",
    description:
      "A clean, print-ready baseball & softball scorecard. Free, no email required.",
    images: ["/scorecard-preview.png"],
  },
};

const faqs = [
  {
    q: "Is this scorecard really free?",
    a: "Yes — download the PDF and print as many copies as you want. No email address, no signup, no watermark across the grid. It's our way of being useful to the youth baseball community (and if you ever get tired of the pencil, our app is here).",
  },
  {
    q: "Does it work for softball?",
    a: "Yes. The grid, symbols, and position numbers are identical for baseball and softball. Softball games are usually 7 innings, so you'll simply leave the last two columns empty.",
  },
  {
    q: "How do I fill out a baseball scorecard?",
    a: "Write each batter's result symbol (1B, BB, 6-3, K) in their box for the inning, darken the diamond as they advance around the bases, and circle the out number when a batter or runner is retired. Our free scoring guide walks through every symbol step by step.",
  },
  {
    q: "Is there an easier way than paper?",
    a: "Paper works, but you carry a clipboard, do the stat math by hand, and hope the book survives the season. Baseball Stats Tracker replaces it: tap each at-bat on your phone and the box score, season stats, and spray charts build themselves. One-time $39, no subscription.",
  },
];

const included = [
  "10 player rows × 9 innings — enough for extended youth lineups",
  "A base-path diamond in every cell for tracking runners",
  "Ball & strike count boxes for every at-bat",
  "AB / H / R / RBI / BB totals columns and runs-hits-per-inning rows",
  "Full symbol key printed at the bottom — no memorizing required",
  "Two pages: one for your team, one for the opponent",
];

export default function FreeScorecardPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <PageSchema />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span>{" "}
          Free Scorecard
        </nav>
        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Free printable baseball scorecard
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          A clean, print-ready scorecard for baseball and softball — designed for parents
          and coaches scoring from the bleachers. Free PDF, no email required, print as
          many as you need.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-lg dark:border-gray-700">
          <Image
            src="/scorecard-preview.png"
            alt="Free printable baseball and softball scorecard PDF with 10 player rows, 9 innings, base-path diamonds, and pitch count boxes"
            width={1320}
            height={1020}
            className="h-auto w-full bg-white"
            priority
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <a
            href="/baseball-scorecard.pdf"
            download="baseball-scorecard.pdf"
            className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            Download the free scorecard (PDF)
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Letter size, landscape · 2 pages · no email required
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">What&apos;s on it</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 leading-relaxed">
            {included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">New to scorekeeping?</h2>
          <p className="mt-3 leading-relaxed">
            If the symbols are new to you, our guides walk through everything on this card
            step by step —{" "}
            <Link href="/learn/how-to-keep-score-in-baseball" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              how to keep score in baseball
            </Link>{" "}
            and{" "}
            <Link href="/learn/how-to-keep-score-in-softball" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              the softball scoring guide
            </Link>
            , from position numbers to the backwards K.
          </p>
        </section>

        <div className="mt-12 rounded-2xl bg-gray-900 p-8 text-center dark:bg-gray-800">
          <p className="text-2xl leading-snug font-bold text-white">
            Tired of the clipboard and the pencil that breaks in the 3rd inning?
          </p>
          <p className="mt-2 text-gray-300">
            Score the same game from your phone in 60 seconds — automatic stats, box
            scores, and spray charts. Your first game is free.
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

        <h2 className="mt-12 text-2xl leading-snug font-bold text-gray-900 dark:text-white">Frequently asked questions</h2>
        <div className="mt-4 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-gray-900 dark:text-white">{f.q}</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
          <Link href="/learn/how-to-keep-score-in-baseball" className="hover:underline">→ How to keep score in baseball</Link>
          <Link href="/learn/how-to-keep-score-in-softball" className="hover:underline">→ Softball scoring guide</Link>
          <Link href="/compare" className="hover:underline">→ Compare stats apps</Link>
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

function PageSchema() {
  const json = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Free Printable Baseball Scorecard (PDF)",
      url: URL,
      description:
        "Free printable baseball and softball scorecard PDF with 10 player rows, 9 innings, pitch-count boxes, and a symbol key.",
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
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
