import Link from "next/link";

import { PatientDateBadge } from "@/components/portal/patient-date-badge";
import { PortalContent } from "@/components/portal/portal-content";
import { UserField } from "@/components/portal/portal-user-field";
import { Panel, PanelIcon, PanelTitle } from "@/components/ui/panel";
import { portalAgentEyebrow, portalH1 } from "@/components/ui/typography";
import { careaiMockMember } from "@/config/careai-mock";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

const portalPatientDashboard = {
  content:
    "px-9 pb-[60px] pt-8 max-[640px]:px-4 max-[640px]:pb-12 max-[640px]:pt-5 max-[900px]:overflow-x-clip",
  eyebrow: portalAgentEyebrow,
  h1: cn(portalH1, "mb-0"),
  statBar: (tone: "grad1" | "grad2" | "grad3") =>
    cn(
      "h-[5px] w-full",
      tone === "grad1" &&
        "bg-[linear-gradient(90deg,var(--color-care-pink),var(--color-care-purple))]",
      tone === "grad2" && "bg-[linear-gradient(90deg,#0ea5a0,#16a34a)]",
      tone === "grad3" && "bg-[linear-gradient(90deg,#f59e0b,#e8774a)]",
    ),
  statIcon: (tone: "tint1" | "tint2" | "tint3") =>
    cn(
      "flex size-[52px] shrink-0 items-center justify-center rounded-[14px]",
      "[&_svg]:size-6",
      tone === "tint1" && "bg-[#f1e9fe]",
      tone === "tint2" && "bg-[#dff7ee]",
      tone === "tint3" && "bg-[#fdecd8]",
    ),
  statFoot: (tone: "c1" | "c2" | "c3") =>
    cn(
      "flex items-center gap-1.5 text-[12.5px] font-bold",
      tone === "c1" && "text-care-purple",
      tone === "c2" && "text-care-green",
      tone === "c3" && "text-[#b8720a]",
    ),
  svcIcon: (tone: "s1" | "s2" | "s3" | "s4" | "s5" | "s6") =>
    cn(
      "flex size-16 shrink-0 items-center justify-center rounded-2xl",
      "[&_svg]:size-8",
      tone === "s1" && "bg-[#ede6fb]",
      tone === "s2" && "bg-[#fce7f3]",
      tone === "s3" && "bg-[#e0eefc]",
      tone === "s4" && "bg-[#fdecd8]",
      tone === "s5" && "bg-[#dff7ee]",
      tone === "s6" && "bg-[#f1e9fe]",
    ),
  remIcon: (tone: "amber" | "purple" | "green" | "coral") =>
    cn(
      "flex size-[38px] shrink-0 items-center justify-center rounded-[10px]",
      "[&_svg]:size-[17px]",
      tone === "amber" && "bg-[#fef3e0] text-[#b8720a]",
      tone === "purple" && "bg-[#f1e9fe] text-care-purple",
      tone === "green" && "bg-[#e4f8ee] text-care-green",
      tone === "coral" && "bg-[#fce4da] text-care-coral",
    ),
  remTime: (tone: "amber" | "purple" | "green" | "coral") =>
    cn(
      "shrink-0 rounded-[20px] px-2.5 py-[5px] text-[11.5px] font-bold text-white",
      tone === "amber" && "bg-[#f59e0b]",
      tone === "purple" && "bg-care-purple",
      tone === "green" && "bg-care-green",
      tone === "coral" && "bg-care-coral",
    ),
} as const;

