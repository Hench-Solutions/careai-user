"use client";

import { useState } from "react";

import type { DashboardCase } from "@/components/portal/agent-dashboard-content";
import type { AgentAction } from "@/lib/lead/actions";
import type { AgentCaseStats } from "@/lib/lead/case-progress";

import { AgentDashboardContent } from "@/components/portal/agent-dashboard-content";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export function AgentDashboardView({
  stats,
  actions,
  cases,
}: {
  stats: AgentCaseStats;
  actions: readonly AgentAction[];
  cases: readonly DashboardCase[];
}) {
  const [query, setQuery] = useState("");

  return (
    <>
      <PortalSearchTopbar query={query} onQueryChange={setQuery} />
      <AgentDashboardContent
        searchQuery={query.trim().toLowerCase()}
        stats={stats}
        actions={actions}
        cases={cases}
      />
    </>
  );
}
