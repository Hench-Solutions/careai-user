import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { ApiEnvelope } from "@/lib/api/client";
import type { PortalProfile, SessionUser } from "@/lib/auth/user";

import { API_ENDPOINTS, BFF_ENDPOINTS } from "@/config/api";
import {
  cookieMaxAgeFromJwt,
  PORTAL_COOKIE_MAX_AGE_FALLBACK_SEC,
  PORTAL_TOKEN_COOKIE,
} from "@/config/portal-session";
import { apiBaseUrl } from "@/config/server-env";
import { toSessionUser } from "@/lib/auth/user";

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function setPortalCookie(token: string) {
  const maxAge =
    cookieMaxAgeFromJwt(token) ?? PORTAL_COOKIE_MAX_AGE_FALLBACK_SEC;
  (await cookies()).set(PORTAL_TOKEN_COOKIE, token, {
    ...baseCookie,
    maxAge,
  });
}

export async function clearPortalCookie() {
  (await cookies()).delete(PORTAL_TOKEN_COOKIE);
}

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

/** Same as `getCurrentUser`, but returns null when there is no valid session (no redirect). */
export async function getOptionalCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(PORTAL_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${apiBaseUrl()}${API_ENDPOINTS.auth.portalMe}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403 || !res.ok) return null;

    const body = (await res.json()) as ApiEnvelope<PortalProfile>;
    return body.responseObj ? toSessionUser(body.responseObj) : null;
  } catch {
    return null;
  }
}
