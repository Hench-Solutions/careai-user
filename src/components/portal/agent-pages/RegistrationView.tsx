import Link from "next/link";
import { notFound } from "next/navigation";

import type { ReactNode } from "react";

import { ExistingDocuments } from "@/components/portal/agent-pages/ExistingDocuments";
import { MASTER_ITEM_TYPES } from "@/config/api";
import { LEAD_EDITABLE_STATUS_GROUP } from "@/config/lead";
import { ROUTES } from "@/config/routes";
import { fetchAgentLead, fetchMasterItemName } from "@/server/leads";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime()) ? iso : dateFormat.format(date);
}

function Field({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "mr-wide" : undefined}>
      <dt>{label}</dt>
      <dd>{value?.trim() || "—"}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mr-card">
      <h2>{title}</h2>
      <dl className="mr-grid">{children}</dl>
    </section>
  );
}

/** Read-only details of one of the agent's registrations. */
export async function RegistrationView({
  params,
}: {
  params: Promise<{ claimNo: string }>;
}) {
  const { claimNo } = await params;
  const lead = await fetchAgentLead(decodeURIComponent(claimNo));
  if (!lead) notFound();

  const gender = await fetchMasterItemName(
    MASTER_ITEM_TYPES.gender,
    lead.gender,
  );
  const name = [lead.firstName, lead.middleName, lead.lastName]
    .filter(Boolean)
    .join(" ");
  const editable = lead.statusGrp === LEAD_EDITABLE_STATUS_GROUP;
  const base = `${ROUTES.agent.caseRegistration}/${encodeURIComponent(lead.claimNo)}`;

  return (
    <>
      <div className="mr-head">
        <div>
          <h1 className="lm-h1">{name}</h1>
          <p className="lm-sub">
            {lead.claimNo} · {lead.memberId}{" "}
            <span className={editable ? "rv-badge pending" : "rv-badge info"}>
              {lead.statusNm}
            </span>
          </p>
        </div>
        <div className="mr-head-actions">
          <Link
            href={ROUTES.agent.caseRegistration}
            className="lm-btn lm-btn-ghost"
          >
            Back
          </Link>
          {editable ?
            <Link href={`${base}/edit`} className="lm-btn lm-btn-primary">
              Edit
            </Link>
          : null}
        </div>
      </div>

      <Card title="Customer Information">
        <Field label="First Name" value={lead.firstName} />
        <Field label="Middle Name" value={lead.middleName} />
        <Field label="Last Name" value={lead.lastName} />
        <Field label="Email Address" value={lead.emailId} />
        <Field label="Date of Birth" value={lead.dob && formatDate(lead.dob)} />
        <Field label="Gender" value={gender} />
        <Field label="Nationality" value={lead.nationalityNm} />
        <Field
          label="Contact Number"
          value={[lead.callingCd, lead.mobileNo].filter(Boolean).join(" ")}
        />
        <Field label="Category" value={lead.leadType} />
        <Field label="Patient Location" value={lead.patientLocationNm} />
        <Field label="Identification Document" value={lead.documentTypeNm} />
        <Field label="Document Number" value={lead.documentNo} />
      </Card>

      <Card title="Medical Information">
        <Field label="Treatment Type" value={lead.treatmentTypeNm} />
        <Field label="Department" value={lead.departmentNm} />
        <Field label="Preferred Hospital" value={lead.providerNm} />
        <Field label="Branch Location" value={lead.branchNm} />
        <Field label="Preferred Doctor" value={lead.doctorNm} />
        <Field
          label="ICD"
          value={[lead.icdCode, lead.icdDesc].filter(Boolean).join(" · ")}
        />
        <Field
          label="CPT"
          value={[lead.cptCode, lead.cptDesc].filter(Boolean).join(" · ")}
        />
        <Field label="Diagnosis" value={lead.diagnosis} wide />
        <Field label="Treatment" value={lead.treatment} wide />
        <Field label="Case Notes & Remarks" value={lead.caseNote} wide />
      </Card>

      <Card title="Mode of Payment">
        <Field label="Payment Mode" value={lead.paymentModeNm} />
        <Field label="Payment Type" value={lead.guarantorNm} />
      </Card>

      <section className="mr-card">
        <h2>Documents</h2>
        {lead.documents.length === 0 ?
          <p className="lm-sub">No documents uploaded.</p>
        : <ExistingDocuments
            claimNo={lead.claimNo}
            documents={lead.documents}
          />
        }
      </section>
    </>
  );
}
