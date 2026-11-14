import type { LeadField } from "@/config/lead";

/** The portal's lead form as the API takes it (shared web and mobile contract). */
export type LeadRegistrationPayload = Partial<Record<LeadField, string>> &
  Record<"FirstName" | "TreatmentType", string>;

export type LeadRegistrationResult = {
  member_Id: string;
  claim_No: string;
};

export type LeadUploadDocumentsResult = {
  uploaded?: string[];
  errors?: string[];
};

export type MasterOption = { value: string; label: string };
