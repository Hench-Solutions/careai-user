import { notFound } from "next/navigation";

import { AgentCaseRegistrationContent } from "@/components/portal/agent-pages/AgentCaseRegistrationContent";
import { PageHeader } from "@/components/portal/page-header";
import { LEAD_EDITABLE_STATUS_GROUP } from "@/config/lead";
import { ROUTES } from "@/config/routes";
import { fetchAgentLead } from "@/server/leads";

/** The registration form, filled with a case that is still at the registration stage. */
export async function RegistrationEdit({
  params,
}: {
  params: Promise<{ claimNo: string }>;
}) {
  const { claimNo } = await params;
  const lead = await fetchAgentLead(decodeURIComponent(claimNo));
  if (!lead) notFound();

  if (lead.statusGrp !== LEAD_EDITABLE_STATUS_GROUP) {
    return (
      <PageHeader
        back={{
          href: ROUTES.agent.caseRegistration,
          label: "Back to registrations",
        }}
        title={lead.claimNo}
        subtitle={
          <>
            This case is now at &ldquo;{lead.statusNm}&rdquo; and can no longer
            be edited.
          </>
        }
      />
    );
  }
  return <AgentCaseRegistrationContent lead={lead} />;
}
