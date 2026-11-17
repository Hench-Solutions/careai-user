import type { NextRequest } from "next/server";

import type { LeadRegistrationResult } from "@/services/lead/lead.types";

import { API_ENDPOINTS, API_MESSAGES } from "@/config/api";
import { LEAD_JSON_MAX_BYTES } from "@/config/lead";
import {
  jsonEnvelope,
  postToApiWithPortalToken,
  readJsonObjectLimited,
  rejectForeignOrigin,
} from "@/server/bff";
import { leadPayloadFrom } from "@/server/lead-payload";

export async function POST(request: NextRequest) {
  const blocked = rejectForeignOrigin(request);
  if (blocked) return blocked;

  const body = await readJsonObjectLimited(request, LEAD_JSON_MAX_BYTES);
  if (!body) return jsonEnvelope(null, 400, API_MESSAGES.badRequest);

  const { payload, issue } = leadPayloadFrom(body);
  if (issue) return jsonEnvelope(null, 400, issue.message);

  const result = await postToApiWithPortalToken<LeadRegistrationResult>(
    request,
    API_ENDPOINTS.lead.portalRegister,
    payload,
    API_MESSAGES.generic,
  );
  if (!result.ok) return result.response;

  return jsonEnvelope(result.data);
}
