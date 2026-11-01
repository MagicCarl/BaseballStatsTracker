import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getSoroArticles } from "@/lib/soro";

const SITE = "https://www.baseballstatstracker.com";
const URL = `${SITE}/blog`;

export const metadata: Metadata = {
  title: "Blog — Youth Baseball & Softball Scorekeeping",
  description:
    "Articles on scorekeeping, stats, and picking the right app for youth baseball and softball teams — from the team behind Baseball Stats Tracker.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Baseball Stats Tracker Blog",
    description:
      "Scorekeeping, stats, and app advice for youth baseball and softball coaches and parents.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseball Stats Tracker Blog",
    description:
      "Scorekeeping, stats, and app advice for youth baseball and softball coaches and parents.",
    images: ["/og-image.png"],
  },
};

export default async function BlogIndexPage() {
  const articles = await getSoroArticles();

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <BlogSchema articles={articles} />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span> Blog
        </nav>

        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Blog
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          Scorekeeping, stats, and honest app comparisons for youth baseball and softball
          families.
        </p>

        {articles.length === 0 ? (
          <p className="mt-10 text-gray-600 dark:text-gray-300">
            No articles right now — check back soon.
          </p>
        ) : (
          <ul className="mt-10 space-y-8">
            {articles.map((article) => (
              <li key={article.id}>
                <Link href={`/blog/${article.slug}`} className="group block">
                  <h2 className="text-2xl leading-snug font-bold text-gray-900 group-hover:underline dark:text-white">
                    {article.title}
                  </h2>
                  <time
                    dateTime={article.isoDate}
                    className="mt-1 block text-sm text-gray-500 dark:text-gray-400"
                  >
                    {article.date}
                  </time>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{article.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 rounded-2xl bg-gray-900 p-8 text-center dark:bg-gray-800">
          <p className="text-2xl leading-snug font-bold text-white">One payment. Every season.</p>
          <p className="mt-2 text-gray-300">
            Live scoring, automatic stats, spray charts. $39 once, no subscription.
          </p>
          <Link
            href="/pricing"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Get Instant Access — $39
          </Link>
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

function BlogSchema({
  articles,
}: {
  articles: { title: string; slug: string; excerpt: string; isoDate: string }[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": URL,
          name: "Baseball Stats Tracker Blog",
          url: URL,
          blogPost: articles.map((article) => ({
            "@type": "BlogPosting",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.isoDate,
            url: `${SITE}/blog/${article.slug}`,
          })),
        }),
      }}
    />
  );
}
