import type { LeadField } from "@/config/lead";

import { LEAD_FIELDS, LEAD_TYPES } from "@/config/lead";
import { normalizeCallingCode, validateLead } from "@/lib/lead/validate";
import { stringField } from "@/server/bff";

/** The lead form from a request body, cleaned, with the first thing wrong with it (if any). */
export function leadPayloadFrom(body: Record<string, unknown>) {
  const payload = Object.fromEntries(
    LEAD_FIELDS.map((field) => [field, stringField(body, field)]),
  ) as Record<LeadField, string>;
  payload.LeadType ||= LEAD_TYPES.normal;
  payload.CallingCd = normalizeCallingCode(payload.CallingCd);
  return { payload, issue: validateLead(payload)[0] };
}
