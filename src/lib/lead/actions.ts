import type { LeadSummary } from "@/services/lead";

import {
  LEAD_DOCUMENT_CODES,
  LEAD_EDITABLE_STATUS_GROUP,
  LEAD_INFO_REQUEST_STATUS_CDS,
} from "@/config/lead";
import { isClosed } from "@/lib/lead/case-progress";
import { caseDocumentsHref, caseEditHref } from "@/lib/lead/links";

export type ActionPriority = "High" | "Medium";
export type ActionKind = "info" | "id" | "medical";

/** One thing an agent has to do on a case. */
export type AgentAction = {
  id: string;
  kind: ActionKind;
  priority: ActionPriority;
  claimNo: string;
  title: string;
  subtitle: string;
  description: string;
  /** What the button does; null when there is nothing the agent can do on the portal. */
  primary: { label: string; href: string } | null;
};

/** What is waiting on the agent, from the open cases: more information asked for, or a missing document. */
export function deriveActions(leads: readonly LeadSummary[]): AgentAction[] {
  const actions: AgentAction[] = [];
  for (const lead of leads) {
    if (isClosed(lead)) continue;
    const base = {
      claimNo: lead.claimNo,
      subtitle: `Case ${lead.claimNo} · ${lead.statusNm}`,
    };
    const documents = lead.documentCds.split(",");

    if (
      (LEAD_INFO_REQUEST_STATUS_CDS as readonly number[]).includes(
        lead.statusCd,
      )
    ) {
      actions.push({
        ...base,
        id: `${lead.claimNo}:info`,
        kind: "info",
        priority: "High",
        title: `More information needed — ${lead.memberName}`,
        description: `Our team needs more information on this case. Current status: ${lead.statusNm}.`,
        primary:
          lead.statusGrp === LEAD_EDITABLE_STATUS_GROUP ?
            {
              label: "Update registration",
              href: caseEditHref(lead.claimNo),
            }
          : null,
      });
    }
    if (!documents.includes(LEAD_DOCUMENT_CODES.id)) {
      actions.push({
        ...base,
        id: `${lead.claimNo}:id`,
        kind: "id",
        priority: "High",
        title: `Missing ID document — ${lead.memberName}`,
        description:
          "No ID document has been uploaded for this case. Upload it so our team can continue.",
        primary: {
          label: "Upload document",
          href: caseDocumentsHref(lead.claimNo),
        },
      });
    }
    if (!documents.includes(LEAD_DOCUMENT_CODES.medical)) {
      actions.push({
        ...base,
        id: `${lead.claimNo}:medical`,
        kind: "medical",
        priority: "Medium",
        title: `Missing medical reports — ${lead.memberName}`,
        description:
          "No medical report has been uploaded for this case. Upload the reports so the hospital can review it.",
        primary: {
          label: "Upload reports",
          href: caseDocumentsHref(lead.claimNo),
        },
      });
    }
  }
  return actions.sort(
    (a, b) => Number(b.priority === "High") - Number(a.priority === "High"),
  );
}
