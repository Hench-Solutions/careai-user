import Link from "next/link";
import { notFound } from "next/navigation";

import { AgentCaseRegistrationContent } from "@/components/portal/agent-pages/AgentCaseRegistrationContent";
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
      <>
        <h1 className="lm-h1">{lead.claimNo}</h1>
        <p className="lm-sub">
          This case is now at &ldquo;{lead.statusNm}&rdquo; and can no longer be
          edited.
        </p>
        <Link
          href={ROUTES.agent.caseRegistration}
          className="lm-btn lm-btn-primary"
        >
          Back to registrations
        </Link>
      </>
    );
  }
  return <AgentCaseRegistrationContent lead={lead} />;
}
