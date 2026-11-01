import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { getSoroArticle, getSoroArticleContent, getSoroArticles } from "@/lib/soro";

const SITE = "https://www.baseballstatstracker.com";

/** Pre-render every known article; unknown slugs still render on demand via ISR. */
export async function generateStaticParams() {
  const articles = await getSoroArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getSoroArticle(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };

  const url = `${SITE}/blog/${article.slug}`;
  const image = article.image ?? "/og-image.png";

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      images: [image],
      publishedTime: article.isoDate,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [image],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getSoroArticle(slug);
  if (!article) notFound();

  const content = await getSoroArticleContent(article.id);
  const url = `${SITE}/blog/${article.slug}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <ArticleSchema article={article} url={url} />
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-5 py-10 text-gray-800 dark:text-gray-200">
        <Breadcrumb label={article.title} />

        <h1 className="text-4xl leading-snug font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          By Carl Andrews · {article.date}
        </p>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">{article.excerpt}</p>

        {article.image && (
          // eslint-disable-next-line @next/next/no-img-element -- remote Soro CDN host, not in next/image remotePatterns
          <img
            src={article.image}
            alt={article.title}
            className="mt-8 w-full rounded-2xl"
          />
        )}

        {content ? (
          // Content is Carl's own blog HTML from Soro's CMS, not user input.
          <div
            className="mt-8 leading-relaxed [&_a]:text-blue-600 [&_a]:hover:underline dark:[&_a]:text-blue-400 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_li]:mt-1 [&_ol]:mt-3 [&_ol]:list-inside [&_ol]:list-decimal [&_p]:mt-3 [&_strong]:font-semibold [&_ul]:mt-3 [&_ul]:list-inside [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="mt-8 text-gray-600 dark:text-gray-300">
            This article couldn&apos;t be loaded right now. Please try again shortly.
          </p>
        )}

        <CtaCard />

        <div className="mt-10 text-sm">
          <Link href="/blog" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            ← All articles
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

function Breadcrumb({ label }: { label: string }) {
  return (
    <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <Link href="/" className="hover:underline">Home</Link> <span aria-hidden>/</span>{" "}
      <Link href="/blog" className="hover:underline">Blog</Link> <span aria-hidden>/</span> {label}
    </nav>
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

function ArticleSchema({
  article,
  url,
}: {
  article: { title: string; excerpt: string; isoDate: string; image: string | null };
  url: string;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.isoDate,
            dateModified: article.isoDate,
            image: article.image ?? undefined,
            author: { "@type": "Person", name: "Carl Andrews" },
            publisher: {
              "@type": "Organization",
              name: "Baseball Stats Tracker",
              logo: { "@type": "ImageObject", url: `${SITE}/logo.png`, width: 512, height: 512 },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
              { "@type": "ListItem", position: 3, name: article.title, item: url },
            ],
          },
        ]),
      }}
    />
  );
}
