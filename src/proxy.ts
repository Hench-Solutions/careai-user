import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { dashboardPathForRole } from "@/config/auth";
import { PORTAL_TOKEN_COOKIE } from "@/config/portal-session";
import { ROUTES } from "@/config/routes";
import { PORTAL_JWT_SECRET } from "@/config/server-env";
import { verifyPortalToken } from "@/lib/auth/portal-token";

/**
 * Cookie gate for the portals: only a valid, unexpired portal token opens /agent and /patient,
 * and each portal only opens for its own user type. The API re-checks the token on every call.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const claims = await verifyPortalToken(
    request.cookies.get(PORTAL_TOKEN_COOKIE)?.value,
    PORTAL_JWT_SECRET,
  );
  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, request.url));

  if (pathname === ROUTES.login) {
    return claims ?
        redirectTo(dashboardPathForRole(claims.role))
      : NextResponse.next();
  }
  if (!claims) return redirectTo(ROUTES.login);

  const ownBase =
    claims.role === "patient" ? ROUTES.patient.base : ROUTES.agent.base;
  return pathname === ownBase || pathname.startsWith(`${ownBase}/`) ?
      NextResponse.next()
    : redirectTo(dashboardPathForRole(claims.role));
}

// Next reads this statically, so the paths are literals (keep in step with ROUTES).
export const config = {
  matcher: ["/login", "/agent/:path*", "/patient/:path*"],
};
