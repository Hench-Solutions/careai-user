"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AgentActionWidgetIcon } from "@/components/portal/agent-action-widget-icon";
import { PageHeader } from "@/components/portal/page-header";
import { PortalMockBanner } from "@/components/portal/portal-mock-banner";
import { portalButtonClass } from "@/components/ui/button";
import { portalFilterChipClass } from "@/components/ui/chip";
import { portalSub } from "@/components/ui/typography";
import { careaiMockAgentActionItems } from "@/config/careai-mock";
import { ROUTES } from "@/config/routes";
import { useMockFeedback } from "@/hooks/use-mock-feedback";
import { cn } from "@/lib/utils";

const portalActionRequired = {
  card: (priority: "high" | "medium" | "low") =>
    cn(
      "flex items-start gap-4 rounded-2xl border border-care-line bg-white px-[22px] py-5 shadow-care",
      priority === "high" && "border-l-4 border-l-care-red",
      priority === "medium" && "border-l-4 border-l-care-amber",
      priority === "low" && "border-l-4 border-l-care-blue",
    ),
  icon: (priority: "high" | "medium" | "low") =>
    cn(
      "flex size-11 shrink-0 items-center justify-center rounded-xl [&_svg]:size-[21px]",
      priority === "high" && "bg-[#fde8e8] text-care-red",
      priority === "medium" && "bg-[#fef3e0] text-[#b8720a]",
      priority === "low" && "bg-[#e9f0fe] text-care-blue",
    ),
  priority: (p: "high" | "medium" | "low") =>
    cn(
      "rounded-[20px] px-[11px] py-1 text-[11px] font-extrabold tracking-[0.03em] uppercase text-white",
      p === "high" && "bg-care-red",
      p === "medium" && "bg-care-amber",
      p === "low" && "bg-care-blue",
    ),
  btnGhost: cn(
    portalButtonClass("ghost"),
    "!rounded-[10px] !px-4 !py-[9px] !text-[13px]",
  ),
  btnPrimary: cn(
    portalButtonClass("primary"),
    "!rounded-[10px] !px-4 !py-[9px] !text-[13px]",
  ),
} as const;

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
      <PageHeader
        title="Action Required"
        subtitle="Items across your cases that are waiting on a decision, signature, or upload from you."
      />

      <div className="mb-[22px] flex flex-wrap gap-2">
        {PRIORITIES.map((label) => (
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

      <div className="flex flex-col gap-3.5">
        {items.length === 0 ?
          <p className={portalSub}>
            {resolvedIds.length > 0 ?
              "All visible items are handled for this filter (demo)."
            : "No items match this priority."}
          </p>
        : items.map((item) => {
            const pri = item.priority.toLowerCase() as
              "high" | "medium" | "low";
            return (
              <div key={item.id} className={portalActionRequired.card(pri)}>
                <div className={portalActionRequired.icon(pri)}>
                  <AgentActionWidgetIcon kind={item.widgetIcon} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="text-[15px] font-extrabold">
                      {item.cardTitle}
                    </div>
                    <span className={portalActionRequired.priority(pri)}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="mt-[5px] text-[13.5px] leading-normal text-care-sub">
                    {item.description}
                  </div>
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex gap-2 text-xs text-care-sub [&_b]:text-care-ink">
                      {item.tags}
                    </div>
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        className={portalActionRequired.btnGhost}
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
                        className={portalActionRequired.btnPrimary}
                        onClick={() =>
                          markResolved(item.id, item.primarySuccess)
                        }
                      >
                        {item.primaryLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </>
  );
}
