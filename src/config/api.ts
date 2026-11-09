/** API versioned prefix and per-feature endpoint paths (relative to the API base URL; server-side only). */
const API_VERSION_PREFIX = "/v1";

export const API_ENDPOINTS = {
  auth: {
    portalLogin: `${API_VERSION_PREFIX}/Auth/portal-login`,
    patientSignup: `${API_VERSION_PREFIX}/Auth/patient-signup`,
  },
} as const;

/** The web app's own same-origin routes the browser calls (they hold the token, the browser never does). */
export const BFF_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
  },
} as const;

/** Auth requests are tiny; anything larger is rejected before it is parsed. */
export const BFF_MAX_BODY_BYTES = 10_000;

/** Messages shown when the server gave no user-safe text. */
export const API_MESSAGES = {
  network: "Unable to reach the server. Please try again.",
  generic: "Something went wrong. Please try again.",
  badRequest: "The request was not valid.",
  forbiddenOrigin: "Request blocked.",
  tooLarge: "The request was too large.",
} as const;
