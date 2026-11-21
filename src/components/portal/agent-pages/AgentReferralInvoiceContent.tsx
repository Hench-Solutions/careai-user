"use client";

import { useMemo, useState } from "react";

import { FileText } from "lucide-react";

import { ListToolbar } from "@/components/portal/list-layout";
import { PageHeader } from "@/components/portal/page-header";
import { PortalMockBanner } from "@/components/portal/portal-mock-banner";
import {
  portalPrimaryLinkText,
  portalToolbarNewLink,
} from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  careaiMockAgentInvoices,
  careaiMockAgentInvoiceStats,
} from "@/config/careai-mock";
import { useMockFeedback } from "@/hooks/use-mock-feedback";
import { cn } from "@/lib/utils";

function portalRvTabClass(active: boolean, className?: string) {
  return cn(
    "cursor-pointer rounded-[10px] border-none bg-transparent px-[18px] py-[9px]",
    "font-[inherit] text-[13.5px] font-bold text-care-sub",
    active && cn("bg-care-grad text-white", portalPrimaryLinkText),
    className,
  );
}

const portalAgentRv = {
  statCard: (tone: "total" | "paid" | "pending" | "overdue") =>
    cn(
      "rounded-2xl border border-care-line bg-white px-5 py-[18px] shadow-care",
      tone === "total" && "[&_.n]:text-care-purple",
      tone === "paid" && "[&_.n]:text-care-green",
      tone === "pending" && "[&_.n]:text-care-amber",
      tone === "overdue" && "[&_.n]:text-care-red",
    ),
  badge: (status: "paid" | "pending" | "overdue") =>
    cn(
      "inline-flex items-center gap-1.5 rounded-[20px] px-3 py-[5px] text-xs font-bold",
      status === "paid" && "bg-[#e4f8ee] text-care-green",
      status === "pending" && "bg-[#fef3e0] text-[#b8720a]",
      status === "overdue" && "bg-[#fde8e8] text-care-red",
    ),
} as const;

const TABS = ["All", "Pending", "Paid", "Overdue"] as const;

export function AgentReferralInvoiceContent() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const { message, showFeedback } = useMockFeedback();

  const rows = useMemo(
    () =>
      careaiMockAgentInvoices.filter(
        (row) => tab === "All" || tab.toLowerCase() === row.status,
      ),
    [tab],
  );

  return (
    <>
      <PortalMockBanner message={message} />
      <PageHeader
        title="Referral & Invoice"
        subtitle="Track referral invoices raised across your active and closed cases."
      />

      <div className="mb-[26px] grid grid-cols-4 gap-4 max-[640px]:grid-cols-2 [&>*]:min-w-0">
        <div className={portalAgentRv.statCard("total")}>
          <div className="n text-[22px] font-extrabold">
            {careaiMockAgentInvoiceStats.total}
          </div>
          <div className="l mt-0.5 text-[12.5px] leading-normal font-semibold text-care-sub">
            Total Invoiced
          </div>
        </div>
        <div className={portalAgentRv.statCard("paid")}>
          <div className="n text-[22px] font-extrabold">
            {careaiMockAgentInvoiceStats.paid}
          </div>
          <div className="l mt-0.5 text-[12.5px] leading-normal font-semibold text-care-sub">
            Paid
          </div>
        </div>
        <div className={portalAgentRv.statCard("pending")}>
          <div className="n text-[22px] font-extrabold">
            {careaiMockAgentInvoiceStats.pending}
          </div>
          <div className="l mt-0.5 text-[12.5px] leading-normal font-semibold text-care-sub">
            Pending
          </div>
        </div>
        <div className={portalAgentRv.statCard("overdue")}>
          <div className="n text-[22px] font-extrabold">
            {careaiMockAgentInvoiceStats.overdue}
          </div>
          <div className="l mt-0.5 text-[12.5px] leading-normal font-semibold text-care-sub">
            Overdue
          </div>
        </div>
      </div>

      <ListToolbar>
        <div
          className="flex gap-2 rounded-[14px] border border-care-line bg-white p-1.5"
          role="tablist"
          aria-label="Invoice status"
        >
          {TABS.map((label) => (
            <button
              key={label}
              type="button"
              className={portalRvTabClass(tab === label)}
              aria-selected={tab === label}
              role="tab"
              onClick={() => setTab(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={portalToolbarNewLink}
          onClick={() =>
            showFeedback(
              "New referral invoice draft saved locally (demo — no backend).",
            )
          }
        >
          + New Referral Invoice
        </button>
      </ListToolbar>

      <div className="max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-[18px] border border-care-line bg-white shadow-care [-webkit-overflow-scrolling:touch] [&_table]:w-full [&_table]:min-w-[720px] [&_table]:border-collapse max-[640px]:[&_table]:min-w-0 [&_tbody_tr:hover]:bg-[#fbfafd] [&_td]:border-b [&_td]:border-care-line [&_td]:px-5 [&_td]:py-4 [&_td]:text-sm max-[640px]:[&_td]:px-2.5 max-[640px]:[&_td]:py-3 [&_th]:border-b [&_th]:border-care-line [&_th]:bg-[#fbfafd] [&_th]:px-5 [&_th]:py-4 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:tracking-[0.04em] [&_th]:text-care-sub [&_th]:uppercase max-[640px]:[&_th]:px-2.5 max-[640px]:[&_th]:py-3 [&_tr:last-child_td]:border-b-0">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Referral ID</th>
              <th>Hospital</th>
              <th>Treatment</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ?
              <tr>
                <td colSpan={8}>
                  <EmptyState
                    icon={FileText}
                    title="No invoices in this tab"
                    description="Invoices with this status will appear here."
                  />
                </td>
              </tr>
            : rows.map((row) => (
                <tr key={row.ref}>
                  <td>
                    <div className="font-bold">{row.patient}</div>
                    <div className="text-xs text-care-sub">{row.id}</div>
                  </td>
                  <td>{row.ref}</td>
                  <td>{row.hospital}</td>
                  <td>{row.treatment}</td>
                  <td>{row.date}</td>
                  <td className="font-extrabold">{row.amount}</td>
                  <td>
                    <span className={portalAgentRv.badge(row.status)}>
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 font-[inherit] text-[13px] font-bold text-care-purple [&_svg]:size-[15px]"
                      onClick={() =>
                        showFeedback(
                          `Downloading invoice ${row.ref} (demo PDF placeholder).`,
                        )
                      }
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 3v12M7 10l5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                      Invoice
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  );
}
