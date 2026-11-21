"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { portalPrimaryLinkText } from "@/components/ui/button";
import { Panel, PanelIcon, PanelTitle } from "@/components/ui/panel";
import {
  portalAgentEyebrow,
  portalH1,
  portalSub,
} from "@/components/ui/typography";
import {
  careaiMockAgentDashboardActions,
  careaiMockAgentDashboardStats,
} from "@/config/careai-mock";
import { ROUTES } from "@/config/routes";
import { useMockFeedback } from "@/hooks/use-mock-feedback";
import { readCareaiMockStat } from "@/lib/careai/mock-stat";
import { cn } from "@/lib/utils";

import { AgentActionWidgetIcon } from "./agent-action-widget-icon";
import { PortalMockBanner } from "./portal-mock-banner";

const portalAgentDashboard = {
  statCard: (tone: "blue" | "purple" | "green") =>
    cn(
      "flex flex-col gap-3.5 rounded-[18px] p-[22px_24px] text-white shadow-care",
      "transition-[transform,box-shadow] duration-150 ease-in-out",
      "hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(42,32,84,0.12)]",
      portalPrimaryLinkText,
      tone === "blue" && "bg-[linear-gradient(135deg,#2b8fe0,#1f6fc4)]",
      tone === "purple" && "bg-[linear-gradient(135deg,#8b5cf6,#6b2fd9)]",
      tone === "green" && "bg-[linear-gradient(135deg,#22b573,#0f9d58)]",
    ),
  remIcon: (tone: "amber" | "purple" | "green") =>
    cn(
      "flex size-[38px] shrink-0 items-center justify-center rounded-[10px] [&_svg]:size-[17px]",
      tone === "amber" && "bg-[#fef3e0] text-[#b8720a]",
      tone === "purple" && "bg-[#f1e9fe] text-care-purple",
      tone === "green" && "bg-[#e4f8ee] text-care-green",
    ),
  remTime: (priority: "High" | "Medium" | "Low") =>
    cn(
      "shrink-0 rounded-[20px] px-2.5 py-[5px] text-[11.5px] font-bold text-white",
      priority === "High" && "bg-[#f59e0b]",
      priority === "Medium" && "bg-care-purple",
      priority === "Low" && "bg-care-green",
    ),
} as const;

type AgentDashboardContentProps = {
  searchQuery?: string;
};

function remIconTone(tone: string): "amber" | "purple" | "green" {
  if (tone === "amber") return "amber";
  if (tone === "green") return "green";
  return "purple";
}

