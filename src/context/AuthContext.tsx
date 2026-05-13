"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { userFromLoginResponse } from "../lib/userFromLoginResponse";
import { ME_API } from "../utils/apiPath";

export type AuthUser = {
  email: string;
  name: string;
};

const STORAGE_KEY = "formvity_session_user";
const ME_CREDS_KEY = "formvity_session_me_creds";

export type MeCredentials = {
  loginId: string;
  password: string;
};

/** HTTP Basic: base64(UTF-8 `loginId:password`). */
function basicAuthorizationHeader(loginId: string, password: string): string {
  const bytes = new TextEncoder().encode(`${loginId}:${password}`);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return `Basic ${btoa(binary)}`;
}

function readMeCredentials(): MeCredentials | null {
  try {
    const raw = sessionStorage.getItem(ME_CREDS_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as { loginId?: string; password?: string };
    if (typeof o.loginId === "string" && typeof o.password === "string")
      return { loginId: o.loginId, password: o.password };
  } catch {
    /* ignore */
  }
  return null;
}

/** Routes where we do not call `GET /me` (marketing, auth, templates). */
function isPublicPath(pathname: string): boolean {
  const path = pathname.split("?")[0] || "/";
  if (
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/home" ||
    path === "/templates"
  )
    return true;
  return false;
}

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  /** Pass `meCreds` on login so `GET auth/me` can send HTTP Basic `Authorization`. */
  setUser: (user: AuthUser | null, meCreds?: MeCredentials | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.email) setUserState(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setUser = useCallback((next: AuthUser | null, meCreds?: MeCredentials | null) => {
    setUserState(next);
    try {
      if (next) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        if (meCreds !== undefined) {
          if (meCreds) sessionStorage.setItem(ME_CREDS_KEY, JSON.stringify(meCreds));
          else sessionStorage.removeItem(ME_CREDS_KEY);
        }
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(ME_CREDS_KEY);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    if (!ready || isPublicPath(pathname)) return;

    const ac = new AbortController();
    (async () => {
      try {
        const creds = readMeCredentials();
        const headers: Record<string, string> = {};
        if (creds) headers.Authorization = basicAuthorizationHeader(creds.loginId, creds.password);

        const res = await fetch(ME_API, {
          method: "GET",
          credentials: "include",
          headers,
          signal: ac.signal,
        });
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) return;
        const data: unknown = await res.json();
        const next = userFromLoginResponse(data, "");
        if (next) setUser(next);
      } catch {
        if (ac.signal.aborted) return;
        /* offline / CORS — keep existing client state */
      }
    })();

    return () => ac.abort();
  }, [ready, pathname, logout, setUser]);

  const value = useMemo(
    () => ({
      user,
      ready,
      setUser,
      logout,
    }),
    [user, ready, setUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
