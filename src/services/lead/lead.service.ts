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

/** The API takes one file per call, so each document is sent on its own; one failure does not stop the rest. */
export async function uploadLeadDocuments(input: {
  claimNo: string;
  memberId: string;
  idDocument?: File | null;
  medicalReports?: FileList | File[] | null;
}): Promise<LeadUploadDocumentsResult> {
  const documents: { file: File; type: keyof typeof LEAD_DOCUMENT_CODES }[] = [
    ...(input.idDocument ?
      [{ file: input.idDocument, type: "id" as const }]
    : []),
    ...Array.from(input.medicalReports ?? [], (file) => ({
      file,
      type: "medical" as const,
    })),
  ];

  const result: LeadUploadDocumentsResult = {
    uploaded: [],
    errors: [],
  };
  for (const { file, type } of documents) {
    if (file.size === 0) continue;
    const form = new FormData();
    form.set(LEAD_UPLOAD_FIELDS.claimNo, input.claimNo);
    form.set(LEAD_UPLOAD_FIELDS.memberId, input.memberId);
    form.set(LEAD_UPLOAD_FIELDS.docCd, LEAD_DOCUMENT_CODES[type]);
    form.set(LEAD_UPLOAD_FIELDS.docNm, LEAD_UPLOAD_DOC_NAMES[type]);
    form.set(LEAD_UPLOAD_FIELDS.file, file);
    try {
      const sent = await apiPostForm<LeadUploadDocumentsResult>(
        BFF_ENDPOINTS.lead.uploadDocument,
        form,
        { failMessage: LEAD_MESSAGES.uploadFailed, allowEmpty: true },
      );
      result.uploaded.push(...(sent?.uploaded ?? []));
      result.errors.push(
        ...(sent?.errors ?? []).map((error) => `${file.name}: ${error}`),
      );
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : LEAD_MESSAGES.uploadFailed;
      result.errors.push(`${file.name}: ${reason}`);
    }
  }
  return result;
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
