import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import {
  ContactCards,
  portalPgBtnClass,
  SectionHeader,
  ServiceHero,
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
} from "@/components/portal/patient-pages/pg-primitives";
import { FieldLabel, Input, Textarea } from "@/components/ui/field";

export function PatientContactUsContent() {
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
            <path d="M4 4h16v12H7l-3 3z" />
          </svg>
        }
        title="Contact Us"
        description="Questions about a case, a request, or getting started? Our support team responds within one business day — or reach out instantly on chat."
        actions={
          <a href="#form" className={portalPgBtnClass()}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v12H7l-3 3z" />
            </svg>
            Send a Message
          </a>
        }
        icon={
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M4 4h16v12H7l-3 3z" />
            <path d="M8 9h8M8 12h5" />
          </svg>
        }
      />

      <ContactCards
        items={[
          {
            tint: "purple",
            icon: (
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z" />
              </svg>
            ),
            title: "Call Us",
            note: "Mon–Friday, 9am–7pm",
            link: { href: "tel:+971585840733", label: "+971 58 584 0733" },
          },
          {
            tint: "pink",
            icon: (
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M4 6l8 7 8-7" />
              </svg>
            ),
            title: "Email Us",
            note: "We reply within 24 hours",
            link: {
              href: "mailto:support@careai.tech",
              label: "info@careaitech.com",
            },
          },
        ]}
      />

      <PgPanels contact>
        <PgSection id="form" className="mb-0">
          <SectionHeader
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h16v12H7l-3 3z" />
              </svg>
            }
            title="Send Us a Message"
          />
          <PgForm
            successTitle="Message Sent"
            successMessage="Thank you — our support team will get back to you within one business day."
          >
            <PgField>
              <FieldLabel variant="soft">Full Name</FieldLabel>
              <Input variant="soft" type="text" placeholder="Your name" />
            </PgField>
            <PgField>
              <FieldLabel variant="soft">Email Address</FieldLabel>
              <Input
                variant="soft"
                type="email"
                placeholder="you@example.com"
              />
            </PgField>
            <PgField>
              <FieldLabel variant="soft">Phone Number</FieldLabel>
              <Input variant="soft" type="tel" placeholder="+91 98765 43210" />
            </PgField>
            <PgField>
              <FieldLabel variant="soft">Reason for Contact</FieldLabel>
              <CareaiSelect
                appearance="pg"
                defaultValue="General Inquiry"
                options={careaiOptionsFromLabels([
                  "General Inquiry",
                  "Overseas Treatment",
                  "Consult an Expert",
                  "Second Opinion",
                  "Billing",
                ])}
              />
            </PgField>
            <PgField className="col-span-full">
              <FieldLabel variant="soft">Message</FieldLabel>
              <Textarea variant="soft" placeholder="How can we help?" />
            </PgField>
            <div className="col-span-full">
              <PgSubmitButton>Submit Message</PgSubmitButton>
            </div>
          </PgForm>
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
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" />
              </svg>
            }
            title="Response Times"
          />
          <StepsList
            steps={[
              {
                title: "Live Chat",
                body: "Instant response during business hours.",
              },
              {
                title: "Phone Support",
                body: "Answered immediately, Mon–Sat 9am–7pm IST.",
              },
              {
                title: "Email & Contact Form",
                body: "Replies within 24 hours on business days.",
              },
            ]}
          />
        </PgSection>
      </PgPanels>
    </>
  );
}
