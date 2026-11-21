import type { Metadata } from "next";

import "@/styles/forms.css";

import { PortalSession } from "@/components/portal/portal-session";
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
  return <PortalSession portal="agent">{children}</PortalSession>;
}
