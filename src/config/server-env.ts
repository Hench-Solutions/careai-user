/** Server-only settings (no NEXT_PUBLIC_ prefix, so they never reach the browser bundle). */
const DEFAULT_API_BASE_URL = "http://localhost:5244";

export const API_BASE_URL = (
  process.env.CAREAI_API_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

/**
 * Set to "true" only when the app runs behind a platform proxy that appends the visitor's IP
 * to X-Forwarded-For. Otherwise visitors could send any value to dodge the API's rate limits.
 */
export const TRUST_FORWARDED_FOR = process.env.TRUST_FORWARDED_FOR === "true";

/** Shared with the API's AppSettings:PortalJwtSecret; used to verify the portal token. */
export const PORTAL_JWT_SECRET = process.env.PORTAL_JWT_SECRET ?? "";
