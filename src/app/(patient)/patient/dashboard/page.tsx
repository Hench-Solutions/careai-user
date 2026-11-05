import type { Metadata } from "next";

import { PatientDashboardContent } from "@/components/portal/patient-dashboard-content";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export const metadata: Metadata = {
  title: "Patient Dashboard",
  description: "CareAI patient portal dashboard.",
};

export default function PatientDashboardPage() {
  return (
    <>
      <PortalSearchTopbar />
      <PatientDashboardContent />
    </>
  );
}
