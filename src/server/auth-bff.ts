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
  options?: { bearerToken?: string },
): Promise<ApiCall<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options?.bearerToken) {
    headers.Authorization = `Bearer ${options.bearerToken}`;
  }
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

function portalBearer(request: NextRequest): string | null {
  return request.cookies.get(PORTAL_TOKEN_COOKIE)?.value ?? null;
}

/** postToApi with portal httpOnly cookie as Bearer. */
export async function postToApiWithPortalToken<T>(
  request: NextRequest,
  path: string,
  payload: object,
  failMessage: string,
): Promise<ApiCall<T>> {
  const token = portalBearer(request);
  if (!token) {
    return {
      ok: false,
      response: jsonEnvelope(null, 401, "Please sign in again."),
    };
  }
  return postToApi<T>(request, path, payload, failMessage, {
    bearerToken: token,
  });
}

/** GET CareAi API with portal Bearer. */
export async function getToApiWithPortalToken<T>(
  request: NextRequest,
  pathWithQuery: string,
  failMessage: string,
): Promise<ApiCall<T>> {
  const token = portalBearer(request);
  if (!token) {
    return {
      ok: false,
      response: jsonEnvelope(null, 401, "Please sign in again."),
    };
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  const clientIp = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim();
  if (TRUST_FORWARDED_FOR && clientIp) headers["X-Forwarded-For"] = clientIp;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${pathWithQuery}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      response: jsonEnvelope(null, 502, API_MESSAGES.network),
    };
  }

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (
    !res.ok ||
    body?.responseObj === undefined ||
    body?.responseObj === null
  ) {
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

/** Forward multipart FormData with portal Bearer (fetch sets multipart boundary). */
export async function postFormToApiWithPortalToken<T>(
  request: NextRequest,
  path: string,
  form: FormData,
  failMessage: string,
): Promise<ApiCall<T>> {
  const token = portalBearer(request);
  if (!token) {
    return {
      ok: false,
      response: jsonEnvelope(null, 401, "Please sign in again."),
    };
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
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
      body: form,
      cache: "no-store",
    });
  } catch {
    return {
      ok: false,
      response: jsonEnvelope(null, 502, API_MESSAGES.network),
    };
  }

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok) {
    const status = res.status >= 500 ? 502 : res.status;
    return {
      ok: false,
      response: jsonEnvelope(
        null,
        status,
        userMessageFrom(res.status, body, failMessage),
      ),
    };
  }

  // Prefer GenericResponse.responseObj; else treat JSON body as data.
  const data =
    (
      body &&
      typeof body === "object" &&
      "responseObj" in body &&
      body.responseObj != null
    ) ?
      body.responseObj
    : (body as unknown as T);
  return { ok: true, data };
}

/** readJsonObject with a caller-chosen size cap. */
export async function readJsonObjectLimited(
  request: NextRequest,
  maxBytes: number,
): Promise<Record<string, unknown> | null> {
  try {
    const text = await request.text();
    if (text.length > maxBytes) return null;
    const body: unknown = JSON.parse(text);
    return typeof body === "object" && body !== null && !Array.isArray(body) ?
        (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
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
