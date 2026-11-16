import type { NextRequest } from "next/server";

import type { LeadField } from "@/config/lead";
import type { LeadRegistrationResult } from "@/services/lead/lead.types";

import { API_ENDPOINTS, API_MESSAGES } from "@/config/api";
import { LEAD_FIELDS, LEAD_JSON_MAX_BYTES, LEAD_TYPES } from "@/config/lead";
import { normalizeCallingCode, validateLead } from "@/lib/lead/validate";
import {
  jsonEnvelope,
  postToApiWithPortalToken,
  readJsonObjectLimited,
  rejectForeignOrigin,
  stringField,
} from "@/server/bff";

export async function POST(request: NextRequest) {
  const blocked = rejectForeignOrigin(request);
  if (blocked) return blocked;

  const body = await readJsonObjectLimited(request, LEAD_JSON_MAX_BYTES);
  if (!body) return jsonEnvelope(null, 400, API_MESSAGES.badRequest);

  const payload = Object.fromEntries(
    LEAD_FIELDS.map((field) => [field, stringField(body, field)]),
  ) as Record<LeadField, string>;
  payload.LeadType ||= LEAD_TYPES.normal;
  payload.CallingCd = normalizeCallingCode(payload.CallingCd);
  const [issue] = validateLead(payload);
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
