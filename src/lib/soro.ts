/**
 * Soro blog data access.
 *
 * Soro publishes the blog as a client-side embed script, not a JSON API. The
 * article list only exists as a `var SORO_ARTICLES = [...]` literal inside that
 * script, so we parse it out server-side; article bodies do have a real JSON
 * endpoint. Fetching both here lets /blog render real, crawlable pages instead
 * of relying on Google to execute the widget.
 *
 * Every function fails soft (empty list / null) so a Soro outage degrades the
 * blog rather than breaking the build or the homepage.
 */

import sanitizeHtml from "sanitize-html";

const SORO_TOKEN = "8d385f99-7f5f-4586-9a39-bbfdefac99ae";
const SORO_API_BASE = "https://app.trysoro.com";

export const SORO_EMBED_SRC = `${SORO_API_BASE}/api/embed/${SORO_TOKEN}`;

/** Soro content changes at most daily; an hour keeps ISR cheap and fresh enough. */
const REVALIDATE_SECONDS = 3600;

export type SoroArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Human-readable date, e.g. "July 8, 2026". */
  date: string;
  /** ISO 8601 timestamp. */
  isoDate: string;
  image: string | null;
};

/**
 * Pull the SORO_ARTICLES array literal out of the embed script.
 *
 * Scans for the matching bracket rather than regex-ing to the first `]` so that
 * a `]` inside a title or excerpt can't truncate the list.
 */
function extractArticlesLiteral(js: string): string | null {
  const markerIndex = js.indexOf("SORO_ARTICLES");
  if (markerIndex === -1) return null;

  const start = js.indexOf("[", markerIndex);
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < js.length; i++) {
    const char = js[i];

    if (escaped) {
      escaped = false;
      continue;
    }
    if (inString) {
      if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }

    if (char === '"') inString = true;
    else if (char === "[") depth++;
    else if (char === "]") {
      depth--;
      if (depth === 0) return js.slice(start, i + 1);
    }
  }

  return null;
}

export async function getSoroArticles(): Promise<SoroArticle[]> {
  try {
    const res = await fetch(SORO_EMBED_SRC, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];

    const literal = extractArticlesLiteral(await res.text());
    if (!literal) return [];

    const parsed: unknown = JSON.parse(literal);
    if (!Array.isArray(parsed)) return [];

    return (parsed as SoroArticle[]).filter(
      (article) => article?.slug && article?.title && article?.id,
    );
  } catch {
    return [];
  }
}

export async function getSoroArticle(slug: string): Promise<SoroArticle | null> {
  const articles = await getSoroArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}

/**
 * Article bodies come from a third party and render on our own domain, where
 * customers' login sessions live, so only plain article markup gets through.
 */
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "a", "img",
      "strong", "b", "em", "i", "u", "ul", "ol", "li", "blockquote", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

/** Sanitized article body as an HTML string, or null if Soro can't serve it. */
export async function getSoroArticleContent(id: string): Promise<string | null> {
  try {
    const res = await fetch(`${SORO_EMBED_SRC}/article/${id}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const data: unknown = await res.json();
    const content = (data as { content?: unknown })?.content;
    return typeof content === "string" ? sanitizeArticleHtml(content) : null;
  } catch {
    return null;
  }
}
