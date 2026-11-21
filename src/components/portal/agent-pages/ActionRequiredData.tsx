import { AgentActionRequiredContent } from "@/components/portal/agent-pages/AgentActionRequiredContent";
import { LEAD_SEARCH_BY } from "@/config/lead";
import { deriveActions } from "@/lib/lead/actions";
import { fetchAgentLeads } from "@/server/leads";

/** What is waiting on the signed-in agent, worked out from their own cases on every request. */
export async function ActionRequiredData() {
  const leads = await fetchAgentLeads(LEAD_SEARCH_BY[0].value, "");
  return <AgentActionRequiredContent actions={deriveActions(leads)} />;
}
