/**
 * Upstream CareAi.Core.Api paths (relative to CAREAI_API_URL; server-side only).
 * BaseController routes as `[controller]` — no `/v1` prefix.
 */
export const API_ENDPOINTS = {
  auth: {
    portalLogin: "/Auth/portal-login",
    patientSignup: "/Auth/patient-signup",
    portalMe: "/Auth/portal-me",
  },
  lead: {
    portalRegister: "/PortalLead/register",
    portalUploadDocuments: "/PortalLead/upload-documents",
  },
  master: {
    items: "/Master/items",
    codeSearch: "/Master/code-search",
    portalDropdown: "/PortalMaster/dropdown",
  },
} as const;

/** The web app's own same-origin routes the browser calls (they hold the token, the browser never does). */
export const BFF_ENDPOINTS = {
  auth: {
    /** Clears a rejected session cookie, then sends the visitor to the login page. */
    expired: "/api/auth/expired",
  },
  lead: {
    register: "/api/lead/register",
    uploadDocuments: "/api/lead/upload-documents",
  },
  master: {
    dropdown: "/api/master/dropdown",
    items: "/api/master/items",
    codeSearch: "/api/master/code-search",
  },
} as const;

/** Query-string names of the master-list routes (browser to this app, and this app to the API). */
export const MASTER_QUERY = {
  mode: "mode",
  itemType: "itemType",
  filterId: "filterId",
  codeType: "type",
  codeQuery: "q",
} as const;

export const MASTER_DROPDOWN_MODES = {
  source: "DrpSource",
  documentType: "ddlDocumentType",
  nationality: "ddlNationality",
  patientLocation: "ddlPatientLocation",
  provider: "ddlProvider",
  branch: "DrpBranch",
  doctor: "drpDoctor",
  guarantor: "drpGuarantor",
} as const;

export const MASTER_ITEM_TYPES = {
  gender: "Gender",
  treatmentType: "TreatmentType",
  department: "ProviderDepartment",
  paymentMode: "PaymentMode",
} as const;

/** `type` values of Master/code-search the portal may ask for. */
export const MASTER_CODE_TYPES = { icd: "ICD", cpt: "CPT" } as const;

export const MASTER_CODE_QUERY_MAX_LENGTH = 50;

/** `filterId` that limits ddlDocumentType to the documents a lead takes. */
export const MASTER_LEAD_DOCUMENTS_FILTER = "LEAD_ID";

/** Messages shown when the server gave no user-safe text. */
export const API_MESSAGES = {
  network: "Unable to reach the server. Please try again.",
  generic: "Something went wrong. Please try again.",
  badRequest: "The request was not valid.",
  signInAgain: "Please sign in again.",
  forbiddenOrigin: "Request blocked.",
  tooLarge: "The request was too large.",
  invalidMasterList: "That list is not available.",
} as const;
