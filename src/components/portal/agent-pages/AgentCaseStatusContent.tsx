"use client";

import { useMemo, useState } from "react";

import { AgentCaseTracker } from "@/components/portal/agent-case-tracker";
import { PortalMockBanner } from "@/components/portal/portal-mock-banner";
import { careaiMockAgentCases } from "@/config/careai-mock";
import { useMockFeedback } from "@/hooks/use-mock-feedback";

const FILTERS = ["All Cases", "Under Review", "Treatment Ongoing"] as const;

export function AgentCaseStatusContent() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All Cases");
  const { message, showFeedback } = useMockFeedback();

  const cards = useMemo(() => {
    return careaiMockAgentCases.filter(
      (card) => filter === "All Cases" || filter === card.badge,
    );
  }, [filter]);

  return (
    <>
      <PortalMockBanner message={message} />
      <h1 className="lm-h1">Case Status</h1>
      <p className="lm-sub">
        Track every registered case through Registration{"  "}Review Treatment
        Closure.
      </p>

      <div className="cs-filterbar">
        {FILTERS.map((label) => (
          <button
            key={label}
            type="button"
            className={filter === label ? "cs-chip active" : "cs-chip"}
            aria-pressed={filter === label}
            onClick={() => setFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="cs-list">
        {cards.length === 0 ?
          <p className="lm-sub">No cases match your filters.</p>
        : cards.map((card) => (
            <div key={card.id} className="cs-card">
              <div className="cs-card-top">
                <div className="cs-who">
                  <div className="cs-avatar">{card.initials}</div>
                  <div>
                    <div className="cs-name">{card.name}</div>
                    <div className="cs-meta">{card.meta}</div>
                  </div>
                </div>
                <span className={`cs-status-badge ${card.badgeClass}`}>
                  {card.badge}
                </span>
              </div>
              <div className="cs-tracker">
                <AgentCaseTracker currentStage={card.trackerStage} />
              </div>
              <div className="cs-foot">
                <span>
                  Assigned to <b>{card.assignedTo}</b>
                </span>
                <span>
                  {card.closedOn ?
                    <>
                      Closed on <b>{card.closedOn}</b>
                    </>
                  : <>
                      Updated <b>{card.updatedLabel}</b>
                    </>
                  }
                </span>
                <button
                  type="button"
                  className="cs-btn ghost"
                  onClick={() =>
                    showFeedback(
                      `Case ${card.id} details loaded (demo — no backend).`,
                    )
                  }
                >
                  View details
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}
