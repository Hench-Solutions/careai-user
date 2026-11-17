"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  careaiMockAgentDashboardActions,
  careaiMockAgentDashboardStats,
} from "@/config/careai-mock";
import { ROUTES } from "@/config/routes";
import { useMockFeedback } from "@/hooks/use-mock-feedback";
import { readCareaiMockStat } from "@/lib/careai/mock-stat";

import { AgentActionWidgetIcon } from "./agent-action-widget-icon";
import { PortalMockBanner } from "./portal-mock-banner";

type AgentDashboardContentProps = {
  searchQuery?: string;
};

function priorityTimeClass(priority: "High" | "Medium" | "Low") {
  if (priority === "High") return "lm-rem-time amber";
  if (priority === "Medium") return "lm-rem-time purple";
  return "lm-rem-time green";
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
    <div className="lm-content">
      <PortalMockBanner message={message} />
      <div className="lm-eyebrow">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l1.7 6.6L20 10l-6.3 1.4L12 18l-1.7-6.6L4 10l6.3-1.4z" />
        </svg>
        Hello, Welcome
      </div>
      <h1 className="lm-h1">
        Business <span>Account</span>
      </h1>

      <div className="lm-stats">
        <Link
          href={ROUTES.agent.caseStatus}
          className="lm-stat blue lm-stat-link"
        >
          <div className="lm-stat-top">
            <div className="lm-stat-icon">
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
          <div className="lm-stat-num">{totalCases.value}</div>
          <div className="lm-stat-label">Total of Cases</div>
          <div className="lm-stat-badge">{totalCases.badge}</div>
        </Link>
        <Link
          href={ROUTES.agent.caseStatus}
          className="lm-stat purple lm-stat-link"
        >
          <div className="lm-stat-top">
            <div className="lm-stat-icon">
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
          <div className="lm-stat-num">{activeCases.value}</div>
          <div className="lm-stat-label">Active Cases</div>
          <div className="lm-stat-badge">{activeCases.badge}</div>
        </Link>
        <Link
          href={ROUTES.agent.caseStatus}
          className="lm-stat green lm-stat-link"
        >
          <div className="lm-stat-top">
            <div className="lm-stat-icon">
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
          <div className="lm-stat-num">{closedCases.value}</div>
          <div className="lm-stat-label">Closed Cases</div>
          <div className="lm-stat-badge">{closedCases.badge}</div>
        </Link>
      </div>

      <div className="lm-panels">
        {quickActionsVisible ?
          <div className="lm-panel">
            <div className="lm-panel-head">
              <div className="lm-panel-title">
                <div className="lm-panel-title-icon">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h7l-1 8 11-14h-7z" />
                  </svg>
                </div>
                Quick Action
              </div>
            </div>
            <div className="lm-qa-grid">
              <Link href={ROUTES.agent.newRegistration} className="lm-qa-card">
                <div className="lm-qa-icon">
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
                <div className="lm-qa-text">New Registration</div>
              </Link>
              <Link href={ROUTES.agent.referralInvoice} className="lm-qa-card">
                <div className="lm-qa-icon">
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
                <div className="lm-qa-text">Referral &amp; Invoice</div>
              </Link>
              <Link href={ROUTES.agent.caseStatus} className="lm-qa-card">
                <div className="lm-qa-icon">
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
                <div className="lm-qa-text">Case Status</div>
              </Link>
              <Link href={ROUTES.agent.actionRequired} className="lm-qa-card">
                <div className="lm-qa-icon">
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
                <div className="lm-qa-text">Action Required</div>
              </Link>
            </div>
          </div>
        : null}

        <div className="lm-panel">
          <div className="lm-panel-head">
            <div className="lm-panel-title">
              <div className="lm-panel-title-icon">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              Action Required
            </div>
            <Link href={ROUTES.agent.actionRequired} className="lm-seeall">
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
          <div className="lm-reminders">
            {actions.length === 0 ?
              <p className="lm-sub" style={{ margin: 0 }}>
                No matching action items for your search.
              </p>
            : actions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="lm-reminder lm-reminder-btn"
                  onClick={() => {
                    showFeedback(`Opening “${item.title}” (demo).`);
                    router.push(ROUTES.agent.actionRequired);
                  }}
                >
                  <div className={`lm-rem-icon ${item.iconTone}`}>
                    <AgentActionWidgetIcon kind={item.widgetIcon} />
                  </div>
                  <div className="lm-rem-body">
                    <div className="lm-rem-title">{item.title}</div>
                    <div className="lm-rem-sub">{item.subtitle}</div>
                  </div>
                  <div className={priorityTimeClass(item.priority)}>
                    {item.priority}
                  </div>
                </button>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
