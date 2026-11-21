"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { AgentCaseTracker } from "@/components/portal/agent-case-tracker";
import { portalButtonClass } from "@/components/ui/button";
import { portalFilterChipClass } from "@/components/ui/chip";
import { portalSub } from "@/components/ui/typography";
import { LEAD_STAGES } from "@/config/lead";
import { cn } from "@/lib/utils";

/** One case as the Case Status page shows it (prepared on the server). */
export type CaseStatusCard = {
  claimNo: string;
  initials: string;
  name: string;
  meta: string;
  statusNm: string;
  /** 1-based step in LEAD_STAGES. */
  stage: number;
  caseManager: string;
  updatedLabel: string;
  editHref: string | null;
};

const FILTERS = [
  "All Cases",
  ...LEAD_STAGES.map((stage) => stage.label),
] as const;

function badgeClass(stage: number) {
  return cn(
    "rounded-[20px] px-3.5 py-1.5 text-[12.5px] font-bold",
    stage === 1 && "bg-[#fef3e0] text-[#b8720a]",
    stage > 1 && "bg-[#e9f0fe] text-care-blue",
  );
}

function matches(card: CaseStatusCard, filter: string) {
  if (filter === "All Cases") return true;
  return LEAD_STAGES[card.stage - 1]?.label === filter;
}

export function AgentCaseStatusContent({
  cases,
}: {
  cases: readonly CaseStatusCard[];
}) {
  const [filter, setFilter] = useState<string>(FILTERS[0]);
  const cards = useMemo(
    () => cases.filter((card) => matches(card, filter)),
    [cases, filter],
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

      <div className="flex flex-col gap-4">
        {cards.length === 0 ?
          <p className={portalSub}>
            {cases.length === 0 ?
              "You have no open cases."
            : "No cases match your filters."}
          </p>
        : cards.map((card) => (
            <div
              key={card.claimNo}
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
                <span className={badgeClass(card.stage)}>{card.statusNm}</span>
              </div>
              <div className="relative flex items-start px-1.5">
                <AgentCaseTracker currentStage={card.stage} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[13px] text-care-sub [&_b]:text-care-ink">
                <span>
                  Assigned to <b>{card.caseManager || "Unassigned"}</b>
                </span>
                <span>
                  Updated <b>{card.updatedLabel}</b>
                </span>
                {card.editHref ?
                  <Link
                    href={card.editHref}
                    className={cn(
                      portalButtonClass("ghost"),
                      "rounded-[9px] px-[15px] py-2 text-[12.5px]",
                    )}
                  >
                    Edit registration
                  </Link>
                : null}
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
}
