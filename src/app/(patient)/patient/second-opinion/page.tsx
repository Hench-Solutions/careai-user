import type { Metadata } from "next";

import { PatientSecondOpinionContent } from "@/components/portal/patient-pages/PatientSecondOpinionContent";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export const metadata: Metadata = {
  title: "Second Opinion",
};

export default function PatientSecondOpinionPage() {
  return (
    <>
      <PortalSearchTopbar searchPlaceholder="Search conditions, reports..." />
      <div className="lm-content">
        <PatientSecondOpinionContent />
      </div>
    </>
  );
}
