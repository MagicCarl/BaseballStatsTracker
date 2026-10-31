import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy | Baseball Stats Tracker",
  description:
    "Privacy policy for BaseballStatsTracker.com — the baseball and softball stats tracker app for youth, Little League, and travel ball teams.",
  alternates: {
    canonical: "https://www.baseballstatstracker.com/privacy",
  },
};

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("marketing.privacy");

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-gray-950">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; {t("backHome")}
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {t("subtitle")}
        </p>
        <div className="mt-8 space-y-8 text-gray-700 dark:text-gray-300">
          {(["collect","use","share","retain","security","kids","contact"] as const).map((key) => (
            <div key={key}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t(`${key}H2`)}
              </h2>
              <p className="mt-2">{t(`${key}P`)}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
