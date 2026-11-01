import Link from "next/link";
import { getTranslations } from "next-intl/server";

const guides = [
  { href: "/learn/gamechanger-vs-baseball-stats-tracker", label: "GameChanger vs BST" },
  { href: "/learn/gamechanger-alternatives", label: "GameChanger Alternatives" },
  { href: "/learn/gamechanger-pricing", label: "GameChanger Pricing" },
  { href: "/learn/best-baseball-stats-apps", label: "Best Baseball Stats Apps" },
  { href: "/learn/baseball-stats-explained", label: "Baseball Stats Explained" },
  { href: "/learn/how-to-keep-score-in-baseball", label: "How to Keep Score" },
  { href: "/learn/how-to-keep-score-in-softball", label: "Softball Scoring Guide" },
  { href: "/learn/baseball-spray-chart-guide", label: "Spray Chart Guide" },
  { href: "/free-baseball-scorecard", label: "Free Printable Scorecard" },
];

const CONTACT_EMAIL = "carlrandrews@me.com";

// Same profiles as the Organization sameAs list in app/layout.tsx.
const socials = [
  {
    href: "https://www.youtube.com/@mauicarlandrews",
    label: "YouTube",
    icon: <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />,
  },
  {
    href: "https://x.com/mauicarlandrews",
    label: "X",
    icon: <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />,
  },
  {
    href: "https://www.facebook.com/profile.php?id=61588582352146",
    label: "Facebook",
    icon: <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />,
  },
  {
    href: "https://www.instagram.com/mauicarl/",
    label: "Instagram",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.6" cy="6.4" r="1.3" />
      </>
    ),
  },
  {
    href: "https://www.linkedin.com/company/baseball-stats-tracker",
    label: "LinkedIn",
    icon: <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />,
  },
];

export default async function Footer() {
  const [tc, tf] = await Promise.all([
    getTranslations("marketing.common"),
    getTranslations("marketing.footer"),
  ]);

  const linkClass = "hover:text-gray-700 dark:hover:text-gray-300";

  return (
    <footer className="border-t border-gray-200 px-6 py-8 dark:border-gray-800">
      <div className="mx-auto max-w-4xl text-center text-sm text-gray-500 dark:text-gray-400">
        <nav aria-label="Site" className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link href="/" className={linkClass}>{tc("navHome")}</Link>
          <Link href="/features" className={linkClass}>{tc("navFeatures")}</Link>
          <Link href="/pricing" className={linkClass}>{tc("navPricing")}</Link>
          <Link href="/compare" className={linkClass}>{tc("navCompare")}</Link>
          <Link href="/faq" className={linkClass}>{tc("navFaq")}</Link>
          <Link href="/login" className={linkClass}>{tc("navSignIn")}</Link>
          <Link href="/signup" className={linkClass}>{tc("navSignUp")}</Link>
          <Link href="/privacy" className={linkClass}>{tf("privacy")}</Link>
        </nav>
        <nav aria-label={tf("guides")} className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link href="/learn" className={`font-medium ${linkClass}`}>{tf("guides")}</Link>
          {guides.map((g) => (
            <Link key={g.href} href={g.href} className={linkClass}>
              {g.label}
            </Link>
          ))}
        </nav>
        <p className="mt-5 flex flex-wrap justify-center gap-x-2">
          <span>{tf("contact")}</span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <nav aria-label={tf("follow")} className="mt-3 flex justify-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={s.label}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                {s.icon}
              </svg>
            </a>
          ))}
        </nav>
        <p className="mt-4">{tc("footerRights", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
