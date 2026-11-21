"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { CheckCircle2, Inbox } from "lucide-react";

import type { ActionPriority, AgentAction } from "@/lib/lead/actions";

import { AgentActionIcon } from "@/components/portal/agent-action-icon";
import { portalButtonClass } from "@/components/ui/button";
import { portalFilterChipClass } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "High", "Medium"] as const;

const priorityStyles: Record<
  ActionPriority,
  { card: string; icon: string; badge: string }
> = {
  High: {
    card: "border-l-4 border-l-care-red",
    icon: "bg-[#fde8e8] text-care-red",
    badge: "bg-care-red",
  },
  Medium: {
    card: "border-l-4 border-l-care-amber",
    icon: "bg-[#fef3e0] text-[#b8720a]",
    badge: "bg-care-amber",
  },
};

export function AgentActionRequiredContent({
  actions,
}: {
  actions: readonly AgentAction[];
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const items = useMemo(
    () =>
      actions.filter((item) => filter === "All" || filter === item.priority),
    [actions, filter],
  );

  return (
    <>
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

      <div className="flex flex-col gap-3.5">
        {items.length === 0 ?
          actions.length === 0 ?
            <EmptyState
              variant="card"
              icon={CheckCircle2}
              title="You're all caught up"
              description="Nothing is waiting on you right now. Missing documents and requests from our team will show up here."
            />
          : <EmptyState
              variant="card"
              icon={Inbox}
              title={`No ${filter.toLowerCase()} priority items`}
              action={
                <button
                  type="button"
                  className={portalButtonClass("ghost")}
                  onClick={() => setFilter("All")}
                >
                  Show all items
                </button>
              }
            />

        : items.map((item) => {
            const style = priorityStyles[item.priority];
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border border-care-line bg-white px-[22px] py-5 shadow-care",
                  style.card,
                )}
              >
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl [&_svg]:size-[21px]",
                    style.icon,
                  )}
                >
                  <AgentActionIcon kind={item.kind} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="text-[15px] font-extrabold">
                      {item.title}
                    </div>
                    <span
                      className={cn(
                        "rounded-[20px] px-[11px] py-1 text-[11px] font-extrabold tracking-[0.03em] text-white uppercase",
                        style.badge,
                      )}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className="mt-[5px] text-[13.5px] leading-normal text-care-sub">
                    {item.description}
                  </div>
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="text-xs text-care-sub">{item.subtitle}</div>
                    <div className="flex gap-2.5">
                      <Link
                        href={ROUTES.agent.caseStatus}
                        className={cn(
                          portalButtonClass("ghost"),
                          "rounded-[10px] px-4 py-[9px] text-[13px]",
                        )}
                      >
                        View case
                      </Link>
                      {item.primary ?
                        <Link
                          href={item.primary.href}
                          className={cn(
                            portalButtonClass("primary"),
                            "rounded-[10px] px-4 py-[9px] text-[13px]",
                          )}
                        >
                          {item.primary.label}
                        </Link>
                      : null}
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