export function AgentDashboardContent({
  searchQuery = "",
}: AgentDashboardContentProps) {
  const router = useRouter();
  const { message, showFeedback } = useMockFeedback();

  const totalCases = readCareaiMockStat(
    careaiMockAgentDashboardStats.totalCases,
  );
  const activeCases = readCareaiMockStat(
    careaiMockAgentDashboardStats.activeCases,
  );
  const closedCases = readCareaiMockStat(
    careaiMockAgentDashboardStats.closedCases,
  );

  const actions = useMemo(() => {
    if (!searchQuery) return careaiMockAgentDashboardActions;
    return careaiMockAgentDashboardActions.filter((item) => {
      const haystack =
        `${item.title} ${item.subtitle} ${item.priority}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  }, [searchQuery]);

  const quickActionsVisible = useMemo(() => {
    if (!searchQuery) return true;
    const labels = [
      "case registration",
      "referral invoice",
      "case status",
      "action required",
    ];
    return labels.some((label) => label.includes(searchQuery));
  }, [searchQuery]);

  return (
    <div className="px-9 pt-8 pb-[60px] max-[900px]:overflow-x-clip max-[640px]:px-4 max-[640px]:pt-5 max-[640px]:pb-12">
      <PortalMockBanner message={message} />
      <div className={portalAgentEyebrow}>
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l1.7 6.6L20 10l-6.3 1.4L12 18l-1.7-6.6L4 10l6.3-1.4z" />
        </svg>
        Hello, Welcome
      </div>
      <h1 className={portalH1}>
        Business <span>Account</span>
      </h1>

      <div className="mb-7 grid grid-cols-3 gap-5 max-[1100px]:grid-cols-1 [&>*]:min-w-0">
        <Link
          href={ROUTES.agent.caseStatus}
          className={portalAgentDashboard.statCard("blue")}
        >
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-[11px] bg-white/[0.22] [&_svg]:size-5">
              <svg
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
          </div>
          <div className="[font-feature-settings:normal] text-[30px] font-extrabold">
            {totalCases.value}
          </div>
          <div className="mt-[-8px] text-[13.5px] leading-normal opacity-[0.92]">
            Total of Cases
          </div>
          <div className="self-start rounded-[20px] bg-white/[0.24] px-2.5 py-1 text-[11.5px] leading-normal font-bold">
            {totalCases.badge}
          </div>
        </Link>
        <Link
          href={ROUTES.agent.caseStatus}
          className={portalAgentDashboard.statCard("purple")}
        >
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-[11px] bg-white/[0.22] [&_svg]:size-5">
              <svg
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
              </svg>
            </div>
          </div>
          <div className="[font-feature-settings:normal] text-[30px] font-extrabold">
            {activeCases.value}
          </div>
          <div className="mt-[-8px] text-[13.5px] leading-normal opacity-[0.92]">
            Active Cases
          </div>
          <div className="self-start rounded-[20px] bg-white/[0.24] px-2.5 py-1 text-[11.5px] leading-normal font-bold">
            {activeCases.badge}
          </div>
        </Link>
        <Link
          href={ROUTES.agent.caseStatus}
          className={portalAgentDashboard.statCard("green")}
        >
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-[11px] bg-white/[0.22] [&_svg]:size-5">
              <svg
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
          </div>
          <div className="[font-feature-settings:normal] text-[30px] font-extrabold">
            {closedCases.value}
          </div>
          <div className="mt-[-8px] text-[13.5px] leading-normal opacity-[0.92]">
            Closed Cases
          </div>
          <div className="self-start rounded-[20px] bg-white/[0.24] px-2.5 py-1 text-[11.5px] leading-normal font-bold">
            {closedCases.badge}
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-[1.5fr_1fr] gap-5 max-[1100px]:grid-cols-1 [&>*]:min-w-0">
        {quickActionsVisible ?
          <Panel>
            <div className="mb-[18px] flex items-center justify-between">
              <PanelTitle>
                <PanelIcon>
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h7l-1 8 11-14h-7z" />
                  </svg>
                </PanelIcon>
                Quick Action
              </PanelTitle>
            </div>
            <div className="grid grid-cols-2 gap-3.5 max-[640px]:grid-cols-1 [&>*]:min-w-0">
              <Link
                href={ROUTES.agent.newRegistration}
                className="flex items-center gap-3 rounded-[14px] border border-care-line p-4 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-care-grad [&_svg]:size-[21px]">
                  <svg
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6M22 11h-6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 text-[14.5px] leading-tight font-bold min-[641px]:whitespace-nowrap">
                  New Registration
                </div>
              </Link>
              <Link
                href={ROUTES.agent.referralInvoice}
                className="flex items-center gap-3 rounded-[14px] border border-care-line p-4 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-care-grad [&_svg]:size-[21px]">
                  <svg
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 text-[14.5px] leading-tight font-bold min-[641px]:whitespace-nowrap">
                  Referral &amp; Invoice
                </div>
              </Link>
              <Link
                href={ROUTES.agent.caseStatus}
                className="flex items-center gap-3 rounded-[14px] border border-care-line p-4 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-care-grad [&_svg]:size-[21px]">
                  <svg
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="4" width="20" height="13" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 text-[14.5px] leading-tight font-bold min-[641px]:whitespace-nowrap">
                  Case Status
                </div>
              </Link>
              <Link
                href={ROUTES.agent.actionRequired}
                className="flex items-center gap-3 rounded-[14px] border border-care-line p-4 transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.14)]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-care-grad [&_svg]:size-[21px]">
                  <svg
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 text-[14.5px] leading-tight font-bold min-[641px]:whitespace-nowrap">
                  Action Required
                </div>
              </Link>
            </div>
          </Panel>
        : null}

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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </PanelIcon>
              Action Required
            </PanelTitle>
            <Link
              href={ROUTES.agent.actionRequired}
              className="flex shrink-0 items-center gap-[5px] rounded-[20px] bg-[#f1e9fe] px-3.5 py-[7px] text-[13px] font-bold whitespace-nowrap text-care-ink [&_svg]:size-[13px]"
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
          <div className="flex flex-col gap-3.5">
            {actions.length === 0 ?
              <p className={cn(portalSub, "mb-0")}>
                No matching action items for your search.
              </p>
            : actions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-none bg-transparent p-0 text-left font-[inherit] text-inherit hover:bg-[#f6f5fb]"
                  onClick={() => {
                    showFeedback(`Opening “${item.title}” (demo).`);
                    router.push(ROUTES.agent.actionRequired);
                  }}
                >
                  <div
                    className={portalAgentDashboard.remIcon(
                      remIconTone(item.iconTone),
                    )}
                  >
                    <AgentActionWidgetIcon kind={item.widgetIcon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-bold">{item.title}</div>
                    <div className="mt-px text-xs text-care-sub">
                      {item.subtitle}
                    </div>
                  </div>
                  <div className={portalAgentDashboard.remTime(item.priority)}>
                    {item.priority}
                  </div>
                </button>
              ))
            }
          </div>
        </Panel>
      </div>
    </div>
  );
}
