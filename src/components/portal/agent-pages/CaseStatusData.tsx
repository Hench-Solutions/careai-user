import type { CaseStatusCard } from "@/components/portal/agent-pages/AgentCaseStatusContent";

import { AgentCaseStatusContent } from "@/components/portal/agent-pages/AgentCaseStatusContent";
import { LEAD_EDITABLE_STATUS_GROUP, LEAD_SEARCH_BY } from "@/config/lead";
import { isClosed, stageOf, updatedLabel } from "@/lib/lead/case-progress";
import { caseEditHref } from "@/lib/lead/links";
import { fetchAgentLeads } from "@/server/leads";

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");

/** The signed-in agent's open cases (a closed case is simply not listed), read from the API on every request. */
export async function CaseStatusData() {
  const leads = await fetchAgentLeads(LEAD_SEARCH_BY[0].value, "");
  const now = new Date();
  const cards: CaseStatusCard[] = leads
    .filter((lead) => !isClosed(lead))
    .map((lead) => ({
      claimNo: lead.claimNo,
      initials: initialsOf(lead.memberName),
      name: lead.memberName,
      meta: [lead.claimNo, lead.treatmentType, lead.providerNm]
        .filter(Boolean)
        .join("  ·  "),
      statusNm: lead.statusNm,
      stage: stageOf(lead),
      caseManager: lead.caseManager,
      updatedLabel: updatedLabel(lead.lstUpdtAt, now),
      editHref:
        lead.statusGrp === LEAD_EDITABLE_STATUS_GROUP ?
          caseEditHref(lead.claimNo)
        : null,
    }));
  return <AgentCaseStatusContent cases={cards} />;
}
