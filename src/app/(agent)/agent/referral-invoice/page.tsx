import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { AgentReferralInvoiceContent } from "@/components/portal/agent-pages/AgentReferralInvoiceContent";
import { PortalContent } from "@/components/portal/portal-content";

export const metadata: Metadata = {
  title: "Referral & Invoice",
};

export default function AgentReferralInvoicePage() {
  return (
    <>
      <AgentCrumbTopbar label="Referral & Invoice" />
      <PortalContent>
        <AgentReferralInvoiceContent />
      </PortalContent>
    </>
  );
}
