import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import {
  FeatureGrid,
  FormConfidentialNote,
  SectionHeader,
  ServiceHero,
  StatsRow,
} from "@/components/portal/patient-pages/patient-page-blocks";
import {
  PgForm,
  PgSubmitButton,
} from "@/components/portal/patient-pages/pg-form";
import {
  PgField,
  PgPanels,
  PgSection,
  PgUpload,
  Required,
} from "@/components/portal/patient-pages/pg-primitives";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";

const OPINION_STATS = [
  { num: "3–5", lbl: "Days Standard Turnaround" },
  { num: "24h", lbl: "Urgent Reviews" },
  { num: "95%", lbl: "Patient Confidence Score" },
  { num: "50+", lbl: "Reviewing Specialists" },
];

const WHEN_FEATURES = [
  {
    tint: "purple" as const,
    title: "Rare or Complex Diagnosis",
    body: "Confirm an unusual or serious diagnosis before starting treatment.",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
      </svg>
    ),
  },
  {
    tint: "pink" as const,
    title: "Major Surgery Planned",
    body: "Verify that surgery is the right option before committing to a procedure.",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    tint: "green" as const,
    title: "Treatment Isn't Working",
    body: "Explore alternative approaches when a current plan isn't showing results.",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export function PatientSecondOpinionContent() {
  return (
    <>
      <ServiceHero
        badgeIcon={
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 11l3 3L22 4" />
          </svg>
        }
        title="Second Opinion"
        description="Get a specialist's independent review of your diagnosis or treatment plan before making a major medical decision — with a written report in as little as 3 days."
        cta={{ href: "#upload", label: "Submit Your Case" }}
        icon={
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M8 3h8l4 4V20a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        }
      />

      <StatsRow items={OPINION_STATS} />

      <PgPanels>
        <PgSection className="mb-0" id="upload">
          <SectionHeader
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v12M7 8l5-5 5 5" />
                <path d="M5 21h14" />
              </svg>
            }
            title="Submit Your Case"
          />

          <PgForm
            className="mt-[18px]"
            successTitle="Case Submitted for Review"
            successMessage="Thank you — a specialist will review your case and your written report will be ready within the selected timeframe."
          >
            <PgField>
              <FieldLabel variant="soft">
                Full Name <Required />
              </FieldLabel>
              <Input
                variant="soft"
                type="text"
                placeholder="Patient's full name"
                required
              />
            </PgField>
            <PgField>
              <FieldLabel variant="soft">
                Email Address <Required />
              </FieldLabel>
              <Input
                variant="soft"
                type="email"
                placeholder="you@example.com"
                required
              />
            </PgField>
            <PgField>
              <FieldLabel variant="soft">
                Phone Number <Required />
              </FieldLabel>
              <Input
                variant="soft"
                type="tel"
                placeholder="+91 98765 43210"
                required
              />
            </PgField>
            <PgField>
              <FieldLabel variant="soft">
                Current Diagnosis <Required />
              </FieldLabel>
              <Input
                variant="soft"
                type="text"
                placeholder="e.g. Stage II Breast Cancer"
                required
              />
            </PgField>
            <PgField>
              <FieldLabel variant="soft">Preferred Specialty</FieldLabel>
              <CareaiSelect
                appearance="pg"
                defaultValue="Oncology"
                options={careaiOptionsFromLabels([
                  "Oncology",
                  "Cardiology",
                  "Orthopedics",
                  "Neurology",
                ])}
              />
            </PgField>
            <PgField>
              <FieldLabel variant="soft">Urgency</FieldLabel>
              <CareaiSelect
                appearance="pg"
                defaultValue="Standard (3–5 days)"
                options={careaiOptionsFromLabels([
                  "Standard (3–5 days)",
                  "Urgent (24–48 hrs)",
                ])}
              />
            </PgField>
            <PgUpload className="col-span-full" htmlFor="second-opinion-upload">
              <FileInput
                id="second-opinion-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
              />
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v12M7 8l5-5 5 5" />
                <path d="M5 21h14" />
              </svg>
              <p>
                <span className="browse">Click to upload</span> or drag reports,
                scans & lab results here
              </p>
            </PgUpload>
            <PgField className="col-span-full">
              <FieldLabel variant="soft">Additional Notes</FieldLabel>
              <Textarea
                variant="soft"
                placeholder="Anything the reviewing specialist should know."
              />
            </PgField>
            <div className="col-span-full">
              <PgSubmitButton>Submit for Review</PgSubmitButton>
              <FormConfidentialNote>
                Your records are reviewed only by the assigned specialist and
                kept confidential.
              </FormConfidentialNote>
            </div>
          </PgForm>
        </PgSection>
      </PgPanels>

      <PgSection>
        <SectionHeader
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          }
          title="When to Get a Second Opinion"
        />
        <FeatureGrid items={WHEN_FEATURES} />
      </PgSection>
    </>
  );
}
