import type {
  LeadRegistrationPayload,
  LeadRegistrationResult,
  LeadUploadDocumentsResult,
} from "./lead.types";

import { BFF_ENDPOINTS } from "@/config/api";
import { apiPost } from "@/lib/api/client";

export function registerLead(
  payload: LeadRegistrationPayload,
): Promise<LeadRegistrationResult> {
  return apiPost<LeadRegistrationResult>(BFF_ENDPOINTS.lead.register, payload, {
    failMessage: "Could not submit the case. Please try again.",
  });
}

export async function uploadLeadDocuments(input: {
  claimNo: string;
  memberId: string;
  idDocument?: File | null;
  medicalReports?: FileList | File[] | null;
}): Promise<LeadUploadDocumentsResult> {
  const form = new FormData();
  form.set("claimNo", input.claimNo);
  form.set("memberId", input.memberId);
  form.set("idDocCd", "303");
  form.set("idDocNm", "ID Document");
  form.set("medicalDocCd", "316");
  form.set("medicalDocNm", "Medical Report");

  if (input.idDocument) {
    form.set("idDocument", input.idDocument);
  }
  const reports = input.medicalReports;
  if (reports) {
    const list = Array.isArray(reports) ? reports : Array.from(reports);
    for (const file of list) {
      form.append("medicalReports", file);
    }
  }

  const res = await fetch(BFF_ENDPOINTS.lead.uploadDocuments, {
    method: "POST",
    body: form,
    credentials: "same-origin",
  });
  const body = (await res.json().catch(() => null)) as {
    responseObj?: LeadUploadDocumentsResult;
    errorObj?: { errorMessage?: string }[];
  } | null;
  if (!res.ok) {
    throw new Error(
      body?.errorObj?.[0]?.errorMessage || "Could not upload documents.",
    );
  }
  return body?.responseObj ?? {};
}

export type MasterDropdownOption = { value: string; label: string };

export async function fetchMasterDropdown(
  mode: string,
  filterId = "",
): Promise<MasterDropdownOption[]> {
  const qs = new URLSearchParams({ mode });
  if (filterId) qs.set("filterId", filterId);
  const res = await fetch(`${BFF_ENDPOINTS.master.dropdown}?${qs}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as {
    responseObj?: {
      value?: string;
      text?: string;
      Value?: string;
      Text?: string;
    }[];
  } | null;
  if (!res.ok || !Array.isArray(body?.responseObj)) return [];
  return body.responseObj.map((row) => ({
    value: String(row.value ?? row.Value ?? ""),
    label: String(row.text ?? row.Text ?? row.value ?? row.Value ?? ""),
  }));
}
