import type { CareaiSelectOption } from "@/components/careai/select-options";

export const LEAD_TYPES = {
  normal: "Normal",
  priority: "Priority",
  emergency: "Emergency",
} as const;

/** Every text field of a lead the form sends; the form inputs carry these exact names. */
export const LEAD_FIELDS = [
  "FirstName",
  "MiddleName",
  "LastName",
  "EmailId",
  "Dob",
  "Gender",
  "Nationality",
  "CallingCd",
  "MobileNo",
  "LeadType",
  "PatientLocation",
  "DocumentType",
  "DocumentNo",
  "Source",
  "TreatmentType",
  "Department",
  "ProviderCd",
  "BranchCd",
  "DoctorCd",
  "CaseNote",
  "Diagnosis",
  "Treatment",
  "IcdCode",
  "IcdDesc",
  "CptCode",
  "CptDesc",
  "PaymentMode",
  "Guarantor",
] as const;

export type LeadField = (typeof LEAD_FIELDS)[number];

export const LEAD_UPLOAD_FIELDS = {
  claimNo: "claimNo",
  memberId: "memberId",
  idDocument: "idDocument",
  medicalReports: "medicalReports",
} as const;

export const LEAD_JSON_MAX_BYTES = 50_000;
export const LEAD_UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

export const LEAD_MESSAGES = {
  firstNameRequired: "First name is required.",
  firstNameRequiredToContinue: "First name is required to continue.",
  treatmentTypeRequired: "Please select a treatment type.",
  claimAndMemberRequired: "Claim number and member ID are required.",
  submitFailed: "Could not submit the case. Please try again.",
  uploadFailed: "Could not upload documents.",
  savedButUploadFailed:
    "Case saved, but document upload failed. You can attach files later from case details.",
} as const;

export const BLANK_OPTION: CareaiSelectOption = {
  value: "",
  label: "--Select--",
};

export const DEFAULT_CALLING_CD = "91";

/** The portal API has no list for payment modes (the staff app reads them from another table). */
export const PAYMENT_MODE_OPTIONS: CareaiSelectOption[] = [
  BLANK_OPTION,
  { value: "PM0001", label: "Self Pay" },
  { value: "PM0002", label: "GOP - Insurance" },
  { value: "PM0003", label: "Bank Finance" },
  { value: "PM0004", label: "Government Finance" },
];
