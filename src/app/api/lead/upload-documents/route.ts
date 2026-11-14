import type { NextRequest } from "next/server";

import type { LeadUploadDocumentsResult } from "@/services/lead/lead.types";

import { API_ENDPOINTS, API_MESSAGES } from "@/config/api";
import {
  LEAD_MESSAGES,
  LEAD_UPLOAD_FIELDS,
  LEAD_UPLOAD_MAX_BYTES,
} from "@/config/lead";
import {
  jsonEnvelope,
  postFormToApiWithPortalToken,
  rejectForeignOrigin,
} from "@/server/bff";

export async function POST(request: NextRequest) {
  const blocked = rejectForeignOrigin(request);
  if (blocked) return blocked;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > LEAD_UPLOAD_MAX_BYTES) {
    return jsonEnvelope(null, 413, API_MESSAGES.tooLarge);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonEnvelope(null, 400, API_MESSAGES.badRequest);
  }

  const claimNo = String(form.get(LEAD_UPLOAD_FIELDS.claimNo) ?? "").trim();
  const memberId = String(form.get(LEAD_UPLOAD_FIELDS.memberId) ?? "").trim();
  if (!claimNo || !memberId) {
    return jsonEnvelope(null, 400, LEAD_MESSAGES.claimAndMemberRequired);
  }

  const result = await postFormToApiWithPortalToken<LeadUploadDocumentsResult>(
    request,
    API_ENDPOINTS.lead.portalUploadDocuments,
    form,
    LEAD_MESSAGES.uploadFailed,
  );
  if (!result.ok) return result.response;

  return jsonEnvelope(result.data);
}
