import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import type { ApiEnvelope } from "@/lib/api/client";

import { API_MESSAGES, MASTER_QUERY } from "@/config/api";
import { PORTAL_TOKEN_COOKIE } from "@/config/portal-session";
import { apiBaseUrl, TRUST_FORWARDED_FOR } from "@/config/server-env";
import { userMessageFrom } from "@/lib/api/client";

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
  let sameSite = false;
  try {
    sameSite = !!origin && !!host && new URL(origin).host === host;
  } catch {
    sameSite = false;
  }
  return sameSite ? null : (
      jsonEnvelope(null, 403, API_MESSAGES.forbiddenOrigin)
    );
}

/** Value of `key` when it is a string, else "" (the API reports what is missing). */
export function stringField(
  body: Record<string, unknown>,
  key: string,
): string {
  const value = body[key];
  return typeof value === "string" ? value : "";
}

type ApiCall<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; response: NextResponse };

function fail(status: number, message: string): ApiCall<never> {
  return { ok: false, message, response: jsonEnvelope(null, status, message) };
}

type ApiRequest = {
  method: "GET" | "POST";
  path: string;
  body?: BodyInit;
  /** Sets the JSON content type; leave unset for FormData so fetch adds the multipart boundary. */
  json?: boolean;
  token?: string;
  failMessage: string;
  /** Accept an upload-style reply that has no `responseObj` and use the whole body as the data. */
  bodyIsData?: boolean;
  /** What a 204 (the API found no rows) means to the caller; without it a 204 is a failure. */
  noRows?: unknown;
};

/**
 * One call to the .NET API. The visitor's IP is passed on so the API's rate limits apply per
 * person; 5xx text is never shown to the visitor, and a reply without data counts as a failure.
 */
