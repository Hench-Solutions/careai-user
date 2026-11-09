/** API versioned prefix and per-feature endpoint paths (relative to API_BASE_URL). */
const API_VERSION_PREFIX = "/v1";

export const API_ENDPOINTS = {
  auth: {
    portalLogin: `${API_VERSION_PREFIX}/Auth/portal-login`,
    patientSignup: `${API_VERSION_PREFIX}/Auth/patient-signup`,
  },
} as const;

/** Messages the API client shows when the server gave no user-safe text. */
export const API_MESSAGES = {
  network: "Unable to reach the server. Please try again.",
  generic: "Something went wrong. Please try again.",
} as const;
