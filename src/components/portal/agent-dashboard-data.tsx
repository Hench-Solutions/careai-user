import { AgentDashboardView } from "@/components/portal/agent-dashboard-view";
import { LEAD_EDITABLE_STATUS_GROUP, LEAD_SEARCH_BY } from "@/config/lead";
import { ROUTES } from "@/config/routes";
import { deriveActions } from "@/lib/lead/actions";
import { summarizeCases } from "@/lib/lead/case-progress";
import { caseEditHref } from "@/lib/lead/links";
import { fetchAgentLeads } from "@/server/leads";

/** The dashboard's cards, action items and searchable cases, all from the signed-in agent's own cases. */
export async function AgentDashboardData() {
  const leads = await fetchAgentLeads(LEAD_SEARCH_BY[0].value, "");
  return (
    <AgentDashboardView
      stats={summarizeCases(leads, new Date())}
      actions={deriveActions(leads)}
      cases={leads.map((lead) => ({
        claimNo: lead.claimNo,
        name: lead.memberName,
        memberId: lead.memberId,
        statusNm: lead.statusNm,
        href:
          lead.statusGrp === LEAD_EDITABLE_STATUS_GROUP ?
            caseEditHref(lead.claimNo)
          : ROUTES.agent.caseStatus,
      }))}
    />
  );
}
