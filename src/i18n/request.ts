import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { resolveLocale } from "./detect";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const accept = (await headers()).get("accept-language") ?? "";
  const locale = resolveLocale(cookieStore.get("NEXT_LOCALE")?.value, accept);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    getMessageFallback({ key, namespace }) {
      const full = [namespace, key].filter(Boolean).join(".");
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] missing message: ${full} (locale=${locale})`);
      }
      return full;
    },
    onError() {
      // Missing-message errors are handled by getMessageFallback above.
    },
  };
});
