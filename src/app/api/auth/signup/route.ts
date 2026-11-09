import type { NextRequest } from "next/server";

import type {
  PatientSignupPayload,
  PortalUser,
} from "@/services/auth/auth.types";

import { API_ENDPOINTS, API_MESSAGES } from "@/config/api";
import { AUTH_MESSAGES } from "@/config/auth-messages";
import {
  jsonEnvelope,
  postToApi,
  readJsonObject,
  rejectForeignOrigin,
  stringField,
} from "@/server/auth-bff";

/** Creates a patient account. It does not sign the visitor in. */
export async function POST(request: NextRequest) {
  const blocked = rejectForeignOrigin(request);
  if (blocked) return blocked;

  const body = await readJsonObject(request);
  if (!body) return jsonEnvelope(null, 400, API_MESSAGES.badRequest);

  const payload: PatientSignupPayload = {
    Full_Name: stringField(body, "Full_Name"),
    Email_Id: stringField(body, "Email_Id"),
    Password: stringField(body, "Password"),
  };

  const result = await postToApi<PortalUser>(
    request,
    API_ENDPOINTS.auth.patientSignup,
    payload,
    AUTH_MESSAGES.signUpFailed,
  );
  return result.ok ? jsonEnvelope(result.data) : result.response;
}
