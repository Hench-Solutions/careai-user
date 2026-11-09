import { API_MESSAGES } from "@/config/api";

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

type PostOptions = {
  /** Shown when the server gives no user-safe message. */
  failMessage?: string;
};

/** POST JSON to `url` and return the envelope's `responseObj`. */
export async function apiPost<TResponse>(
  url: string,
  payload: object,
  { failMessage = API_MESSAGES.generic }: PostOptions = {},
): Promise<TResponse> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(API_MESSAGES.network);
  }

  const body = (await res
    .json()
    .catch(() => null)) as ApiEnvelope<TResponse> | null;
  if (!res.ok || !body?.responseObj) {
    throw new ApiError(
      userMessageFrom(res.status, body, failMessage),
      res.status,
    );
  }
  return body.responseObj;
}
