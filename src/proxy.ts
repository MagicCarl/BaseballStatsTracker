import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { resolveLocale } from "@/i18n/detect";

const CANONICAL_HOST = "www.baseballstatstracker.com";

/** Conservative slug shape, so `?post=` can't steer the redirect off /blog/. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export function proxy(request: NextRequest) {
  const redirect = blogDeepLinkRedirect(request);
  if (redirect) return redirect;

  const response = localizedHomeRewrite(request) ?? NextResponse.next();

  // Block indexing of any host that isn't the canonical one (apex, vercel preview URLs)
  const host = request.headers.get("host") ?? "";
  if (host && host !== CANONICAL_HOST) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Force HTTPS for two years, including subdomains, and allow preload-list
  // submission. Prevents protocol-downgrade / SSL-stripping attacks.
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME-type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy — disable unused browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com https://www.googletagmanager.com https://app.trysoro.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.google.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss://*.firebaseio.com https://www.googletagmanager.com https://www.google-analytics.com https://*.analytics.google.com https://*.google-analytics.com https://app.trysoro.com",
      "frame-src https://*.firebaseapp.com https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ")
  );

  return response;
}

/**
 * Send the Soro widget's old `/?post=<slug>` deep links to the real article page.
 *
 * Those URLs served homepage HTML and then had a second `<link rel="canonical">`
 * injected client-side by Soro's script. Two conflicting canonicals means Google
 * ignores both, which is what put them in the "Duplicate without user-selected
 * canonical" report. Articles now render at /blog/<slug>.
 *
 * Handled here rather than via next.config `redirects()` because that appends the
 * source query string to the destination (`/blog/x?post=x`), creating exactly the
 * kind of duplicate URL this is meant to remove. The proxy already runs on every
 * request for the security headers below, so this costs no extra invocation.
 */
function blogDeepLinkRedirect(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname !== "/") return null;

  const slug = request.nextUrl.searchParams.get("post");
  if (!slug || !SLUG_PATTERN.test(slug)) return null;

  const url = request.nextUrl.clone();
  url.pathname = `/blog/${slug}`;
  // Drop `post` but keep campaign params so shared tagged links stay attributable.
  url.searchParams.delete("post");

  return NextResponse.redirect(url, 308);
}

/**
 * The home page is prerendered in English so it loads instantly, even when the
 * server has been idle. Anyone who needs another language gets the same page
 * rendered per request instead. This has to happen here because the proxy runs
 * before the CDN cache.
 */
function localizedHomeRewrite(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname !== "/") return null;

  const locale = resolveLocale(
    request.cookies.get("NEXT_LOCALE")?.value,
    request.headers.get("accept-language") ?? ""
  );
  if (locale === DEFAULT_LOCALE) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/home-localized";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Run on all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
