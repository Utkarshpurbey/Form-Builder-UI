/** Join base URL and path segments without accidental `//` from leading/trailing slashes. */
function joinUrl(base: string, ...segments: string[]): string {
  const root = base.replace(/\/+$/, "");
  const path = segments
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return path ? `${root}/${path}` : root;
}

const getCompleteHost = (endpoint: string) =>
  joinUrl(
    process.env.NEXT_PUBLIC_API_URL ?? "",
    process.env.NEXT_PUBLIC_API_PATH ?? "",
    endpoint,
  );

export const LOGIN_API = getCompleteHost("auth/login");

/** Current user; 401 if not authenticated. Caller may add HTTP Basic `Authorization`. */
export const ME_API = getCompleteHost("auth/me");
