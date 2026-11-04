import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Free Baseball & Softball Stats Tracker",
  description:
    "Create a free account on Baseball Stats Tracker. Score baseball and softball games live, track batting stats (AVG, OBP, SLG, OPS), pitches, and spray charts for your youth team.",
  alternates: {
    canonical: "https://www.baseballstatstracker.com/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