async function callApi<T>(
  source: Pick<NextRequest, "headers">,
  {
    method,
    path,
    body,
    json,
    token,
    failMessage,
    bodyIsData,
    noRows,
  }: ApiRequest,
): Promise<ApiCall<T>> {
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  // The last entry is the one our own trusted proxy appended; earlier ones come from the visitor.
  const clientIp = source.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim();
  if (TRUST_FORWARDED_FOR && clientIp) headers["X-Forwarded-For"] = clientIp;

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl()}${path}`, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return fail(502, API_MESSAGES.network);
  }

  if (res.status === 204 && noRows !== undefined) {
    return { ok: true, data: noRows as T };
  }

  const envelope = (await res
    .json()
    .catch(() => null)) as ApiEnvelope<T> | null;
  const data = envelope?.responseObj ?? (bodyIsData ? envelope : null);
  if (!res.ok || data === null || data === undefined) {
    const status = res.status >= 500 || res.ok ? 502 : res.status;
    return fail(status, userMessageFrom(res.status, envelope, failMessage));
  }
  return { ok: true, data: data as T };
}

export function postToApi<T>(
  request: Pick<NextRequest, "headers">,
  path: string,
  payload: object,
  failMessage: string,
): Promise<ApiCall<T>> {
  return callApi<T>(request, {
    method: "POST",
    path,
    body: JSON.stringify(payload),
    json: true,
    failMessage,
  });
}

async function withPortalToken<T>(
  request: NextRequest,
  call: (token: string) => Promise<ApiCall<T>>,
): Promise<ApiCall<T>> {
  const token = request.cookies.get(PORTAL_TOKEN_COOKIE)?.value;
  return token ? call(token) : fail(401, API_MESSAGES.signInAgain);
}

export function postToApiWithPortalToken<T>(
  request: NextRequest,
  path: string,
  payload: object,
  failMessage: string,
): Promise<ApiCall<T>> {
  return withPortalToken(request, (token) =>
    callApi<T>(request, {
      method: "POST",
      path,
      body: JSON.stringify(payload),
      json: true,
      token,
      failMessage,
    }),
  );
}

function getToApiWithPortalToken<T>(
  request: NextRequest,
  pathWithQuery: string,
  failMessage: string,
): Promise<ApiCall<T>> {
  return withPortalToken(request, (token) =>
    callApi<T>(request, {
      method: "GET",
      path: pathWithQuery,
      token,
      failMessage,
      noRows: [],
    }),
  );
}

export function postFormToApiWithPortalToken<T>(
  request: NextRequest,
  path: string,
  form: FormData,
  failMessage: string,
): Promise<ApiCall<T>> {
  return withPortalToken(request, (token) =>
    callApi<T>(request, {
      method: "POST",
      path,
      body: form,
      token,
      failMessage,
      bodyIsData: true,
    }),
  );
}

/** A file from the API (a document), passed through to the browser; a failure is a plain status. */
export async function streamFromApiWithPortalToken(
  request: NextRequest,
  pathWithQuery: string,
): Promise<Response> {
  const token = request.cookies.get(PORTAL_TOKEN_COOKIE)?.value;
  if (!token) return new Response(null, { status: 401 });
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl()}${pathWithQuery}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return new Response(null, { status: 502 });
  }
  if (!res.ok || !res.body) {
    return new Response(null, { status: res.status === 404 ? 404 : 502 });
  }
  return new Response(res.body, {
    headers: {
      "Content-Type":
        res.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

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

type MasterRow = { value: string; text: string };

/** Browser may reuse master list responses; data is not user-specific (query identifies the list only). */
const MASTER_LIST_CACHE_CONTROL =
  "private, max-age=300, stale-while-revalidate=120";

function jsonMasterList(rows: MasterRow[]): NextResponse {
  const res = jsonEnvelope(rows);
  res.headers.set("Cache-Control", MASTER_LIST_CACHE_CONTROL);
  return res;
}

/**
 * Forwards one master-list request to the API, but only for the values the portal is allowed to
 * ask for. `param` is the query name that carries the choice (`mode` or `itemType`).
 */
export async function proxyMasterList(
  request: NextRequest,
  config: {
    param: string;
    allowed: readonly string[];
    apiPath: string;
  },
): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const choice = searchParams.get(config.param)?.trim() ?? "";
  if (!config.allowed.includes(choice)) {
    return jsonEnvelope(null, 400, API_MESSAGES.invalidMasterList);
  }

  const query = new URLSearchParams({ [config.param]: choice });
  const filterId = searchParams.get(MASTER_QUERY.filterId)?.trim();
  if (filterId) query.set(MASTER_QUERY.filterId, filterId);

  const result = await getToApiWithPortalToken<MasterRow[]>(
    request,
    `${config.apiPath}?${query}`,
    API_MESSAGES.generic,
  );
  return result.ok ? jsonMasterList(result.data) : result.response;
}

type CodeRow = { cd: string; nm: string };

/** ICD / CPT lookup for the case form's code pickers; replies in the same shape as the master lists. */
export async function proxyCodeSearch(
  request: NextRequest,
  config: { allowed: readonly string[]; apiPath: string; maxLength: number },
): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get(MASTER_QUERY.codeType)?.trim() ?? "";
  const term = searchParams.get(MASTER_QUERY.codeQuery)?.trim() ?? "";
  if (!config.allowed.includes(type) || term.length > config.maxLength) {
    return jsonEnvelope(null, 400, API_MESSAGES.invalidMasterList);
  }
  if (!term) return jsonEnvelope([]);

  const query = new URLSearchParams({
    [MASTER_QUERY.codeType]: type,
    [MASTER_QUERY.codeQuery]: term,
  });
  const result = await getToApiWithPortalToken<CodeRow[]>(
    request,
    `${config.apiPath}?${query}`,
    API_MESSAGES.generic,
  );
  if (!result.ok) return result.response;
  return jsonEnvelope(
    result.data.map((row) => ({ value: row.cd, text: row.nm })),
  );
}
