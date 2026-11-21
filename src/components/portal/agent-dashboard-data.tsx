import { AgentDashboardView } from "@/components/portal/agent-dashboard-view";
import { LEAD_SEARCH_BY } from "@/config/lead";
import { summarizeCases } from "@/lib/lead/case-progress";
import { fetchAgentLeads } from "@/server/leads";

/** Counts the signed-in agent's own cases for the dashboard cards. */
export async function AgentDashboardData() {
  const leads = await fetchAgentLeads(LEAD_SEARCH_BY[0].value, "");
  return <AgentDashboardView stats={summarizeCases(leads, new Date())} />;
}
