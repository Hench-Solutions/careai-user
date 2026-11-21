import type { Metadata } from "next";

import { PatientConsultExpertContent } from "@/components/portal/patient-pages/PatientConsultExpertContent";
import { PortalContent } from "@/components/portal/portal-content";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export const metadata: Metadata = {
  title: "Consult an Expert",
};

export default function PatientConsultExpertPage() {
  return (
    <>
      <PortalSearchTopbar searchPlaceholder="Search specialists, specialties..." />
      <PortalContent>
        <PatientConsultExpertContent />
      </PortalContent>
    </>
  );
}
