import type { AccountRole } from "@/config/auth";

import { roleForApiUserType } from "@/config/auth";
import { PORTAL_CLAIMS } from "@/config/portal-session";

export type PortalTokenClaims = {
  role: AccountRole;
  /** Expiry, seconds since epoch. */
  exp: number;
};

/**
 * Reads the role and expiry from the portal token WITHOUT verifying its signature: this app holds
 * no signing key. Use it only to route the visitor; the API validates the token on every call.
 */
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
