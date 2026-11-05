import type { Metadata } from "next";

import { PatientEducationPreventionContent } from "@/components/portal/patient-pages/PatientEducationPreventionContent";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export const metadata: Metadata = {
  title: "Education & Prevention",
};

export default function PatientEducationPreventionPage() {
  return (
    <>
      <PortalSearchTopbar searchPlaceholder="Search health guides, topics..." />
      <div className="lm-content">
        <PatientEducationPreventionContent />
      </div>
    </>
  );
}
