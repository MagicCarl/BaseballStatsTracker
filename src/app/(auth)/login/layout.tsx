import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Baseball & Softball Stats Tracker",
  description:
    "Sign in to Baseball Stats Tracker to score games live, track batting stats, pitches, spray charts, and box scores for your youth baseball or softball team.",
  alternates: {
    canonical: "https://www.baseballstatstracker.com/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
