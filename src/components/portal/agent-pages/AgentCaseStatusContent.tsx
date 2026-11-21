"use client";

import { useMemo, useState } from "react";

import { AgentCaseTracker } from "@/components/portal/agent-case-tracker";
import { PageHeader } from "@/components/portal/page-header";
import { PortalMockBanner } from "@/components/portal/portal-mock-banner";
import { portalButtonClass } from "@/components/ui/button";
import { portalFilterChipClass } from "@/components/ui/chip";
import { portalSub } from "@/components/ui/typography";
import { careaiMockAgentCases } from "@/config/careai-mock";
import { useMockFeedback } from "@/hooks/use-mock-feedback";
import { cn } from "@/lib/utils";

const portalCaseStatus = {
  badge: (variant: "review" | "ongoing" | "closed") =>
    cn(
      "rounded-[20px] px-3.5 py-1.5 text-[12.5px] font-bold",
      variant === "review" && "bg-[#fef3e0] text-[#b8720a]",
      variant === "ongoing" && "bg-[#e9f0fe] text-care-blue",
      variant === "closed" && "bg-[#e4f8ee] text-care-green",
    ),
  btnGhost: cn(
    portalButtonClass("ghost"),
    "!rounded-[9px] !px-[15px] !py-2 !text-[12.5px]",
  ),
} as const;

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
      <PageHeader
        title="Case Status"
        subtitle={
          <>
            Track every registered case through Registration{"  "}Review
            Treatment Closure.
          </>
        }
      />

      <div className="mb-[22px] flex flex-wrap gap-2">
        {FILTERS.map((label) => (
          <button
            key={label}
            type="button"
            className={portalFilterChipClass(filter === label)}
            aria-pressed={filter === label}
            onClick={() => setFilter(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {cards.length === 0 ?
          <p className={portalSub}>No cases match your filters.</p>
        : cards.map((card) => (
            <div
              key={card.id}
              className="rounded-[18px] border border-care-line bg-white px-[26px] py-[22px] shadow-care"
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-2.5">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-[46px] items-center justify-center rounded-xl bg-care-grad text-[15px] font-extrabold text-white">
                    {card.initials}
                  </div>
                  <div>
                    <div className="text-[15.5px] font-extrabold">
                      {card.name}
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-care-sub">
                      {card.meta}
                    </div>
                  </div>
                </div>
                <span
                  className={portalCaseStatus.badge(
                    card.badgeClass as "review" | "ongoing" | "closed",
                  )}
                >
                  {card.badge}
                </span>
              </div>
              <div className="relative flex items-start px-1.5">
                <AgentCaseTracker currentStage={card.trackerStage} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[13px] text-care-sub [&_b]:text-care-ink">
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
                  className={portalCaseStatus.btnGhost}
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
