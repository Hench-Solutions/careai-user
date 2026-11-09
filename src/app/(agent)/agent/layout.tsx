import type { Metadata } from "next";

import "@/styles/careai-portal.css";

import { PortalShell } from "@/components/portal/portal-shell";
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
  return <PortalShell portal="agent">{children}</PortalShell>;
}
