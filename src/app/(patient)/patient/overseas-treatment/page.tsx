import type { Metadata } from "next";

import { PatientOverseasTreatmentContent } from "@/components/portal/patient-pages/PatientOverseasTreatmentContent";
import { PortalContent } from "@/components/portal/portal-content";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export const metadata: Metadata = {
  title: "Overseas Treatment",
};

export default function PatientOverseasTreatmentPage() {
  return (
    <>
      <PortalSearchTopbar searchPlaceholder="Search destinations, hospitals..." />
      <PortalContent>
        <PatientOverseasTreatmentContent />
      </PortalContent>
    </>
  );
}