export function PatientDashboardContent() {
  return (
    <PortalContent>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className={portalPatientDashboard.eyebrow}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l1.7 6.6L20 10l-6.3 1.4L12 18l-1.7-6.6L4 10l6.3-1.4z" />
            </svg>
            Hello, Welcome Back
          </div>
          <h1 className={portalPatientDashboard.h1}>
            Good Morning,{" "}
            <span>
              <UserField
                field="firstName"
                fallback={careaiMockMember.displayName}
              />
            </span>
          </h1>
        </div>
        <PatientDateBadge />
      </div>

      <div className="mb-7 grid grid-cols-3 gap-5 max-[1100px]:grid-cols-1">
        <div className="overflow-hidden rounded-[18px] border border-care-line bg-white shadow-care">
          <div className={portalPatientDashboard.statBar("grad1")} />
          <div className="flex items-start gap-4 px-6 py-[22px]">
            <div className={portalPatientDashboard.statIcon("tint1")}>
              <svg
                fill="none"
                stroke="#6B2FD9"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4M9 11V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-8z" />
              </svg>
            </div>
            <div>
              <div className="mb-1 text-[11.5px] font-bold tracking-[0.06em] text-[#9c97ac] uppercase">
                Total Requests
              </div>
              <div className="mb-1.5 text-[30px] leading-[1.1] font-extrabold">
                24
              </div>
              <div className={portalPatientDashboard.statFoot("c1")}>
                ↗ All time
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-[18px] border border-care-line bg-white shadow-care">
          <div className={portalPatientDashboard.statBar("grad2")} />
          <div className="flex items-start gap-4 px-6 py-[22px]">
            <div className={portalPatientDashboard.statIcon("tint2")}>
              <svg
                fill="none"
                stroke="#0F9D58"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="mb-1 text-[11.5px] font-bold tracking-[0.06em] text-[#9c97ac] uppercase">
                Closed Requests
              </div>
              <div className="mb-1.5 text-[30px] leading-[1.1] font-extrabold">
                18
              </div>
              <div className={portalPatientDashboard.statFoot("c2")}>
                ✓ 75% resolved
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-[18px] border border-care-line bg-white shadow-care">
          <div className={portalPatientDashboard.statBar("grad3")} />
          <div className="flex items-start gap-4 px-6 py-[22px]">
            <div className={portalPatientDashboard.statIcon("tint3")}>
              <svg
                fill="none"
                stroke="#B8720A"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <div className="mb-1 text-[11.5px] font-bold tracking-[0.06em] text-[#9c97ac] uppercase">
                In Progress Request
              </div>
              <div className="mb-1.5 text-[30px] leading-[1.1] font-extrabold">
                6
              </div>
              <div className={portalPatientDashboard.statFoot("c3")}>
                🕐 Being handled
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1.5fr_1fr] gap-5 max-[1100px]:grid-cols-1 [&>*]:min-w-0">
        <Panel>
          <div className="mb-[18px] flex items-center justify-between">
            <PanelTitle>
              <PanelIcon>
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
              </PanelIcon>
              Our Services
            </PanelTitle>
          </div>
          <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-2">
            <Link
              href={ROUTES.patient.overseasTreatment}
              className="flex flex-col items-center gap-3.5 rounded-2xl border border-care-line px-4 py-[22px] text-center transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
            >
              <div className={portalPatientDashboard.svcIcon("s1")}>
                <svg fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#6B2FD9"
                    strokeWidth="1.7"
                  />
                  <path stroke="#6B2FD9" strokeWidth="1.7" d="M3 12h18" />
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.7"
                    d="M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"
                  />
                  <path
                    fill="#D6238C"
                    d="M11 10.6h2v1h.7v1.1H13v1.1h-2v-1.1h-.7v-1.1H11z"
                  />
                </svg>
              </div>
              <div className="text-[14.5px] leading-tight font-bold">
                Overseas Treatment
              </div>
            </Link>
            <Link
              href={ROUTES.patient.consultExpert}
              className="flex flex-col items-center gap-3.5 rounded-2xl border border-care-line px-4 py-[22px] text-center transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
            >
              <div className={portalPatientDashboard.svcIcon("s2")}>
                <svg fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="9"
                    cy="8"
                    r="3.5"
                    stroke="#D6238C"
                    strokeWidth="1.7"
                  />
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.7"
                    d="M3.5 21v-1a6 6 0 0 1 6-6"
                  />
                  <rect
                    x="12.5"
                    y="9"
                    width="9"
                    height="6.5"
                    rx="1.6"
                    fill="#6B2FD9"
                  />
                  <path
                    d="M15 12h4M15 13.8h2.5"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="text-[14.5px] leading-tight font-bold">
                Consult an Expert
              </div>
            </Link>
            <Link
              href={ROUTES.patient.secondOpinion}
              className="flex flex-col items-center gap-3.5 rounded-2xl border border-care-line px-4 py-[22px] text-center transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
            >
              <div className={portalPatientDashboard.svcIcon("s3")}>
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="#6B2FD9"
                    strokeWidth="1.7"
                    d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"
                  />
                  <path stroke="#6B2FD9" strokeWidth="1.5" d="M14 3.5v4h4" />
                  <circle cx="12" cy="14" r="3.4" fill="#D6238C" />
                  <path
                    d="M10.7 14l1 1 1.8-1.8"
                    stroke="#fff"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-[14.5px] leading-tight font-bold">
                Second Opinion
              </div>
            </Link>
            <Link
              href={ROUTES.patient.educationPrevention}
              className="flex flex-col items-center gap-3.5 rounded-2xl border border-care-line px-4 py-[22px] text-center transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
            >
              <div className={portalPatientDashboard.svcIcon("s4")}>
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.7"
                    d="M12 6.2l8.5 3.6-8.5 3.6-8.5-3.6z"
                  />
                  <path
                    stroke="#6B2FD9"
                    strokeWidth="1.7"
                    d="M6.5 11.2v4.4c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.4"
                  />
                  <path stroke="#D6238C" strokeWidth="1.5" d="M20.5 9.8v5" />
                </svg>
              </div>
              <div className="text-[14.5px] leading-tight font-bold">
                Education Prevention
              </div>
            </Link>
            <Link
              href={ROUTES.patient.contactUs}
              className="flex flex-col items-center gap-3.5 rounded-2xl border border-care-line px-4 py-[22px] text-center transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
            >
              <div className={portalPatientDashboard.svcIcon("s5")}>
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.7"
                    d="M4 5.5h16v11H8l-4 3.5z"
                  />
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    d="M8 10h8M8 13h5"
                  />
                </svg>
              </div>
              <div className="text-[14.5px] leading-tight font-bold">
                Contact Us
              </div>
            </Link>
            <Link
              href="#"
              className={cn(
                "flex flex-col items-center gap-3.5 rounded-2xl border border-care-line px-4 py-[22px] text-center transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]",
                "border-[1.5px] border-dashed border-[#c9beea] bg-[#fbf9ff] [&_.qa-text]:text-care-purple",
              )}
            >
              <div className={portalPatientDashboard.svcIcon("s6")}>
                <svg fill="#6B2FD9" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="2" />
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="18" cy="6" r="2" />
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                </svg>
              </div>
              <div>
                <div
                  className={cn(
                    "text-[14.5px] leading-tight font-bold",
                    "qa-text",
                  )}
                >
                  View All
                </div>
                <div className="text-xs font-medium text-care-sub">
                  All services
                </div>
              </div>
            </Link>
          </div>
        </Panel>

        <Panel>
          <div className="mb-[18px] flex items-center justify-between">
            <PanelTitle>
              <PanelIcon>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </PanelIcon>
              Reminders
            </PanelTitle>
            <Link
              href="#"
              className="flex shrink-0 items-center gap-[5px] rounded-[20px] bg-[#f1e9fe] px-3.5 py-[7px] text-[13px] font-bold whitespace-nowrap text-care-purple [&_svg]:size-[13px]"
            >
              See all{" "}
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          <div className="flex flex-col border-t border-care-line">
            <div className="flex items-center gap-3 border-b border-care-line py-3.5 last:border-b-0">
              <div className={portalPatientDashboard.remIcon("amber")}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 3h12l4 6-10 12L2 9z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">
                  Blood Test — Apollo Diagnostics
                </div>
                <div className="mt-px text-xs text-care-sub">New Delhi</div>
              </div>
              <div className={portalPatientDashboard.remTime("amber")}>
                9:00 AM
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-care-line py-3.5 last:border-b-0">
              <div className={portalPatientDashboard.remIcon("purple")}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">
                  Medication — Vitamin D
                </div>
                <div className="mt-px text-xs text-care-sub">
                  Take with breakfast
                </div>
              </div>
              <div className={portalPatientDashboard.remTime("purple")}>
                11:00 AM
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-care-line py-3.5 last:border-b-0">
              <div className={portalPatientDashboard.remIcon("green")}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">
                  Video Consult — Dr. Sharma
                </div>
                <div className="mt-px text-xs text-care-sub">
                  Cardiology follow-up
                </div>
              </div>
              <div className={portalPatientDashboard.remTime("green")}>
                3:30 PM
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-care-line py-3.5 last:border-b-0">
              <div className={portalPatientDashboard.remIcon("coral")}>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 2h6v4H9z" />
                  <rect x="5" y="4" width="14" height="18" rx="2" />
                  <path d="M9 12h6M9 16h6" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">Upload MRI Report</div>
                <div className="mt-px text-xs text-care-sub">
                  Required for REQ-2241
                </div>
              </div>
              <div className={portalPatientDashboard.remTime("coral")}>
                5:00 PM
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </PortalContent>
  );
}
