/** Portal subset of CareAi LeadRegistrationRequest (shared web + mobile contract). */
export type LeadRegistrationPayload = {
  FirstName: string;
  MiddleName?: string;
  LastName?: string;
  EmailId?: string;
  Dob?: string;
  /** CHAR(1) M/F/O/N */
  Gender?: string;
  Nationality?: string;
  CallingCd?: string;
  MobileNo?: string;
  /** Priority | Emergency | Normal */
  LeadType?: string;
  PatientLocation?: string;
  DocumentType?: string;
  DocumentNo?: string;
  Source?: string;
  DoctorCd?: string;
  TreatmentType: string;
  Department?: string;
  ProviderCd?: string;
  BranchCd?: string;
  CaseNote?: string;
  Diagnosis?: string;
  Treatment?: string;
  IcdCode?: string;
  IcdDesc?: string;
  CptCode?: string;
  CptDesc?: string;
  /** Payment_Mode_Cd (admin "Payment Mode") */
  PaymentMode?: string;
  /** Guarantor_Cd (admin "Payment Type") */
  Guarantor?: string;
};

export type LeadRegistrationResult = {
  member_Id: string;
  claim_No: string;
};

export type LeadUploadDocumentsResult = {
  uploaded?: string[];
  errors?: string[];
};
