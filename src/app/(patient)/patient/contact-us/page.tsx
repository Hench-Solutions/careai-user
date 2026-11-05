import type { Metadata } from "next";

import { PatientContactUsContent } from "@/components/portal/patient-pages/PatientContactUsContent";
import { PortalSearchTopbar } from "@/components/portal/portal-search-topbar";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function PatientContactUsPage() {
  return (
    <>
      <PortalSearchTopbar searchPlaceholder="Search help topics..." />
      <div className="lm-content">
        <PatientContactUsContent />
      </div>
    </>
  );
}
