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
    portalUploadDocument: "/PortalLead/upload-document",
    portalUpdate: "/PortalLead/update",
    portalSearch: "/PortalLead/search",
    portalDocument: "/PortalLead/document",
    portalLead: (claimNo: string) =>
      `/PortalLead/${encodeURIComponent(claimNo)}`,
  },
  master: {
    items: "/Master/items",
    codeSearch: "/Master/code-search",
    portalDropdown: "/PortalMaster/dropdown",
  },
} as const;

export const BFF_ENDPOINTS = {
  auth: {
    expired: "/api/auth/expired",
  },
  lead: {
    register: "/api/lead/register",
    uploadDocument: "/api/lead/upload-document",
    update: "/api/lead/update",
    document: "/api/lead/document",
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

/** Link that opens one uploaded document of a case (served by this app's own route). */
export function leadDocumentUrl(claimNo: string, fileName: string): string {
  return `${BFF_ENDPOINTS.lead.document}?${new URLSearchParams({ claimNo, fileName })}`;
}
