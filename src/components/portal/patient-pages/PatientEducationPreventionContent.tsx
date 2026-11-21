import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import {
  ArticleGrid,
  FormConfidentialNote,
  portalPgBtnClass,
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
  PgSection,
  Required,
} from "@/components/portal/patient-pages/pg-primitives";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";

export function PatientEducationPreventionContent() {
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
            <path d="M12 4l9 4-9 4-9-4z" />
          </svg>
        }
        title="Education & Prevention"
        description="Practical, doctor-reviewed guides and screening reminders that help patients understand risk factors early and avoid conditions before they become serious."
        actions={
          <>
            <a href="#library" className={portalPgBtnClass()}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              Browse Health Library
            </a>
            <a href="#ask" className={portalPgBtnClass("outline")}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 1.8-2 3.5" />
                <path d="M12 17h.01" />
              </svg>
              Ask a Question
            </a>
          </>
        }
        icon={
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 4l9 4-9 4-9-4z" />
            <path d="M6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
          </svg>
        }
      />

      <StatsRow
        items={[
          { num: "80+", lbl: "Health Guides" },
          { num: "12", lbl: "Specialty Topics" },
          { num: "Weekly", lbl: "New Content" },
          { num: "Free", lbl: "For All Patients" },
        ]}
      />

      <PgSection id="library">
        <SectionHeader
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          }
          title="Featured Health Guides"
        />
        <ArticleGrid
          items={[
            {
              image: "/images/patient/BuildingaHeart.png",
              alt: "Building a Heart",
              tag: "Cardiology",
              title: "Early Signs of Heart Disease You Shouldn't Ignore",
              body: "Key risk factors and symptoms worth discussing with a doctor early.",
              readTime: "6 min read",
              reviewer: "Reviewed by Dr. Sharma",
            },
            {
              image: "/images/patient/CancerScreening.png",
              alt: "Cancer Screening",
              tag: "Oncology",
              title: "Cancer Screening Guidelines by Age",
              body: "What screenings are recommended and when to start them.",
              readTime: "8 min read",
              reviewer: "Reviewed by Dr. Khan",
            },
            {
              image: "/images/patient/EarlySigns.png",
              alt: "Early Signs",
              tag: "Nutrition",
              title: "Building a Heart-Healthy Diet Plan",
              body: "Simple, sustainable food swaps that lower long-term risk.",
              readTime: "5 min read",
              reviewer: "Reviewed by Dietitian Team",
            },
            {
              image: "/images/patient/PreventingJoint.png",
              alt: "Preventing Joint Pain",
              tag: "Orthopedics",
              title: "Preventing Joint Pain Before It Starts",
              body: "Everyday habits that protect knees, hips and the spine.",
              readTime: "4 min read",
              reviewer: "Reviewed by Dr. Patel",
            },
          ]}
        />
      </PgSection>

      <PgSection id="ask">
        <SectionHeader
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 1.8-2 3.5" />
              <path d="M12 17h.01" />
            </svg>
          }
          title="Ask a Health Question"
          sub="Get a free, doctor-reviewed answer or request a preventive-care consultation"
        />

        <PgForm
          successTitle="Question Submitted"
          successMessage="Thank you — one of our reviewing physicians will get back to you by email, usually within 2 business days."
        >
          <PgField>
            <FieldLabel variant="soft">
              Full Name <Required />
            </FieldLabel>
            <Input
              variant="soft"
              type="text"
              placeholder="Your full name"
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
            <FieldLabel variant="soft">Phone Number</FieldLabel>
            <Input variant="soft" type="tel" placeholder="+91 98765 43210" />
          </PgField>
          <PgField>
            <FieldLabel variant="soft">Topic of Interest</FieldLabel>
            <CareaiSelect
              appearance="pg"
              defaultValue="Heart Health"
              options={careaiOptionsFromLabels([
                "Heart Health",
                "Cancer Awareness",
                "Diabetes Care",
                "Bone & Joint Health",
                "Mental Wellness",
                "Women's Health",
                "Child Health",
                "Nutrition",
                "Fitness",
                "Senior Care",
              ])}
            />
          </PgField>
          <PgField className="col-span-full">
            <FieldLabel variant="soft">
              Your Question <Required />
            </FieldLabel>
            <Textarea
              variant="soft"
              placeholder="What would you like our specialists to answer?"
              required
            />
          </PgField>
          <PgField className="col-span-full">
            <label className="flex cursor-pointer items-center gap-2 font-semibold text-care-ink">
              <input type="checkbox" defaultChecked />
              Send me weekly preventive-care tips and new health guides
            </label>
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
              Send My Question
            </PgSubmitButton>
            <FormConfidentialNote>
              Answers are reviewed by a licensed physician, usually within 2
              business days.
            </FormConfidentialNote>
          </div>
        </PgForm>
      </PgSection>
    </>
  );
}
