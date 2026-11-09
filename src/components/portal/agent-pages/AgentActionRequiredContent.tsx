"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AgentActionWidgetIcon } from "@/components/portal/agent-action-widget-icon";
import { PortalMockBanner } from "@/components/portal/portal-mock-banner";
import { careaiMockAgentActionItems } from "@/config/careai-mock";
import { ROUTES } from "@/config/routes";
import { useMockFeedback } from "@/hooks/use-mock-feedback";

const PRIORITIES = ["All", "High", "Medium", "Low"] as const;

export function AgentActionRequiredContent() {
  const [filter, setFilter] = useState<(typeof PRIORITIES)[number]>("All");
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const { message, showFeedback } = useMockFeedback();
  const router = useRouter();

  const items = useMemo(
    () =>
      careaiMockAgentActionItems.filter((item) => {
        if (resolvedIds.includes(item.id)) return false;
        return filter === "All" || filter === item.priority;
      }),
    [filter, resolvedIds],
  );

  const markResolved = (id: string, feedback: string) => {
    showFeedback(feedback);
    setResolvedIds((prev) => [...prev, id]);
  };

  return (
    <>
      <PortalMockBanner message={message} />
      <h1 className="lm-h1">Action Required</h1>
      <p className="lm-sub">
        Items across your cases that are waiting on a decision, signature, or
        upload from you.
      </p>

      <div className="ar-filterbar">
        {PRIORITIES.map((label) => (
          <button
            key={label}
            type="button"
            className={filter === label ? "ar-chip active" : "ar-chip"}
            aria-pressed={filter === label}
            onClick={() => setFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ar-list">
        {items.length === 0 ?
          <p className="lm-sub">
            {resolvedIds.length > 0 ?
              "All visible items are handled for this filter (demo)."
            : "No items match this priority."}
          </p>
        : items.map((item) => (
            <div
              key={item.id}
              className={`ar-card ${item.priority.toLowerCase()}`}
            >
              <div className="ar-icon">
                <AgentActionWidgetIcon kind={item.widgetIcon} />
              </div>
              <div className="ar-body">
                <div className="ar-top">
                  <div className="ar-title">{item.cardTitle}</div>
                  <span className="ar-priority">{item.priority}</span>
                </div>
                <div className="ar-desc">{item.description}</div>
                <div className="ar-meta-row">
                  <div className="ar-tags">{item.tags}</div>
                  <div className="ar-actions">
                    <button
                      type="button"
                      className="ar-btn ghost"
                      onClick={() => {
                        if (item.ghostLabel.includes("Invoice")) {
                          router.push(ROUTES.agent.referralInvoice);
                          showFeedback(item.ghostSuccess);
                          return;
                        }
                        if (item.caseId) {
                          router.push(ROUTES.agent.caseStatus);
                        }
                        showFeedback(item.ghostSuccess);
                      }}
                    >
                      {item.ghostLabel}
                    </button>
                    <button
                      type="button"
                      className="ar-btn primary"
                      onClick={() => markResolved(item.id, item.primarySuccess)}
                    >
                      {item.primaryLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {resolvedIds.length > 0 ?
        <p className="lm-back-row">
          <Link href={ROUTES.agent.dashboard} className="lm-back">
            Back to dashboard
          </Link>
        </p>
      : null}
    </>
  );
}
