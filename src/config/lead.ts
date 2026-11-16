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

/** Fields the agent must fill, with the label shown to them and the wizard step they sit on. */
export const LEAD_REQUIRED_FIELDS = [
  { field: "FirstName", label: "First Name", step: 1 },
  { field: "Gender", label: "Gender", step: 1 },
  { field: "CallingCd", label: "Calling Code", step: 1 },
  { field: "PatientLocation", label: "Patient Location", step: 1 },
  { field: "DocumentType", label: "Document Type", step: 1 },
  { field: "DocumentNo", label: "ID Number", step: 1 },
  { field: "TreatmentType", label: "Treatment Type", step: 2 },
  { field: "PaymentMode", label: "Payment Mode", step: 3 },
] as const satisfies readonly {
  field: LeadField;
  label: string;
  step: 1 | 2 | 3;
}[];

export const LEAD_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const LEAD_CALLING_CODE_PATTERN = /^\+\d{1,4}(-\d{1,4})?$/;
export const LEAD_PHONE_MAX_DIGITS = 10;

export const LEAD_SOURCE_AGENT_LABEL = "Agents";

/** Same limits the API enforces on an upload; checked early so a bad file is caught before saving. */
export const LEAD_UPLOAD_MAX_FILE_MB = 10;
export const LEAD_UPLOAD_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
] as const;

export const LEAD_MESSAGES = {
  required: (label: string) => `${label} is required`,
  emailInvalid: "Email Address is not valid",
  callingCodeInvalid: "Calling Code must look like +91",
  phoneInvalid: `Phone Number must be numbers only, up to ${LEAD_PHONE_MAX_DIGITS} digits`,
  fileTooLarge: (name: string) =>
    `${name} is larger than ${LEAD_UPLOAD_MAX_FILE_MB} MB`,
  fileTypeNotAllowed: (name: string) =>
    `${name} must be a ${LEAD_UPLOAD_EXTENSIONS.join(", ")} file`,
  claimAndMemberRequired: "Claim number and member ID are required.",
  submitFailed: "Could not submit the case. Please try again.",
  uploadFailed: "Could not upload documents.",
} as const;

export const BLANK_OPTION: CareaiSelectOption = {
  value: "",
  label: "--Select--",
};

/** Calling code preselected on the form. */
export const DEFAULT_CALLING_CD = "+91";
