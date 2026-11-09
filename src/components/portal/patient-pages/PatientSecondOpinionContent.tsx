import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import {
  FeatureGrid,
  FormConfidentialNote,
  SectionHeader,
  ServiceHero,
  StatsRow,
} from "@/components/portal/patient-pages/patient-page-blocks";
import { PgForm } from "@/components/portal/patient-pages/pg-form";

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

      <div className="pg-panels">
        <div className="pg-section !mb-0" id="upload">
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
            <div className="pg-field">
              <label>
                Full Name <span className="pg-required">*</span>
              </label>
              <input type="text" placeholder="Patient's full name" required />
            </div>
            <div className="pg-field">
              <label>
                Email Address <span className="pg-required">*</span>
              </label>
              <input type="email" placeholder="you@example.com" required />
            </div>
            <div className="pg-field">
              <label>
                Phone Number <span className="pg-required">*</span>
              </label>
              <input type="tel" placeholder="+91 98765 43210" required />
            </div>
            <div className="pg-field">
              <label>
                Current Diagnosis <span className="pg-required">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Stage II Breast Cancer"
                required
              />
            </div>
            <div className="pg-field">
              <label>Preferred Specialty</label>
              <CareaiSelect
                defaultValue="Oncology"
                options={careaiOptionsFromLabels([
                  "Oncology",
                  "Cardiology",
                  "Orthopedics",
                  "Neurology",
                ])}
              />
            </div>
            <div className="pg-field">
              <label>Urgency</label>
              <CareaiSelect
                defaultValue="Standard (3–5 days)"
                options={careaiOptionsFromLabels([
                  "Standard (3–5 days)",
                  "Urgent (24–48 hrs)",
                ])}
              />
            </div>
            <label className="pg-upload full" htmlFor="second-opinion-upload">
              <input
                id="second-opinion-upload"
                type="file"
                className="pg-file-input"
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
            </label>
            <div className="pg-field full">
              <label>Additional Notes</label>
              <textarea placeholder="Anything the reviewing specialist should know." />
            </div>
            <div className="full">
              <button className="pg-btn solid" type="submit">
                Submit for Review
              </button>
              <FormConfidentialNote>
                Your records are reviewed only by the assigned specialist and
                kept confidential.
              </FormConfidentialNote>
            </div>
          </PgForm>
        </div>
      </div>

      <div className="pg-section">
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
      </div>
    </>
  );
}
