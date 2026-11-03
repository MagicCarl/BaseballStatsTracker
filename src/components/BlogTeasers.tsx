import Link from "next/link";
import { getSoroArticles } from "@/lib/soro";

/**
 * Home page article list, rendered on our server so the page doesn't have to run
 * Soro's script on our domain. Renders nothing if Soro can't serve the list.
 */
export default async function BlogTeasers() {
  const articles = await getSoroArticles();
  if (articles.length === 0) return null;

  return (
    <ul className="space-y-6">
      {articles.map((article) => (
        <li key={article.id}>
          <Link
            href={`/blog/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-blue-500 sm:flex-row dark:border-gray-700 dark:bg-gray-900"
          >
            {article.image && (
              // eslint-disable-next-line @next/next/no-img-element -- remote Soro CDN host, not in next/image remotePatterns
              <img
                src={article.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-40 w-full object-cover sm:h-auto sm:w-40 sm:shrink-0"
              />
            )}
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:underline dark:text-gray-100">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{article.excerpt}</p>
              <time
                dateTime={article.isoDate}
                className="mt-3 block text-xs text-gray-600 dark:text-gray-400"
              >
                {article.date}
              </time>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
