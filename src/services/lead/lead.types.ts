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

/** One row of the agent's registrations list (`PortalLead/search`). */
export type LeadSummary = {
  claimNo: string;
  memberId: string;
  memberName: string;
  memberCategory: string;
  source: string;
  treatmentType: string;
  caseManager: string;
  statusNm: string;
  statusGrp: string;
  crtdDt: string;
};

/** A registered case as the API returns it (`PortalLead/{claimNo}`): codes plus their names (`...Nm`). */
export type LeadDetail = {
  claimNo: string;
  memberId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  emailId: string;
  dob: string;
  gender: string;
  nationality: string;
  nationalityNm: string;
  callingCd: string;
  mobileNo: string;
  leadType: string;
  patientLocation: string;
  patientLocationNm: string;
  documentType: string;
  documentTypeNm: string;
  documentNo: string;
  treatmentType: string;
  treatmentTypeNm: string;
  department: string;
  departmentNm: string;
  providerCd: string;
  providerNm: string;
  branchCd: string;
  branchNm: string;
  doctorCd: string;
  doctorNm: string;
  caseNote: string;
  icdCode: string;
  icdDesc: string;
  cptCode: string;
  cptDesc: string;
  diagnosis: string;
  treatment: string;
  paymentMode: string;
  paymentModeNm: string;
  guarantor: string;
  guarantorNm: string;
  statusNm: string;
  statusGrp: string;
  documents: { docNm: string; fileName: string; docCd: string }[];
};
