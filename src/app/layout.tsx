import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // body uses Arial (globals.css), so don't let these preloads compete with the hero image
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const monaSans = localFont({
  src: "../../public/fonts/MonaSans.woff2",
  variable: "--font-mona-sans",
  weight: "200 900",
  display: "swap",
});

export const metadata: Metadata = {
  verification: {
    google: "NbsUL_UJgedy-867VBhCthEwc74Hu5ZsIeuWOKfz5pA",
  },
  title: {
    default:
      "Baseball Stats Tracker – Youth Baseball & Softball App",
    template: "%s | Baseball Stats Tracker",
  },
  description:
    "Score youth baseball & softball games live from your phone. Auto batting stats, pitch tracking, spray charts & box scores. $39 one-time — no subscriptions.",
  keywords: [
    "baseball stats app",
    "softball stats app",
    "youth baseball stats tracker",
    "Little League stats app",
    "travel ball stats tracker",
    "baseball scorekeeping app",
    "live game scoring baseball",
    "baseball spray chart app",
    "best baseball stats app",
  ],
  authors: [{ name: "Baseball Stats Tracker" }],
  creator: "Baseball Stats Tracker",
  publisher: "Baseball Stats Tracker",
  metadataBase: new URL("https://www.baseballstatstracker.com"),
  category: "Sports",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.baseballstatstracker.com",
    siteName: "Baseball Stats Tracker",
    title: "Baseball Stats Tracker - Youth Baseball & Softball Stats Tracker",
    description:
      "Score youth baseball & softball games live from your phone. Auto stats, spray charts & box scores. $39 one-time — no subscriptions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Baseball Stats Tracker - Live scoring, spray charts, and box scores for youth baseball and softball",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseball Stats Tracker - Youth Baseball & Softball Stats Tracker",
    description:
      "Score youth baseball & softball live from your phone. Batting stats, spray charts & box scores. $39 one-time.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V9XWGQS6QV"
          strategy="lazyOnload"
        />
        <Script id="ga-config" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-V9XWGQS6QV');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Baseball Stats Tracker",
                applicationCategory: "SportsApplication",
                operatingSystem: "Web",
                mainEntityOfPage: "https://www.baseballstatstracker.com",
                description:
                  "Score youth baseball and softball games live from your phone. Automatic batting stats, pitch tracking, spray charts, and box scores for Little League, travel ball, and high school teams.",
                offers: {
                  "@type": "Offer",
                  price: "39.00",
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  priceValidUntil: "2027-12-31",
                },
                featureList: [
                  "Live game scoring from your phone",
                  "Automatic batting stats (AVG, OBP, SLG, OPS)",
                  "Pitch-by-pitch tracking",
                  "Interactive spray charts",
                  "Professional inning-by-inning box scores",
                  "Season stats and team records",
                  "Opponent pitcher and batter tracking",
                  "Real-time sync across multiple devices",
                  "Works for baseball and softball",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Baseball Stats Tracker",
                url: "https://www.baseballstatstracker.com",
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Baseball Stats Tracker",
                url: "https://www.baseballstatstracker.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.baseballstatstracker.com/logo.png",
                  width: 512,
                  height: 512,
                },
                // sameAs tells AI engines these profiles are the same entity.
                // Append new URLs here as listings go live (LinkedIn, Threads
                // still pending — see AI_VISIBILITY_PLAYBOOK.md Step 3).
                sameAs: [
                  "https://www.youtube.com/@mauicarlandrews",
                  "https://x.com/mauicarlandrews",
                  "https://www.facebook.com/profile.php?id=61588582352146",
                  "https://www.instagram.com/mauicarl/",
                  "https://www.wikidata.org/wiki/Q140411691",
                  "https://www.linkedin.com/company/baseball-stats-tracker",
                ],
              },
            ]),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${monaSans.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
