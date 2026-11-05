import type { Metadata } from "next";

import { PatientConsultExpertContent } from "@/components/portal/patient-pages/PatientConsultExpertContent";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export const metadata: Metadata = {
  title: "Consult an Expert",
};

export default function PatientConsultExpertPage() {
  return (
    <>
      <PortalSearchTopbar searchPlaceholder="Search specialists, specialties..." />
      <div className="lm-content">
        <PatientConsultExpertContent />
      </div>
    </>
  );
}
