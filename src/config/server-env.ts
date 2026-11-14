/** Server-only settings (no NEXT_PUBLIC_ prefix, so they never reach the browser bundle). */
const DEV_API_BASE_URL = "http://localhost:5244";

/**
 * The .NET API's address. Read when a call is made, not at import, so a build without it still
 * works; in production a missing value fails loudly instead of quietly pointing at localhost.
 */
export function apiBaseUrl(): string {
  const url = process.env.CAREAI_API_URL;
  if (!url && process.env.NODE_ENV === "production") {
    throw new Error("CAREAI_API_URL is not set.");
  }
  return (url ?? DEV_API_BASE_URL).replace(/\/$/, "");
}

/**
 * Set to "true" only when the app runs behind a platform proxy that appends the visitor's IP
 * to X-Forwarded-For. Otherwise visitors could send any value to dodge the API's rate limits.
 */
export const TRUST_FORWARDED_FOR = process.env.TRUST_FORWARDED_FOR === "true";
