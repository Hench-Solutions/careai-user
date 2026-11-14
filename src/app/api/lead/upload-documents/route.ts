import type { NextRequest } from "next/server";

import type { LeadUploadDocumentsResult } from "@/services/lead/lead.types";

import { API_ENDPOINTS, API_MESSAGES } from "@/config/api";
import {
  jsonEnvelope,
  postFormToApiWithPortalToken,
  rejectForeignOrigin,
} from "@/server/auth-bff";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/** Multipart → PortalLead/upload-documents. */
export async function POST(request: NextRequest) {
  const blocked = rejectForeignOrigin(request);
  if (blocked) return blocked;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_UPLOAD_BYTES) {
    return jsonEnvelope(null, 413, API_MESSAGES.tooLarge);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonEnvelope(null, 400, API_MESSAGES.badRequest);
  }

  const claimNo = String(form.get("claimNo") ?? "").trim();
  const memberId = String(form.get("memberId") ?? "").trim();
  if (!claimNo || !memberId) {
    return jsonEnvelope(null, 400, "claimNo and memberId are required.");
  }

  const result = await postFormToApiWithPortalToken<LeadUploadDocumentsResult>(
    request,
    API_ENDPOINTS.lead.portalUploadDocuments,
    form,
    "Could not upload documents.",
  );
  if (!result.ok) return result.response;

  return jsonEnvelope(result.data);
}
