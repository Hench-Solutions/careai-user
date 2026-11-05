import type { Metadata } from "next";

import "@/styles/careai-portal.css";

import { AgentPortalShell } from "@/components/portal/agent-portal-shell";
import { noIndexRobots } from "@/config/site";

export const metadata: Metadata = {
  title: "Agent portal",
  robots: noIndexRobots,
};

export default function AgentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgentPortalShell>{children}</AgentPortalShell>;
}
