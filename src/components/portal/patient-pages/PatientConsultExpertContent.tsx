"use client";

import { useCallback, useRef } from "react";

import type { CareaiSelectHandle } from "@/components/careai/careai-select";
import type { SpecialistProfile } from "@/components/portal/patient-pages/patient-page-blocks";

import { CareaiDateField } from "@/components/careai/careai-date-field";
import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import {
  DoctorGrid,
  FormConfidentialNote,
  SectionHeader,
  ServiceHero,
  SpecialtyBadges,
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
  Required,
} from "@/components/portal/patient-pages/pg-primitives";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";

const CONSULT_STATS = [
  { num: "180+", lbl: "Specialists Network" },
  { num: "22", lbl: "Specialties Covered" },
  { num: "<24h", lbl: "Avg. Response Time" },
  { num: "4.9/5", lbl: "Patient Rating" },
];

const SPECIALISTS: SpecialistProfile[] = [
  {
    initials: "RS",
    name: "Dr. R. Sharma",
    specialty: "Cardiology",
    meta: "18 yrs experience · Apollo Delhi",
    selectValue: "Dr. R. Sharma — Cardiology",
  },
  {
    initials: "AK",
    name: "Dr. A. Khan",
    specialty: "Oncology",
    meta: "15 yrs experience · Mayo Clinic AZ",
    selectValue: "Dr. A. Khan — Oncology",
  },
  {
    initials: "MP",
    name: "Dr. M. Patel",
    specialty: "Orthopedics",
    meta: "12 yrs experience · UAE Ortho Center",
    selectValue: "Dr. M. Patel — Orthopedics",
  },
  {
    initials: "LT",
    name: "Dr. L. Tan",
    specialty: "Neurology",
    meta: "20 yrs experience · Bangkok Hospital",
    selectValue: "Dr. L. Tan — Neurology",
  },
];

const CONSULT_STEPS = [
  {
    title: "Choose a Specialist",
    body: "Browse profiles by specialty, experience and hospital affiliation.",
  },
  {
    title: "Share Your Case",
    body: "Upload reports and describe symptoms so the specialist arrives prepared.",
  },
  {
    title: "Meet by Video or Phone",
    body: "Join a secure consultation at a time that works for you.",
  },
  {
    title: "Receive a Care Plan",
    body: "Get a written summary, recommendations and next steps.",
  },
];

const SPECIALTY_LABELS = [
  "Cardiology",
  "Oncology",
  "Orthopedics",
  "Neurology",
  "Spine Surgery",
  "Fertility",
  "Pediatrics",
  "Nephrology",
  "Gastroenterology",
  "Dermatology",
];

export function PatientConsultExpertContent() {
  const specialistRef = useRef<CareaiSelectHandle>(null);

  const prefillSpecialist = useCallback((value: string) => {
    specialistRef.current?.setValue(value);
    document
      .getElementById("book-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
            <circle cx="12" cy="8" r="4" />
          </svg>
        }
        title="Consult an Expert"
        description="Connect with board-certified specialists across cardiology, oncology, orthopedics and more — by video, phone, or in-person — usually within 24 hours."
        icon={
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <circle cx="9" cy="8" r="3.5" />
            <path d="M3 21v-1a6 6 0 0 1 6-6h0" />
            <rect x="12.5" y="9" width="9" height="6.5" rx="1.6" />
            <path d="M15 12h4M15 13.8h2.5" />
          </svg>
        }
      />

      <StatsRow items={CONSULT_STATS} />

      <PgSection id="book">
        <SectionHeader
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
            </svg>
          }
          title="Featured Specialists"
          sub="Pick a specialist and request a consultation"
        />
        <DoctorGrid doctors={SPECIALISTS} onSelect={prefillSpecialist} />
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
            title="How Consultations Work"
          />
          <StepsList steps={CONSULT_STEPS} />
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
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            }
            title="Specialties Available"
          />
          <SpecialtyBadges labels={SPECIALTY_LABELS} />
        </PgSection>
      </PgPanels>

      <PgSection id="book-form">
        <SectionHeader
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7V3M16 7V3M3 11h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
            </svg>
          }
          title="Book a Consultation"
          sub="Request a time and we'll confirm your appointment within 24 hours"
        />

        <PgForm
          successTitle="Consultation Requested"
          successMessage="Thank you — our team will confirm your appointment time and send joining details within 24 hours."
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
            <FieldLabel variant="soft">Preferred Specialist</FieldLabel>
            <CareaiSelect
              appearance="pg"
              ref={specialistRef}
              defaultValue=""
              placeholder="No preference — match me with the best fit"
              options={[
                {
                  value: "",
                  label: "No preference — match me with the best fit",
                },
                ...SPECIALISTS.map((s) => ({
                  value: s.selectValue,
                  label: s.selectValue,
                })),
              ]}
            />
          </PgField>
          <PgField>
            <FieldLabel variant="soft">
              Specialty Needed <Required />
            </FieldLabel>
            <CareaiSelect
              appearance="pg"
              required
              defaultValue=""
              placeholder="Select a specialty"
              options={careaiOptionsFromLabels(SPECIALTY_LABELS, {
                label: "Select a specialty",
              })}
            />
          </PgField>
          <PgField>
            <FieldLabel variant="soft">Preferred Date</FieldLabel>
            <CareaiDateField appearance="pg" />
          </PgField>
          <PgField>
            <FieldLabel variant="soft">Consultation Mode</FieldLabel>
            <CareaiSelect
              appearance="pg"
              defaultValue="Video Call"
              options={careaiOptionsFromLabels([
                "Video Call",
                "Phone Call",
                "In-Person",
              ])}
            />
          </PgField>
          <PgField className="col-span-full">
            <FieldLabel variant="soft">Reason for Consultation</FieldLabel>
            <Textarea
              variant="soft"
              placeholder="Briefly describe your symptoms or what you'd like to discuss"
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
                <path d="M8 7V3M16 7V3M3 11h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
              </svg>
              Request Consultation
            </PgSubmitButton>
            <FormConfidentialNote>
              Your details are shared only with your assigned specialist and
              coordinator.
            </FormConfidentialNote>
          </div>
        </PgForm>
      </PgSection>
    </>
  );
}
