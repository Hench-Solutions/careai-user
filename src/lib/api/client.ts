import { API_MESSAGES } from "@/config/api";
import { API_BASE_URL } from "@/config/env";

type ApiEnvelope<T> = {
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

type RequestOptions = {
  /** Shown when the server gives no user-safe message. */
  failMessage?: string;
};

/**
 * POST JSON to the CareAI API and return the envelope's `responseObj`.
 * Only 4xx messages reach the user; 5xx text can be raw server/SQL errors.
 */
export async function apiPost<TResponse>(
  path: string,
  payload: object,
  { failMessage = API_MESSAGES.generic }: RequestOptions = {},
): Promise<TResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
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
    const message =
      res.status < 500 ?
        (body?.errorObj?.[0]?.errorMessage ??
        Object.values(body?.errors ?? {})[0]?.[0])
      : undefined;
    throw new ApiError(message ?? failMessage, res.status);
  }
  return body.responseObj;
}
