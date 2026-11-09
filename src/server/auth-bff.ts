import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import type { ApiEnvelope } from "@/lib/api/client";

import { API_MESSAGES, BFF_MAX_BODY_BYTES } from "@/config/api";
import { PORTAL_TOKEN_COOKIE } from "@/config/portal-session";
import { API_BASE_URL, TRUST_FORWARDED_FOR } from "@/config/server-env";
import { userMessageFrom } from "@/lib/api/client";

const isProd = process.env.NODE_ENV === "production";

/** The server-side envelope the browser-side `apiPost` already understands. */
export function jsonEnvelope<T>(
  responseObj: T | null,
  status = 200,
  errorMessage = "",
): NextResponse {
  return NextResponse.json(
    {
      errorObj: [{ errorCode: status === 200 ? 0 : status, errorMessage }],
      responseObj,
    },
    { status },
  );
}

/** Blocks cross-site form posts: a browser always sends Origin on POST, and it must be this site. */
export function rejectForeignOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  try {
    if (origin && host && new URL(origin).host === host) return null;
  } catch {
    // fall through to rejection
  }
  return jsonEnvelope(null, 403, API_MESSAGES.forbiddenOrigin);
}

export async function readJsonObject(
  request: NextRequest,
): Promise<Record<string, unknown> | null> {
  try {
    const text = await request.text();
    if (text.length > BFF_MAX_BODY_BYTES) return null;
    const body: unknown = JSON.parse(text);
    return typeof body === "object" && body !== null && !Array.isArray(body) ?
        (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Value of `key` when it is a string, else "" (the API reports what is missing). */
export function stringField(
  body: Record<string, unknown>,
  key: string,
): string {
  const value = body[key];
  return typeof value === "string" ? value : "";
}

type ApiCall<T> = { ok: true; data: T } | { ok: false; response: NextResponse };

/** POSTs to the .NET API, passing the visitor's IP on so the API's rate limits apply per person. */
export async function postToApi<T>(
  request: NextRequest,
  path: string,
  payload: object,
  failMessage: string,
): Promise<ApiCall<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  // The last entry is the one our own trusted proxy appended; earlier ones come from the visitor.
  const clientIp = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim();
  if (TRUST_FORWARDED_FOR && clientIp) headers["X-Forwarded-For"] = clientIp;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      response: jsonEnvelope(null, 502, API_MESSAGES.network),
    };
  }

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !body?.responseObj) {
    const status = res.status >= 500 || res.ok ? 502 : res.status;
    return {
      ok: false,
      response: jsonEnvelope(
        null,
        status,
        userMessageFrom(res.status, body, failMessage),
      ),
    };
  }
  return { ok: true, data: body.responseObj };
}

export function withTokenCookie(
  response: NextResponse,
  token: string,
  maxAgeSeconds: number,
): NextResponse {
  response.cookies.set(PORTAL_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: maxAgeSeconds,
  });
  return response;
}

export function withoutTokenCookie(response: NextResponse): NextResponse {
  response.cookies.set(PORTAL_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: 0,
  });
  return response;
}
