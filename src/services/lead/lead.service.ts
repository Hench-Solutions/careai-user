import type {
  LeadRegistrationPayload,
  LeadRegistrationResult,
  LeadUploadDocumentsResult,
  MasterOption,
} from "./lead.types";

import { BFF_ENDPOINTS, MASTER_QUERY } from "@/config/api";
import {
  LEAD_DOCUMENT_CODES,
  LEAD_MESSAGES,
  LEAD_UPLOAD_DOC_NAMES,
  LEAD_UPLOAD_FIELDS,
} from "@/config/lead";
import { apiGet, apiPost, apiPostForm } from "@/lib/api/client";

export function registerLead(
  payload: LeadRegistrationPayload,
): Promise<LeadRegistrationResult> {
  return apiPost<LeadRegistrationResult>(BFF_ENDPOINTS.lead.register, payload, {
    failMessage: LEAD_MESSAGES.submitFailed,
  });
}

export function updateLead(
  claimNo: string,
  payload: LeadRegistrationPayload,
): Promise<LeadRegistrationResult> {
  return apiPost<LeadRegistrationResult>(
    BFF_ENDPOINTS.lead.update,
    { ...payload, ClaimNo: claimNo },
    { failMessage: LEAD_MESSAGES.updateFailed },
  );
}

export function uploadLeadDocuments(input: {
  claimNo: string;
  memberId: string;
  idDocument?: File | null;
  idDocCd?: number | string;
  idDocNm?: string;
  medicalReports?: FileList | File[] | null;
  medicalDocCd?: number | string;
  medicalDocNm?: string;
}): Promise<LeadUploadDocumentsResult> {
  const form = new FormData();
  form.set(LEAD_UPLOAD_FIELDS.claimNo, input.claimNo);
  form.set(LEAD_UPLOAD_FIELDS.memberId, input.memberId);
  const medical = Array.from(input.medicalReports ?? []).filter(
    (file) => file.size > 0,
  );
  if (input.idDocument && input.idDocument.size > 0) {
    form.set(LEAD_UPLOAD_FIELDS.idDocument, input.idDocument);
    form.set(
      LEAD_UPLOAD_FIELDS.idDocCd,
      String(input.idDocCd ?? LEAD_DOCUMENT_CODES.id),
    );
    form.set(
      LEAD_UPLOAD_FIELDS.idDocNm,
      input.idDocNm ?? LEAD_UPLOAD_DOC_NAMES.id,
    );
  }
  if (medical.length > 0) {
    form.set(
      LEAD_UPLOAD_FIELDS.medicalDocCd,
      String(input.medicalDocCd ?? LEAD_DOCUMENT_CODES.medical),
    );
    form.set(
      LEAD_UPLOAD_FIELDS.medicalDocNm,
      input.medicalDocNm ?? LEAD_UPLOAD_DOC_NAMES.medical,
    );
    for (const file of medical) {
      form.append(LEAD_UPLOAD_FIELDS.medicalReports, file);
    }
  }
  return apiPostForm<LeadUploadDocumentsResult>(
    BFF_ENDPOINTS.lead.uploadDocuments,
    form,
    { failMessage: LEAD_MESSAGES.uploadFailed, allowEmpty: true },
  );
}

type MasterRow = { value: string; text: string };

/** In-flight + session reuse so the wizard does not refetch the same master list per field. */
const masterOptionsCache = new Map<string, Promise<MasterOption[]>>();

function masterCacheKey(url: string, params: Record<string, string>): string {
  return `${url}?${new URLSearchParams(params)}`;
}

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

function fetchOptionsCached(
  url: string,
  params: Record<string, string>,
): Promise<MasterOption[]> {
  const key = masterCacheKey(url, params);
  let pending = masterOptionsCache.get(key);
  if (!pending) {
    pending = fetchOptions(url, params);
    masterOptionsCache.set(key, pending);
    void pending.then((rows) => {
      if (rows.length === 0) masterOptionsCache.delete(key);
    });
  }
  return pending;
}

export function fetchMasterDropdown(
  mode: string,
  filterId = "",
): Promise<MasterOption[]> {
  return fetchOptionsCached(BFF_ENDPOINTS.master.dropdown, {
    [MASTER_QUERY.mode]: mode,
    ...(filterId && { [MASTER_QUERY.filterId]: filterId }),
  });
}

export function fetchMasterItems(
  itemType: string,
  filterId = "",
): Promise<MasterOption[]> {
  return fetchOptionsCached(BFF_ENDPOINTS.master.items, {
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
