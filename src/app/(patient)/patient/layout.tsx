import type { Metadata } from "next";

import "@/styles/careai-portal.css";

import { PortalSession } from "@/components/portal/portal-session";
import { noIndexRobots } from "@/config/site";

export const metadata: Metadata = {
  title: "Patient portal",
  robots: noIndexRobots,
};

export default function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalSession portal="patient">{children}</PortalSession>;
}
