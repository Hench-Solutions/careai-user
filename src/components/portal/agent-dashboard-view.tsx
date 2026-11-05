"use client";

import { useState } from "react";

import { AgentDashboardContent } from "@/components/portal/agent-dashboard-content";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export function AgentDashboardView() {
  const [query, setQuery] = useState("");

  return (
    <>
      <PortalSearchTopbar query={query} onQueryChange={setQuery} />
      <AgentDashboardContent searchQuery={query.trim().toLowerCase()} />
    </>
  );
}
