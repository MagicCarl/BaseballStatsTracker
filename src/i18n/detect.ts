import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/** A saved language choice wins; otherwise go by the browser's language. */
export function resolveLocale(cookieLocale: string | undefined, acceptLanguage: string): Locale {
  return isLocale(cookieLocale) ? cookieLocale : pickLocaleFromAcceptLanguage(acceptLanguage);
}

export function pickLocaleFromAcceptLanguage(header: string): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // Traditional Chinese: any zh-hant* tag
    if (tag.startsWith("zh-hant")) return "zh-Hant";
    const base = tag.split("-")[0];
    const match = (SUPPORTED_LOCALES as readonly string[]).find(
      (l) => l === tag || l.split("-")[0] === base
    );
    if (match && match !== "zh-Hant") return match as Locale;
  }
  return DEFAULT_LOCALE;
}
