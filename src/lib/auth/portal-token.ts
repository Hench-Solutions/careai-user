import type { AccountRole } from "@/config/auth";

import { roleForApiUserType } from "@/config/auth";
import { PORTAL_CLAIMS } from "@/config/portal-session";

type PortalTokenClaims = {
  role: AccountRole;
  /** Expiry, seconds since epoch. */
  exp: number;
};

/** Decode only — no signature check (routing). */
export function readPortalToken(
  token: string | undefined,
): PortalTokenClaims | null {
  const payloadPart = token?.split(".")[1];
  if (!payloadPart) return null;
  try {
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload: unknown = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    );
    if (typeof payload !== "object" || payload === null) return null;
    const { exp, [PORTAL_CLAIMS.userType]: userType } = payload as Record<
      string,
      unknown
    >;
    const role = roleForApiUserType(userType);
    return typeof exp === "number" && exp * 1000 > Date.now() && role ?
        { role, exp }
      : null;
  } catch {
    return null;
  }
}
