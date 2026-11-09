import type {
  PatientSignupPayload,
  PortalLoginPayload,
  PortalUser,
} from "./auth.types";

import type { AccountRole } from "@/config/auth";

import { API_ENDPOINTS } from "@/config/api";
import { AUTH_MESSAGES } from "@/config/auth-messages";
import { apiPost } from "@/lib/api/client";

import { API_USER_TYPES } from "./auth.types";

const userTypeForRole: Record<AccountRole, PortalLoginPayload["User_Type"]> = {
  patient: API_USER_TYPES.patient,
  facilitator: API_USER_TYPES.agent,
};

export function portalLogin(
  role: AccountRole,
  loginId: string,
  password: string,
): Promise<PortalUser> {
  const payload: PortalLoginPayload = {
    User_Type: userTypeForRole[role],
    Login_Id: loginId,
    Password: password,
  };
  return apiPost<PortalUser>(API_ENDPOINTS.auth.portalLogin, payload, {
    failMessage: AUTH_MESSAGES.signInFailed,
  });
}

/** Patient self-registration; resolves with the generated Member_Id in `user_Cd`. */
export function patientSignup(
  fullName: string,
  email: string,
  password: string,
): Promise<PortalUser> {
  const payload: PatientSignupPayload = {
    Full_Name: fullName,
    Email_Id: email,
    Password: password,
  };
  return apiPost<PortalUser>(API_ENDPOINTS.auth.patientSignup, payload, {
    failMessage: AUTH_MESSAGES.signUpFailed,
  });
}
