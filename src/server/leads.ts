import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { ApiEnvelope } from "@/lib/api/client";
import type { LeadDetail, LeadSummary } from "@/services/lead";

import { API_ENDPOINTS, BFF_ENDPOINTS } from "@/config/api";
import { PORTAL_TOKEN_COOKIE } from "@/config/portal-session";
import { apiBaseUrl } from "@/config/server-env";

/** GET to the API with the visitor's token; a rejected token sends them through the expiry route. */
async function getFromApi<T>(path: string, auth = true): Promise<T | null> {
  const headers: Record<string, string> = {};
  if (auth) {
    const token = (await cookies()).get(PORTAL_TOKEN_COOKIE)?.value;
    if (!token) redirect(BFF_ENDPOINTS.auth.expired);
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    headers,
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) {
    redirect(BFF_ENDPOINTS.auth.expired);
  }
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`${path} failed with ${res.status}`);
  const body = (await res.json()) as ApiEnvelope<T> | T;
  return body && typeof body === "object" && "responseObj" in body ?
      (body.responseObj ?? null)
    : (body as T);
}

/** The signed-in agent's own registrations, newest first. */
export async function fetchAgentLeads(
  searchBy: string,
  searchVal: string,
): Promise<LeadSummary[]> {
  const query = new URLSearchParams({ searchBy, searchVal });
  const rows = await getFromApi<LeadSummary[]>(
    `${API_ENDPOINTS.lead.portalSearch}?${query}`,
  );
  return rows ?? [];
}

/** One of the agent's own registrations; null when it does not exist or belongs to someone else. */
export function fetchAgentLead(claimNo: string): Promise<LeadDetail | null> {
  return getFromApi<LeadDetail>(API_ENDPOINTS.lead.portalLead(claimNo));
}
