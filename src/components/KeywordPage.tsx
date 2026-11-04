import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const proseLink =
  "text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300";

interface KeywordPageProps {
  url: string;
  crumb: string;
  headline: string;
  intro: string;
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
  children: React.ReactNode;
}

// Shared layout for the pages aimed at one app search, like "live baseball scoring app".
export default function KeywordPage({ url, crumb, headline, intro, faqs, related, children }: KeywordPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.baseballstatstracker.com" },
                { "@type": "ListItem", position: 2, name: crumb, item: url },
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
          <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">Baseball Stats Tracker</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/features" className="text-gray-600 hover:underline dark:text-gray-300">Features</Link>
            <Link href="/pricing" className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700">Get Started</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span> {crumb}
        </nav>
        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          {headline}
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">{intro}</p>

        {children}

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
          <p className="text-2xl leading-snug font-bold text-white">Score your next game for free.</p>
          <p className="mt-2 text-gray-300">Your first game is free. After that, it&apos;s $39 once for unlimited games, with no subscription.</p>
          <Link href="/signup" className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Try It Free — Score Your First Game
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
          {related.map((r) => (
            <Link key={r.href} href={r.href} className="hover:underline">→ {r.label}</Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function PageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl leading-snug font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}
