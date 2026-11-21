import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentDashboardData } from "@/components/portal/agent-dashboard-data";
import { PortalPageSkeleton } from "@/components/portal/portal-loading-fallbacks";

export const metadata: Metadata = {
  title: "Agent Dashboard",
  description: "CareAI business account dashboard.",
};

export default function AgentDashboardPage() {
  return (
    <Suspense fallback={<PortalPageSkeleton />}>
      <AgentDashboardData />
    </Suspense>
  );
}
