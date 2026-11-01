"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations("auth.signup");

  // Signup briefly signs the user in before we send verification and sign them
  // back out. Suppress the "already logged in → dashboard" redirect during that
  // window so the verification flow isn't interrupted.
  const justSignedUp = useRef(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !justSignedUp.current) router.replace("/dashboard");
    });
    return () => unsubscribe();
  }, [router]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t("nameRequired"));
      return;
    }

    setLoading(true);
    justSignedUp.current = true;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: trimmedName });
      await sendEmailVerification(cred.user);
      // Hold them out of the app until they click the verification link.
      await signOut(auth);
      setVerifyEmail(email);
    } catch (err: unknown) {
      justSignedUp.current = false;
      const code = (err as { code?: string })?.code;
      if (code === "auth/email-already-in-use") {
        setError(t("emailInUse"));
      } else if (code === "auth/weak-password") {
        setError(t("weakPassword"));
      } else if (code === "auth/invalid-email") {
        setError(t("invalidEmail"));
      } else {
        setError(t("createFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        // User closed popup, do nothing
      } else if (code === "auth/network-request-failed") {
        setError(t("networkError"));
      } else if (code === "auth/popup-blocked") {
        setError(t("popupBlocked"));
      } else {
        setError(t("googleFailed"));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // After signup we hold the user out until they verify their email.
  if (verifyEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <h1 className="mb-4 text-2xl leading-snug font-bold">{t("verifyTitle")}</h1>
          <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            {t("verifySent", { email: verifyEmail })}
          </div>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            {t("verifyHint")}
          </p>
          <Link href="/login" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            {t("backToSignIn")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        <h1 className="mb-8 text-center text-2xl leading-snug font-bold">
          {t("title")}
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            id="name"
            label={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="email"
            label={t("email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label={t("password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("creatingAccount") : t("createAccount")}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <span className="text-sm text-gray-500 dark:text-gray-400">{t("or")}</span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
        >
          {googleLoading ? t("signingUp") : t("continueGoogle")}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("haveAccount")}{" "}
          <Link href="/login" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            {t("signIn")}
          </Link>
        </p>

      </div>
    </div>
  );
}
