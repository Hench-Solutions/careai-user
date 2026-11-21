import { notFound } from "next/navigation";

import { CaseDocumentsForm } from "@/components/portal/agent-pages/CaseDocumentsForm";
import { ExistingDocuments } from "@/components/portal/agent-pages/ExistingDocuments";
import { PageHeader } from "@/components/portal/page-header";
import { ROUTES } from "@/config/routes";
import { fetchAgentLead } from "@/server/leads";

/** Add documents to one of the agent's own cases, whatever stage it is at. */
export async function CaseDocuments({
  params,
}: {
  params: Promise<{ claimNo: string }>;
}) {
  const { claimNo } = await params;
  const lead = await fetchAgentLead(decodeURIComponent(claimNo));
  if (!lead) notFound();

  return (
    <>
      <PageHeader
        back={{ href: ROUTES.agent.actionRequired, label: "Back to actions" }}
        title="Upload documents"
        subtitle={
          `${lead.firstName} ${lead.lastName}`.trim() + ` · ${lead.claimNo}`
        }
      />
      <ExistingDocuments
        claimNo={lead.claimNo}
        documents={lead.documents}
        heading="Already uploaded"
      />
      <CaseDocumentsForm claimNo={lead.claimNo} memberId={lead.memberId} />
    </>
  );
}
