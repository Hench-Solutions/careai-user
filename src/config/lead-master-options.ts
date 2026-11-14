/**
 * Hardcoded Item_Cd / master codes matching staff Lead registration masters.
 * Prefer PortalMaster/dropdown or Master/items (AllowAnonymous) when the BFF can reach the API;
 * these are the offline / first-paint fallbacks used by the agent wizard.
 *
 * Sources:
 * - Gender / TreatmentType: MT_MasterItem via GET /Master/items (AllowAnonymous)
 * - PaymentMode: Payment_Mode_Master codes used by MasterDAL drpGuarantor cascade
 * - DocumentType: legacy MT_MasterItem DocumentType (DT0001..) — staff UI actually saves
 *   MT_Document Doc_Cd; portal should prefer PortalMaster?mode=ddlDocumentType when live
 */

export const GENDER_OPTIONS = [
  { value: "", label: "--Select--" },
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other" },
  { value: "N", label: "Prefer not to say" },
] as const;

/** TreatmentType Item_Cd from MT_MasterItem (same set as prior portal hardcodes). */
export const TREATMENT_TYPE_OPTIONS = [
  { value: "", label: "--Select--" },
  { value: "TT0001", label: "IPD" },
  { value: "TT0002", label: "OPD" },
  { value: "TT0003", label: "Day Care" },
  { value: "TT0005", label: "Emergency" },
  { value: "TT0006", label: "Package" },
] as const;

/**
 * Payment_Mode_Cd — admin "Payment Mode".
 * Confirmed in CareAi_Api MasterDAL.GetDropdownAsync "drpGuarantor" filter branches.
 */
export const PAYMENT_MODE_OPTIONS = [
  { value: "", label: "--Select--" },
  { value: "PM0001", label: "Self Pay" },
  { value: "PM0002", label: "GOP - Insurance" },
  { value: "PM0003", label: "Bank Finance" },
  { value: "PM0004", label: "Government Finance" },
] as const;

/**
 * Self Pay → Self_Pay_Master (admin "Payment Type" / API Guarantor).
 * Codes must match Self_Pay_Master.Pmt_Mode_Cd. Live list: PortalMaster/dropdown?mode=drpGuarantor&filterId=PM0001.
 * Fallback labels only — empty until cascade loads; do not invent SP codes.
 */
export const SELF_PAY_GUARANTOR_FALLBACK: { value: string; label: string }[] = [
  { value: "", label: "--Select--" },
];

/**
 * Legacy DocumentType Item_Cd (MT_MasterItem). Prefer MT_Document Doc_Cd from
 * PortalMaster ddlDocumentType when available.
 */
export const DOCUMENT_TYPE_LEGACY_OPTIONS = [
  { value: "", label: "--Select--" },
  { value: "DT0001", label: "Passport" },
  { value: "DT0002", label: "Residence Permit / Resident ID" },
  { value: "DT0003", label: "Permanent Resident Card" },
  { value: "DT0004", label: "Driver's License" },
] as const;

/** Common calling code default (admin screenshot uses +91). */
export const DEFAULT_CALLING_CD = "91";
