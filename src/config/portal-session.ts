export const PORTAL_TOKEN_COOKIE = "careai_portal_token";

export const PORTAL_CLAIMS = {
  userType: "UserType",
} as const;

/** Seconds when JWT `exp` cannot be read. */
export const PORTAL_COOKIE_MAX_AGE_FALLBACK_SEC = 300;

export function cookieMaxAgeFromJwt(token: string): number | undefined {
  const payloadPart = token.split(".")[1];
  if (!payloadPart) return undefined;
  try {
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload: unknown = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    );
    if (typeof payload !== "object" || payload === null) return undefined;
    const exp = (payload as Record<string, unknown>).exp;
    if (typeof exp !== "number" || !Number.isFinite(exp)) return undefined;
    return Math.max(0, Math.floor(exp - Date.now() / 1000));
  } catch {
    return undefined;
  }
}
