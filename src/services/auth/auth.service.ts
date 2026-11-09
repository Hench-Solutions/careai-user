import type {
  PatientSignupPayload,
  PortalLoginPayload,
  PortalUser,
} from "./auth.types";

import type { AccountRole } from "@/config/auth";

import { BFF_ENDPOINTS } from "@/config/api";
import { apiUserTypeForRole } from "@/config/auth";
import { AUTH_MESSAGES } from "@/config/auth-messages";
import { apiPost } from "@/lib/api/client";

export function portalLogin(
  role: AccountRole,
  loginId: string,
  password: string,
): Promise<PortalUser> {
  const payload: PortalLoginPayload = {
    User_Type: apiUserTypeForRole[role],
    Login_Id: loginId,
    Password: password,
  };
  return apiPost<PortalUser>(BFF_ENDPOINTS.auth.login, payload, {
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
  return apiPost<PortalUser>(BFF_ENDPOINTS.auth.signup, payload, {
    failMessage: AUTH_MESSAGES.signUpFailed,
  });
}

export function logout(): Promise<{ loggedOut: boolean }> {
  return apiPost(BFF_ENDPOINTS.auth.logout, {});
}
