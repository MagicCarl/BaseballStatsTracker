"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-client";

interface AppUser {
  isPaid: boolean;
  isAdmin: boolean;
  language: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  token: string | null;
  logout: () => Promise<void>;
  language: string;
  setLanguage: (locale: string) => Promise<void>;
  languagePending: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  appUser: null,
  loading: true,
  token: null,
  logout: async () => {},
  language: "en",
  setLanguage: async () => {},
  languagePending: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState("en");
  // True from the start of setLanguage until the server-rendered content
  // for the new locale is in. Combined manual flag (for the PATCH window)
  // + useTransition's isPending (for the router.refresh transition).
  const [langSaving, setLangSaving] = useState(false);
  const [isRefreshPending, startTransition] = useTransition();
  const languagePending = langSaving || isRefreshPending;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        // Upsert user in our database
        try {
          const verifyRes = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (verifyRes.ok) {
            const data = await verifyRes.json();
            setAppUser({
              isPaid: data.user.isPaid ?? false,
              isAdmin: data.user.isAdmin ?? false,
              language: data.user.language ?? "en",
            });
            setLanguageState(data.user.language ?? "en");
            // Track login event (fire and forget)
            fetch("/api/analytics/events", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({ eventType: "LOGIN" }),
            }).catch(() => {});
          } else {
            const body = await verifyRes.json().catch(() => ({}));
            console.error("Auth verify failed:", verifyRes.status, body);
            // Blocked (deleted / no name / unverified email): sign out so the
            // authenticated-route guard bounces them to /login. The login and
            // signup pages surface the specific reason to the user.
            if (verifyRes.status === 403) {
              await signOut(auth);
              setUser(null);
              setToken(null);
              setAppUser(null);
            }
          }
        } catch (err) {
          console.error("Auth verify error:", err);
        }
      } else {
        setToken(null);
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setToken(null);
    setAppUser(null);
  };

  const setLanguage = async (locale: string) => {
    setLangSaving(true);
    setLanguageState(locale);
    try {
      const current = auth.currentUser;
      if (current) {
        const idToken = await current.getIdToken();
        await fetch("/api/user/language", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ language: locale }),
        }).catch(() => {});
      } else {
        // Pre-auth (login/signup): persist via cookie so SSR picks it up.
        document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      }
    } finally {
      if (window.location.pathname === "/") {
        // The proxy serves "/" from a different route per language, and a soft
        // refresh can't switch routes, so the home page needs a full reload.
        window.location.reload();
      } else {
        // Hand off to React's transition: isRefreshPending stays true until
        // the new server-rendered content for this locale is in.
        startTransition(() => router.refresh());
        setLangSaving(false);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, appUser, loading, token, logout, language, setLanguage, languagePending }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
