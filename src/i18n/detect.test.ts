import { describe, it, expect } from "vitest";
import { pickLocaleFromAcceptLanguage, resolveLocale } from "./detect";

describe("resolveLocale", () => {
  it("prefers a valid cookie over the browser language", () => {
    expect(resolveLocale("ko", "es-MX,es;q=0.9")).toBe("ko");
  });
  it("lets an English cookie override a non-English browser", () => {
    expect(resolveLocale("en", "ja")).toBe("en");
  });
  it("ignores an unsupported cookie value", () => {
    expect(resolveLocale("xx", "es-MX")).toBe("es");
  });
  it("uses the browser language when there is no cookie", () => {
    expect(resolveLocale(undefined, "ja")).toBe("ja");
  });
  it("falls back to the default with no cookie or header", () => {
    expect(resolveLocale(undefined, "")).toBe("en");
  });
});

describe("pickLocaleFromAcceptLanguage", () => {
  it("matches an exact supported locale", () => {
    expect(pickLocaleFromAcceptLanguage("es-MX,es;q=0.9")).toBe("es");
  });
  it("matches Traditional Chinese", () => {
    expect(pickLocaleFromAcceptLanguage("zh-Hant-TW,zh;q=0.8")).toBe("zh-Hant");
  });
  it("falls back to default when nothing matches", () => {
    expect(pickLocaleFromAcceptLanguage("fr-FR,de;q=0.7")).toBe("en");
  });
  it("falls back to default on empty header", () => {
    expect(pickLocaleFromAcceptLanguage("")).toBe("en");
  });
  it("respects quality-value ordering", () => {
    expect(pickLocaleFromAcceptLanguage("ko;q=0.4,ja;q=0.9")).toBe("ja");
  });
});
