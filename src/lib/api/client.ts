import { API_MESSAGES, BFF_ENDPOINTS } from "@/config/api";

export type ApiEnvelope<T> = {
  errorObj?: { errorCode: number; errorMessage: string }[];
  responseObj?: T | null;
  /** ASP.NET model-validation (ProblemDetails) shape. */
  errors?: Record<string, string[]>;
};

/** Thrown for any failed call; `message` is always safe to show to a user. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Only 4xx messages reach the user; 5xx text can be raw server/SQL errors. */
export function userMessageFrom(
  status: number,
  body: ApiEnvelope<unknown> | null,
  fallback: string,
): string {
  if (status >= 500) return fallback;
  return (
    body?.errorObj?.[0]?.errorMessage ??
    Object.values(body?.errors ?? {})[0]?.[0] ??
    fallback
  );
}

type RequestOptions = {
  /** Shown when the server gives no user-safe message. */
  failMessage?: string;
  /** Treat a reply without `responseObj` as success and return `{}`. */
  allowEmpty?: boolean;
};

async function request<T>(
  url: string,
  init: RequestInit,
  { failMessage = API_MESSAGES.generic, allowEmpty }: RequestOptions,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { credentials: "same-origin", ...init });
  } catch {
    throw new ApiError(API_MESSAGES.network);
  }

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (res.status === 401) {
    // The session is gone (expired or blocked): sign in again instead of showing an error.
    window.location.assign(BFF_ENDPOINTS.auth.expired);
  }
  const data = body?.responseObj ?? (allowEmpty ? ({} as T) : null);
  if (!res.ok || data === null) {
    throw new ApiError(
      userMessageFrom(res.status, body, failMessage),
      res.status,
    );
  }
  return data;
}

export function apiGet<T>(url: string, options: RequestOptions = {}) {
  return request<T>(url, { method: "GET", cache: "no-store" }, options);
}

export function apiPost<T>(
  url: string,
  payload: object,
  options: RequestOptions = {},
) {
  return request<T>(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    options,
  );
}

/** Multipart upload; the browser adds the boundary, so no content type is set. */
export function apiPostForm<T>(
  url: string,
  form: FormData,
  options: RequestOptions = {},
) {
  return request<T>(url, { method: "POST", body: form }, options);
}
