import type { Metadata } from "next";

import "@/styles/careai-portal.css";

import { PatientPortalShell } from "@/components/portal/patient-portal-shell";
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
  return <PatientPortalShell>{children}</PatientPortalShell>;
}
