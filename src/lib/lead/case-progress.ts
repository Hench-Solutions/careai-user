import type { LeadSummary } from "@/services/lead";

import {
  LEAD_CLOSED_STATUS_CD,
  LEAD_STAGES,
  LEAD_TREATMENT_STATUS_GROUP,
} from "@/config/lead";

export const isClosed = (lead: LeadSummary) =>
  lead.statusCd === LEAD_CLOSED_STATUS_CD;

/** 1-based step of an active case in LEAD_STAGES. */
export function stageOf(lead: LeadSummary): number {
  const index = LEAD_STAGES.findIndex((stage) =>
    (stage.groups as readonly string[]).includes(lead.statusGrp),
  );
  return index === -1 ? 1 : index + 1;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** "Today", "Yesterday", "3 days ago", or the date for anything older than a month. */
export function updatedLabel(iso: string, now: Date): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "—";
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(then)) / DAY_MS);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return then.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const inMonth = (iso: string, now: Date) => {
  const date = new Date(iso);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

export type AgentCaseStats = {
  total: { value: string; badge: string };
  active: { value: string; badge: string };
  closed: { value: string; badge: string };
};

/** The three dashboard cards, counted from the agent's own cases. */
export function summarizeCases(
  leads: readonly LeadSummary[],
  now: Date,
): AgentCaseStats {
  const closed = leads.filter(isClosed);
  const active = leads.filter((lead) => !isClosed(lead));
  const newThisMonth = leads.filter((lead) => inMonth(lead.crtdAt, now)).length;
  const closedThisMonth = closed.filter((lead) =>
    inMonth(lead.lstUpdtAt, now),
  ).length;
  const inTreatment = active.filter(
    (lead) => lead.statusGrp === LEAD_TREATMENT_STATUS_GROUP,
  ).length;
  return {
    total: {
      value: String(leads.length),
      badge: `↑ ${newThisMonth} new this month`,
    },
    active: {
      value: String(active.length),
      badge: `${inTreatment} in treatment`,
    },
    closed: {
      value: String(closed.length),
      badge: `↑ ${closedThisMonth} this month`,
    },
  };
}
