import type {
  LeadRegistrationPayload,
  LeadRegistrationResult,
  LeadUploadDocumentsResult,
  MasterOption,
} from "./lead.types";

import { BFF_ENDPOINTS, MASTER_QUERY } from "@/config/api";
import { LEAD_MESSAGES, LEAD_UPLOAD_FIELDS } from "@/config/lead";
import { apiGet, apiPost, apiPostForm } from "@/lib/api/client";

export function registerLead(
  payload: LeadRegistrationPayload,
): Promise<LeadRegistrationResult> {
  return apiPost<LeadRegistrationResult>(BFF_ENDPOINTS.lead.register, payload, {
    failMessage: LEAD_MESSAGES.submitFailed,
  });
}

export function uploadLeadDocuments(input: {
  claimNo: string;
  memberId: string;
  idDocument?: File | null;
  medicalReports?: FileList | File[] | null;
}): Promise<LeadUploadDocumentsResult> {
  const form = new FormData();
  form.set(LEAD_UPLOAD_FIELDS.claimNo, input.claimNo);
  form.set(LEAD_UPLOAD_FIELDS.memberId, input.memberId);
  if (input.idDocument) {
    form.set(LEAD_UPLOAD_FIELDS.idDocument, input.idDocument);
  }
  for (const file of Array.from(input.medicalReports ?? [])) {
    form.append(LEAD_UPLOAD_FIELDS.medicalReports, file);
  }
  return apiPostForm<LeadUploadDocumentsResult>(
    BFF_ENDPOINTS.lead.uploadDocuments,
    form,
    { failMessage: LEAD_MESSAGES.uploadFailed, allowEmpty: true },
  );
}

type MasterRow = { value: string; text: string };

/** A master list as select options; an unavailable list is an empty one. */
async function fetchOptions(
  url: string,
  params: Record<string, string>,
): Promise<MasterOption[]> {
  const query = new URLSearchParams(params);
  try {
    const rows = await apiGet<MasterRow[]>(`${url}?${query}`);
    return rows
      .filter((row) => row.text?.trim())
      .map((row) => ({ value: row.value, label: row.text }));
  } catch {
    return [];
  }
}

export function fetchMasterDropdown(
  mode: string,
  filterId = "",
): Promise<MasterOption[]> {
  return fetchOptions(BFF_ENDPOINTS.master.dropdown, {
    [MASTER_QUERY.mode]: mode,
    ...(filterId && { [MASTER_QUERY.filterId]: filterId }),
  });
}

export function fetchMasterItems(
  itemType: string,
  filterId = "",
): Promise<MasterOption[]> {
  return fetchOptions(BFF_ENDPOINTS.master.items, {
    [MASTER_QUERY.itemType]: itemType,
    ...(filterId && { [MASTER_QUERY.filterId]: filterId }),
  });
}

export function searchCodes(
  type: string,
  term: string,
): Promise<MasterOption[]> {
  return fetchOptions(BFF_ENDPOINTS.master.codeSearch, {
    [MASTER_QUERY.codeType]: type,
    [MASTER_QUERY.codeQuery]: term,
  });
}
