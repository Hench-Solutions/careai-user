import type { NextRequest } from "next/server";

import type { PortalUser } from "@/services/auth/auth.types";

import { API_ENDPOINTS, API_MESSAGES } from "@/config/api";
import { AUTH_MESSAGES } from "@/config/auth-messages";
import { PORTAL_JWT_SECRET } from "@/config/server-env";
import { verifyPortalToken } from "@/lib/auth/portal-token";
import {
  jsonEnvelope,
  postToApi,
  readJsonObject,
  rejectForeignOrigin,
  stringField,
  withTokenCookie,
} from "@/server/auth-bff";

type PortalLoginResult = PortalUser & { token: string; expires_At: string };

/** Signs in through the API, keeps the token in an httpOnly cookie and returns only the user. */
export async function POST(request: NextRequest) {
  const blocked = rejectForeignOrigin(request);
  if (blocked) return blocked;

  const body = await readJsonObject(request);
  if (!body) return jsonEnvelope(null, 400, API_MESSAGES.badRequest);

  const payload = {
    User_Type: stringField(body, "User_Type"),
    Login_Id: stringField(body, "Login_Id"),
    Password: stringField(body, "Password"),
  };

  const result = await postToApi<PortalLoginResult>(
    request,
    API_ENDPOINTS.auth.portalLogin,
    payload,
    AUTH_MESSAGES.signInFailed,
  );
  if (!result.ok) return result.response;

  const { token, ...user } = result.data;
  delete (user as Partial<PortalLoginResult>).expires_At;
  // Never set a cookie the proxy would reject (e.g. PORTAL_JWT_SECRET out of sync with the API).
  const claims = await verifyPortalToken(token, PORTAL_JWT_SECRET);
  if (!claims) {
    console.error("Portal token failed verification: check PORTAL_JWT_SECRET.");
    return jsonEnvelope(null, 500, API_MESSAGES.generic);
  }

  const maxAge = Math.max(1, claims.exp - Math.floor(Date.now() / 1000));
  return withTokenCookie(jsonEnvelope(user), token, maxAge);
}
