/**
 * Upstream CareAi.Core.Api paths (relative to CAREAI_API_URL; server-side only).
 * BaseController routes as `[controller]` — no `/v1` prefix.
 */
export const API_ENDPOINTS = {
  auth: {
    portalLogin: "/Auth/portal-login",
    patientSignup: "/Auth/patient-signup",
  },
  lead: {
    portalRegister: "/PortalLead/register",
    portalUploadDocuments: "/PortalLead/upload-documents",
  },
  master: {
    items: "/Master/items",
    portalDropdown: "/PortalMaster/dropdown",
  },
} as const;

/** The web app's own same-origin routes the browser calls (they hold the token, the browser never does). */
export const BFF_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
  },
  lead: {
    register: "/api/lead/register",
    uploadDocuments: "/api/lead/upload-documents",
  },
  master: {
    dropdown: "/api/master/dropdown",
  },
} as const;

/** Auth JSON body cap. */
export const BFF_MAX_BODY_BYTES = 10_000;
/** Lead registration JSON body cap (no file bodies). */
export const BFF_LEAD_MAX_BODY_BYTES = 50_000;

/** Messages shown when the server gave no user-safe text. */
export const API_MESSAGES = {
  network: "Unable to reach the server. Please try again.",
  generic: "Something went wrong. Please try again.",
  badRequest: "The request was not valid.",
  forbiddenOrigin: "Request blocked.",
  tooLarge: "The request was too large.",
} as const;
