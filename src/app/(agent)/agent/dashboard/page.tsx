import type { Metadata } from "next";

import { AgentDashboardView } from "@/components/portal/agent-dashboard-view";

export const metadata: Metadata = {
  title: "Agent Dashboard",
  description: "CareAI business account dashboard.",
};

export default function AgentDashboardPage() {
  return <AgentDashboardView />;
}
