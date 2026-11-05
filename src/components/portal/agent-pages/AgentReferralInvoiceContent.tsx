"use client";

import { useMemo, useState } from "react";

import { PortalMockBanner } from "@/components/portal/portal-mock-banner";
import {
  careaiMockAgentInvoices,
  careaiMockAgentInvoiceStats,
} from "@/config/careai-mock";
import { useMockFeedback } from "@/hooks/use-mock-feedback";

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
      <h1 className="lm-h1">Referral & Invoice</h1>
      <p className="lm-sub">
        Track referral invoices raised across your active and closed cases.
      </p>

      <div className="rv-stats">
        <div className="rv-stat total">
          <div className="n">{careaiMockAgentInvoiceStats.total}</div>
          <div className="l">Total Invoiced</div>
        </div>
        <div className="rv-stat paid">
          <div className="n">{careaiMockAgentInvoiceStats.paid}</div>
          <div className="l">Paid</div>
        </div>
        <div className="rv-stat pending">
          <div className="n">{careaiMockAgentInvoiceStats.pending}</div>
          <div className="l">Pending</div>
        </div>
        <div className="rv-stat overdue">
          <div className="n">{careaiMockAgentInvoiceStats.overdue}</div>
          <div className="l">Overdue</div>
        </div>
      </div>

      <div className="rv-toolbar">
        <div className="rv-tabs" role="tablist" aria-label="Invoice status">
          {TABS.map((label) => (
            <button
              key={label}
              type="button"
              className={tab === label ? "rv-tab active" : "rv-tab"}
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
          className="rv-newbtn"
          onClick={() =>
            showFeedback(
              "New referral invoice draft saved locally (demo — no backend).",
            )
          }
        >
          + New Referral Invoice
        </button>
      </div>

      <div className="rv-table-wrap">
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
                  <span className="lm-sub">No invoices in this tab.</span>
                </td>
              </tr>
            : rows.map((row) => (
                <tr key={row.ref}>
                  <td>
                    <div className="rv-patient">{row.patient}</div>
                    <div className="rv-id">{row.id}</div>
                  </td>
                  <td>{row.ref}</td>
                  <td>{row.hospital}</td>
                  <td>{row.treatment}</td>
                  <td>{row.date}</td>
                  <td className="rv-amount">{row.amount}</td>
                  <td>
                    <span className={`rv-badge ${row.status}`}>
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="rv-dl"
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
