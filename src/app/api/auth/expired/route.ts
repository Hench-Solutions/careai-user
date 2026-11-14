import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { LOGIN_PARAMS, LOGIN_REASONS } from "@/config/auth";
import { PORTAL_TOKEN_COOKIE } from "@/config/portal-session";
import { ROUTES } from "@/config/routes";

/** Drops a session cookie the API rejected and sends the visitor to sign in again. */
export function GET(request: NextRequest) {
  const login = new URL(ROUTES.login, request.url);
  login.searchParams.set(LOGIN_PARAMS.reason, LOGIN_REASONS.expired);
  const response = NextResponse.redirect(login);
  response.cookies.delete(PORTAL_TOKEN_COOKIE);
  return response;
}
