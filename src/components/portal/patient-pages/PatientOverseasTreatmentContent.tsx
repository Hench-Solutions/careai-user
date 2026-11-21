import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import {
  CountryGrid,
  FeatureGrid,
  FormConfidentialNote,
  ProcedureTable,
  SectionHeader,
  ServiceHero,
  StatsRow,
  StepsList,
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

const OVERSEAS_STATS = [
  { num: "6", lbl: "Partner Countries" },
  { num: "120+", lbl: "Partner Hospitals" },
  { num: "40–70%", lbl: "Avg. Cost Savings" },
  { num: "24/7", lbl: "Coordinator Support" },
];

const COUNTRIES = [
  { flag: "🇮🇳", name: "India", save: "Save up to 65%" },
  { flag: "🇹🇷", name: "Turkey", save: "Save up to 60%" },
  { flag: "🇹🇭", name: "Thailand", save: "Save up to 55%" },
  { flag: "🇦🇪", name: "UAE", save: "Save up to 40%" },
  { flag: "🇩🇪", name: "Germany", save: "Save up to 30%" },
];

const WHY_FEATURES = [
  {
    tint: "purple" as const,
    title: "JCI-Accredited Hospitals",
    body: "Access to internationally accredited hospitals with proven outcomes and quality standards.",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M20 7l-9 9-5-5" />
      </svg>
    ),
  },
  {
    tint: "pink" as const,
    title: "Dedicated Case Coordinator",
    body: "One point of contact managing appointments, records and communication end-to-end.",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M4 4h16v12H7l-3 3z" />
      </svg>
    ),
  },
  {
    tint: "green" as const,
    title: "Transparent Cost Estimates",
    body: "Upfront, itemized pricing with no hidden fees so you can plan the full journey with confidence.",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    tint: "amber" as const,
    title: "Visa & Travel Assistance",
    body: "Support with medical visas, flights, accommodation and local transport arrangements.",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="9" r="2.3" />
      </svg>
    ),
  },
  {
    tint: "blue" as const,
    title: "Verified Specialists",
    body: "Every treating physician is credential-checked with specialty-specific outcome data reviewed.",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
  {
    tint: "lavender" as const,
    title: "Post-Treatment Follow-up",
    body: "Continued coordination with home-country physicians after the patient returns.",
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
];

const STEPS = [
  {
    title: "Share Medical Records",
    body: "Submit reports and history for a free clinical review by our specialist panel.",
  },
  {
    title: "Get Treatment Plan & Quote",
    body: "Receive a tailored plan with hospital options and a transparent cost estimate within 48 hours.",
  },
  {
    title: "Travel & Visa Support",
    body: "We arrange appointments, visa documentation, flights and accommodation.",
  },
  {
    title: "Treatment & Recovery",
    body: "Your coordinator is on the ground throughout treatment, discharge and recovery.",
  },
  {
    title: "Return & Follow-up",
    body: "We hand off records and continue follow-up with your home-country doctor.",
  },
];

const PROCEDURES = [
  { procedure: "Cardiac Bypass Surgery", savings: "Up to 65%" },
  { procedure: "Knee Replacement", savings: "Up to 60%" },
  { procedure: "Cancer Treatment", savings: "Up to 55%" },
  { procedure: "Spine Surgery", savings: "Up to 58%" },
  { procedure: "Fertility (IVF)", savings: "Up to 50%" },
];

export function PatientOverseasTreatmentContent() {
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
            <circle cx="12" cy="12" r="9" />
          </svg>
        }
        title="Overseas Treatment"
        description="Coordinated cross-border care for complex procedures — from destination selection and hospital matching to visas, travel and follow-up, we manage every step of your medical journey abroad."
        cta={{ href: "#apply", label: "Start a Treatment Request" }}
        icon={
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z" />
          </svg>
        }
      />

      <StatsRow items={OVERSEAS_STATS} />

      <PgSection>
        <SectionHeader
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 21c-4-3-8-6.5-8-11a8 8 0 0 1 16 0c0 4.5-4 8-8 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          }
          title="Destination Countries"
          sub="Cost of care vs. home country, by destination"
        />
        <CountryGrid countries={COUNTRIES} />
      </PgSection>

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
          title="Why Choose Overseas Treatment With Us"
        />
        <FeatureGrid items={WHY_FEATURES} />
      </PgSection>

      <PgPanels>
        <PgSection className="mb-0">
          <SectionHeader
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M13 2L3 14h7l-1 8 11-14h-7z" />
              </svg>
            }
            title="How It Works"
          />
          <StepsList steps={STEPS} />
        </PgSection>
        <PgSection className="mb-0">
          <SectionHeader
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8" />
              </svg>
            }
            title="Popular Procedures"
          />
          <ProcedureTable rows={PROCEDURES} />
        </PgSection>
      </PgPanels>

      <PgSection id="apply">
        <SectionHeader
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          }
          title="Apply for Overseas Treatment"
          sub="Tell us about your case — a coordinator will respond within 48 hours"
        />

        <PgForm
          successTitle="Application Received"
          successMessage="Thank you — a treatment coordinator will review your case and reach out within 48 hours with a personalized plan and quote."
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
            <FieldLabel variant="soft">Country of Residence</FieldLabel>
            <Input variant="soft" type="text" placeholder="e.g. India" />
          </PgField>
          <PgField>
            <FieldLabel variant="soft">Preferred Destination</FieldLabel>
            <CareaiSelect
              appearance="pg"
              defaultValue=""
              placeholder="Select a country"
              options={careaiOptionsFromLabels(
                [
                  "India",
                  "Turkey",
                  "Thailand",
                  "UAE",
                  "Germany",
                  "Not sure — recommend one",
                ],
                { label: "Select a country" },
              )}
            />
          </PgField>
          <PgField>
            <FieldLabel variant="soft">
              Procedure / Condition <Required />
            </FieldLabel>
            <Input
              variant="soft"
              type="text"
              placeholder="e.g. Cardiac Bypass Surgery"
              required
            />
          </PgField>
          <PgField className="col-span-full">
            <FieldLabel htmlFor="overseas-med-upload" variant="soft">
              Medical Reports (optional)
            </FieldLabel>
            <PgUpload htmlFor="overseas-med-upload">
              <FileInput
                id="overseas-med-upload"
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
                scans & prescriptions here
              </p>
            </PgUpload>
          </PgField>
          <PgField className="col-span-full">
            <FieldLabel variant="soft">Additional Notes</FieldLabel>
            <Textarea
              variant="soft"
              placeholder="Share any details that will help us plan your treatment — preferred travel dates, budget range, companion travel, etc."
            />
          </PgField>
          <div className="col-span-full">
            <PgSubmitButton>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              Submit Application
            </PgSubmitButton>
            <FormConfidentialNote>
              Your information is kept confidential and shared only with your
              care team.
            </FormConfidentialNote>
          </div>
        </PgForm>
      </PgSection>
    </>
  );
}
