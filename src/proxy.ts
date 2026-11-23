import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import {
  dashboardPathForRole,
  LOGIN_PARAMS,
  LOGIN_REASONS,
  portalBaseForRole,
} from "@/config/auth";
import { PORTAL_TOKEN_COOKIE } from "@/config/portal-session";
import { ROUTES } from "@/config/routes";
import { readPortalToken } from "@/lib/auth/portal-token";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const cookie = request.cookies.get(PORTAL_TOKEN_COOKIE)?.value;
  const claims = readPortalToken(cookie);
  const redirectTo = (url: string | URL) =>
    NextResponse.redirect(new URL(url, request.url));

  if (pathname === ROUTES.login) {
    return claims ?
        redirectTo(dashboardPathForRole(claims.role))
      : NextResponse.next();
  }

  if (!claims) {
    const login = new URL(ROUTES.login, request.url);
    login.searchParams.set(LOGIN_PARAMS.next, pathname + search);
    if (cookie)
      login.searchParams.set(LOGIN_PARAMS.reason, LOGIN_REASONS.expired);
    return redirectTo(login);
  }

  const ownBase = portalBaseForRole(claims.role);
  return pathname === ownBase || pathname.startsWith(`${ownBase}/`) ?
      NextResponse.next()
    : redirectTo(dashboardPathForRole(claims.role));
}

// Next reads this statically, so the paths are literals (keep in step with ROUTES).
export const config = {
  matcher: ["/login", "/agent/:path*", "/patient/:path*"],
};
