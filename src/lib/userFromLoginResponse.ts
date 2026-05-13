import type { AuthUser } from "../context/AuthContext";

/** Map common API shapes to { email, name }; falls back to the email used on the form. */
export function userFromLoginResponse(data: unknown, fallbackEmail: string): AuthUser | null {
  if (data !== null && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const inner = (d.user ?? d.data ?? d) as Record<string, unknown>;
    const emailRaw = (typeof inner === "object" && inner?.email) || d.email || fallbackEmail;
    const email = typeof emailRaw === "string" ? emailRaw : fallbackEmail;
    if (!email) return null;
    const nameRaw =
      (typeof inner === "object" && (inner.name ?? inner.displayName)) || d.name || email.split("@")[0];
    const name = typeof nameRaw === "string" && nameRaw.trim() ? nameRaw.trim() : email.split("@")[0] || email;
    return { email, name };
  }
  if (fallbackEmail) {
    return { email: fallbackEmail, name: fallbackEmail.split("@")[0] || fallbackEmail };
  }
  return null;
}
