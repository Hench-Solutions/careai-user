"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { PortalProfile } from "@/lib/auth/user";

import { API_ENDPOINTS, API_MESSAGES } from "@/config/api";
import {
  dashboardPathForRole,
  LOGIN_PARAMS,
  roleForApiUserType,
  safeNextPath,
} from "@/config/auth";
import { AUTH_MESSAGES } from "@/config/auth-messages";
import { postToApi } from "@/server/bff";
import { clearPortalCookie, setPortalCookie } from "@/server/session";

/** Result a form shows under its button; `loginId` is set once a sign-up succeeds. */
export type AuthFormState = {
  type: "error" | "success";
  message: string;
  loginId?: string;
} | null;

type PortalLoginResult = PortalProfile & { token: string; expires_At: string };

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
};

export async function signInAction(
  _previous: AuthFormState,
  form: FormData,
): Promise<AuthFormState> {
  const userType = text(form, "user_type");
  const result = await postToApi<PortalLoginResult>(
    { headers: await headers() },
    API_ENDPOINTS.auth.portalLogin,
    {
      User_Type: userType,
      Login_Id: text(form, "login_id"),
      Password: text(form, "password"),
    },
    AUTH_MESSAGES.signInFailed,
  );
  if (!result.ok) return { type: "error", message: result.message };

  const { token, expires_At } = result.data;
  const role = roleForApiUserType(result.data.user_Type);
  if (
    !token ||
    !role ||
    !Number.isFinite(Date.parse(expires_At)) ||
    Date.parse(expires_At) <= Date.now()
  ) {
    return { type: "error", message: API_MESSAGES.generic };
  }

  await setPortalCookie(token);
  redirect(
    safeNextPath(role, text(form, LOGIN_PARAMS.next)) ??
      dashboardPathForRole(role),
  );
}

export async function signUpAction(
  _previous: AuthFormState,
  form: FormData,
): Promise<AuthFormState> {
  const result = await postToApi<PortalProfile>(
    { headers: await headers() },
    API_ENDPOINTS.auth.patientSignup,
    {
      Full_Name: text(form, "full_name"),
      Email_Id: text(form, "email"),
      Password: text(form, "password"),
    },
    AUTH_MESSAGES.signUpFailed,
  );
  if (!result.ok) return { type: "error", message: result.message };
  return {
    type: "success",
    message: AUTH_MESSAGES.accountCreated(result.data.user_Cd),
    loginId: result.data.user_Cd,
  };
}

export async function signOutAction(): Promise<void> {
  await clearPortalCookie();
}
