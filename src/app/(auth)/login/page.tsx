"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const tc = useTranslations("common");

  // Suppress the auto-redirect while we run the post-login verification check,
  // so a blocked user isn't bounced to the dashboard before we can react.
  const checking = useRef(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !checking.current) router.replace("/dashboard");
    });
    return () => unsubscribe();
  }, [router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    checking.current = true;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        router.push("/dashboard");
        return;
      }
      const { code } = await res
        .json()
        .catch(() => ({ code: undefined as string | undefined }));
      if (code === "EMAIL_NOT_VERIFIED") {
        // Re-send the verification link, then hold them out until verified.
        try {
          await sendEmailVerification(cred.user);
        } catch {
          // best-effort resend; a link was already sent at signup
        }
        await signOut(auth);
        setError(t("verifyRequired"));
      } else if (code === "DELETED") {
        await signOut(auth);
        setError(t("accountSuspended"));
      } else if (code === "NAME_REQUIRED") {
        await signOut(auth);
        setError(t("nameMissing"));
      } else if (code === "SERVER_ERROR" || res.status >= 500) {
        // Their password was right; the problem is on our side.
        await signOut(auth);
        setError(t("serverError"));
      } else {
        await signOut(auth);
        setError(t("invalidCredentials"));
      }
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      checking.current = false;
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      } else if (code === "auth/unauthorized-domain") {
        setError(t("unauthorizedDomain"));
      } else {
        setError(t("googleFailed", { code: code ?? "unknown" }));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage("");
    if (!forgotEmail) {
      setForgotSuccess(false);
      setForgotMessage(t("enterEmail"));
      return;
    }

    setForgotLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotSuccess(true);
      setForgotMessage(t("resetSent"));
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail("");
        setForgotMessage("");
      }, 3000);
    } catch {
      setForgotSuccess(false);
      setForgotMessage(t("resetError"));
    } finally {
      setForgotLoading(false);
    }
  };

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

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            id="email"
            label={t("email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex items-end justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("password")}
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t("forgot")}
            </button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("signingIn") : t("signIn")}
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
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? t("signingIn") : t("continueGoogle")}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            {t("signUp")}
          </Link>
        </p>

        <Modal
          isOpen={showForgotPassword}
          onClose={() => {
            setShowForgotPassword(false);
            setForgotEmail("");
            setForgotMessage("");
          }}
          title={t("resetTitle")}
        >
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("resetIntro")}
            </p>
            <Input
              id="forgot-email"
              label={t("email")}
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            {forgotMessage && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  forgotSuccess
                    ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {forgotMessage}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail("");
                  setForgotMessage("");
                }}
              >
                {tc("cancel")}
              </Button>
              <Button type="submit" className="flex-1" disabled={forgotLoading}>
                {forgotLoading ? t("sending") : t("sendResetLink")}
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
}
