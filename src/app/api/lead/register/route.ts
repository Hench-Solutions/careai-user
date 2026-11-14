import type { NextRequest } from "next/server";

import type { LeadRegistrationResult } from "@/services/lead/lead.types";

import {
  API_ENDPOINTS,
  API_MESSAGES,
  BFF_LEAD_MAX_BODY_BYTES,
} from "@/config/api";
import {
  jsonEnvelope,
  postToApiWithPortalToken,
  readJsonObjectLimited,
  rejectForeignOrigin,
  stringField,
} from "@/server/auth-bff";

/** Map portal form fields to LeadRegistrationRequest (AgentCd set by API from token). */
function toLeadPayload(body: Record<string, unknown>) {
  return {
    FirstName: stringField(body, "FirstName"),
    MiddleName: stringField(body, "MiddleName"),
    LastName: stringField(body, "LastName"),
    EmailId: stringField(body, "EmailId"),
    Dob: stringField(body, "Dob"),
    Gender: stringField(body, "Gender"),
    Nationality: stringField(body, "Nationality"),
    CallingCd: stringField(body, "CallingCd"),
    MobileNo: stringField(body, "MobileNo"),
    LeadType: stringField(body, "LeadType") || "Normal",
    PatientLocation: stringField(body, "PatientLocation"),
    DocumentType: stringField(body, "DocumentType"),
    DocumentNo: stringField(body, "DocumentNo"),
    Source: stringField(body, "Source"),
    TreatmentType: stringField(body, "TreatmentType"),
    Department: stringField(body, "Department"),
    ProviderCd: stringField(body, "ProviderCd"),
    BranchCd: stringField(body, "BranchCd"),
    DoctorCd: stringField(body, "DoctorCd"),
    CaseNote: stringField(body, "CaseNote"),
    Diagnosis: stringField(body, "Diagnosis"),
    Treatment: stringField(body, "Treatment"),
    IcdCode: stringField(body, "IcdCode"),
    IcdDesc: stringField(body, "IcdDesc"),
    CptCode: stringField(body, "CptCode"),
    CptDesc: stringField(body, "CptDesc"),
    PaymentMode: stringField(body, "PaymentMode"),
    Guarantor: stringField(body, "Guarantor"),
  };
}

export async function POST(request: NextRequest) {
  const blocked = rejectForeignOrigin(request);
  if (blocked) return blocked;

  const body = await readJsonObjectLimited(request, BFF_LEAD_MAX_BODY_BYTES);
  if (!body) return jsonEnvelope(null, 400, API_MESSAGES.badRequest);

  const firstName = stringField(body, "FirstName").trim();
  const treatmentType = stringField(body, "TreatmentType").trim();
  if (!firstName) {
    return jsonEnvelope(null, 400, "First name is required.");
  }
  if (!treatmentType) {
    return jsonEnvelope(null, 400, "Treatment type is required.");
  }

  const result = await postToApiWithPortalToken<LeadRegistrationResult>(
    request,
    API_ENDPOINTS.lead.portalRegister,
    toLeadPayload(body),
    API_MESSAGES.generic,
  );
  if (!result.ok) return result.response;

  return jsonEnvelope(result.data);
}
