/**
 * Demo / mock data for the CareAI user portal (no backend yet).
 */

export const careaiMockMember = {
  displayName: "Member",
} as const;

type AgentInvoiceStatus = "paid" | "pending" | "overdue";

export const careaiMockAgentInvoices = [
  {
    patient: "Amir Hussain",
    id: "MEM261200412",
    ref: "REF-1042",
    hospital: "Apollo Hospitals, Chennai",
    treatment: "Cardiology — Bypass",
    date: "18 Jul 2026",
    amount: "₹4,20,000",
    status: "paid" as AgentInvoiceStatus,
  },
  {
    patient: "Fatima Al Suwaidi",
    id: "MEM261299871",
    ref: "REF-1041",
    hospital: "Fortis, Mumbai",
    treatment: "Orthopedics — Knee Replacement",
    date: "17 Jul 2026",
    amount: "₹2,85,000",
    status: "pending" as AgentInvoiceStatus,
  },
  {
    patient: "Yusuf Karim",
    id: "MEM261187720",
    ref: "REF-1038",
    hospital: "Medanta, Gurugram",
    treatment: "Neurology — Consultation",
    date: "12 Jul 2026",
    amount: "₹65,000",
    status: "overdue" as AgentInvoiceStatus,
  },
  /** Closed case (Jul 2026); not shown on active case status list. */
  {
    patient: "Layla Ahmed",
    id: "MEM261176003",
    ref: "REF-1035",
    hospital: "Apollo Labs",
    treatment: "Oncology — Chemotherapy",
    date: "08 Jul 2026",
    amount: "₹3,10,000",
    status: "paid" as AgentInvoiceStatus,
  },
  {
    patient: "Rohan Mehta",
    id: "MEM261159841",
    ref: "REF-1030",
    hospital: "Manipal, Bengaluru",
    treatment: "ADEM — Specialist Panel",
    date: "02 Jul 2026",
    amount: "₹1,45,000",
    status: "pending" as AgentInvoiceStatus,
  },
] as const;

/** Sums of visible invoice rows (Jul 2026 demo set). */
export const careaiMockAgentInvoiceStats = {
  total: "₹12.3L",
  paid: "₹7.3L",
  pending: "₹4.3L",
  overdue: "₹0.7L",
} as const;
