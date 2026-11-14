import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { ApiEnvelope } from "@/lib/api/client";
import type { PortalProfile, SessionUser } from "@/lib/auth/user";

import { API_ENDPOINTS, BFF_ENDPOINTS } from "@/config/api";
import { PORTAL_TOKEN_COOKIE } from "@/config/portal-session";
import { apiBaseUrl } from "@/config/server-env";
import { toSessionUser } from "@/lib/auth/user";

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function setPortalCookie(token: string, maxAgeSeconds: number) {
  (await cookies()).set(PORTAL_TOKEN_COOKIE, token, {
    ...baseCookie,
    maxAge: maxAgeSeconds,
  });
}

export async function clearPortalCookie() {
  (await cookies()).delete(PORTAL_TOKEN_COOKIE);
}

/**
 * The signed-in user, asked of the API (`portal-me`) so a blocked or removed account is caught
 * here, not only when the token expires. The API owns the token; this app holds no key.
 *
 * Private cache: reused within a request and by the browser's router for a few minutes, never
 * stored on the server. A rejected token sends the visitor through the expiry route, which clears
 * the cookie (a render cannot) and avoids a redirect loop with the proxy.
 */
export async function getCurrentUser(): Promise<SessionUser> {
  "use cache: private";

  const token = (await cookies()).get(PORTAL_TOKEN_COOKIE)?.value;
  if (!token) redirect(BFF_ENDPOINTS.auth.expired);

  const res = await fetch(`${apiBaseUrl()}${API_ENDPOINTS.auth.portalMe}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) {
    redirect(BFF_ENDPOINTS.auth.expired);
  }
  if (!res.ok) throw new Error(`portal-me failed with ${res.status}`);

  const body = (await res.json()) as ApiEnvelope<PortalProfile>;
  const user = body.responseObj ? toSessionUser(body.responseObj) : null;
  if (!user) redirect(BFF_ENDPOINTS.auth.expired);
  return user;
}
