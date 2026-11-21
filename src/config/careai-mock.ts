/**
 * Demo / mock data for the CareAI user portal (no backend yet).
 */

export const careaiMockMember = {
  displayName: "Member",
  accountLabel: "Prospera Global",
} as const;

export const careaiMockAgent = {
  organization: "Prospera Global",
} as const;

type AgentInvoiceStatus = "paid" | "pending" | "overdue";

export const careaiMockAgentActionItems = [
  {
    id: "ar-1",
    priority: "High" as const,
    iconTone: "amber" as const,
    widgetIcon: "gem" as const,
    title: "Missing Medical Report — Amir Hussain",
    subtitle: "Case MEM261200412 · Due today, 6:00 PM",
    cardTitle: "Missing Medical Report Amir Hussain",
    description:
      "Pre-op cardiac assessment report has not been uploaded. Apollo Hospitals cannot confirm the surgery slot without it.",
    tags: "Case MEM261200412 Due Today, 6:00 PM",
    caseId: "MEM261200412",
    primaryLabel: "Upload Report",
    ghostLabel: "View Case",
    primarySuccess: "Report upload queued (demo).",
    ghostSuccess: "Opening case overview (demo).",
  },
  {
    id: "ar-2",
    priority: "High" as const,
    iconTone: "amber" as const,
    widgetIcon: "card" as const,
    title: "Invoice Overdue — Yusuf Karim",
    subtitle: "Referral REF-1038 · 5 days past due",
    cardTitle: "Invoice Overdue Yusuf Karim",
    description:
      "Referral invoice REF-1038 for the Medanta neurology consultation is 5 days past due.",
    tags: "Referral REF-1038 Amount ₹65,000",
    caseId: "MEM261187720",
    primaryLabel: "Send Reminder",
    ghostLabel: "View Invoice",
    primarySuccess: "Payment reminder sent (demo).",
    ghostSuccess: "Invoice details shown (demo).",
  },
  {
    id: "ar-3",
    priority: "Medium" as const,
    iconTone: "purple" as const,
    widgetIcon: "user" as const,
    title: "Guarantor Approval — Fatima Al Suwaidi",
    subtitle: "Case MEM261299871 · Due tomorrow",
    cardTitle: "Guarantor Approval Pending Fatima Al Suwaidi",
    description:
      "Corporate TPA guarantor needs to confirm coverage before Fortis can schedule the knee replacement.",
    tags: "Case MEM261299871 Due Tomorrow",
    caseId: "MEM261299871",
    primaryLabel: "Follow Up",
    ghostLabel: "View Case",
    primarySuccess: "Follow-up logged with guarantor (demo).",
    ghostSuccess: "Opening case overview (demo).",
  },
  {
    id: "ar-4",
    priority: "Medium" as const,
    iconTone: "purple" as const,
    widgetIcon: "file" as const,
    title: "ID Document Rejected — Rohan Mehta",
    subtitle: "Case MEM261159841 · Due in 2 days",
    cardTitle: "ID Document Rejected Rohan Mehta",
    description:
      "Uploaded passport scan is illegible. Hospital admissions has requested a clearer re-upload.",
    tags: "Case MEM261159841 Due In 2 days",
    caseId: "MEM261159841",
    primaryLabel: "Re-upload",
    ghostLabel: "View Case",
    primarySuccess: "Re-upload request saved (demo).",
    ghostSuccess: "Opening case overview (demo).",
  },
  {
    id: "ar-5",
    priority: "Low" as const,
    iconTone: "green" as const,
    widgetIcon: "bell" as const,
    title: "Video Sync — Dr. Sharma",
    subtitle: "Cardiology Allocation Panel · Today 3:30 PM",
    cardTitle: "Video Sync Confirmation Dr. Sharma",
    description:
      "Cardiology allocation panel call at 3:30 PM still needs your RSVP.",
    tags: "Panel Cardiology Allocation Today 3:30 PM",
    caseId: "",
    primaryLabel: "Confirm",
    ghostLabel: "Decline",
    primarySuccess: "RSVP confirmed for 3:30 PM (demo).",
    ghostSuccess: "Declined — calendar updated (demo).",
  },
] as const;

/** Dashboard widget shows the first three action items. */
export const careaiMockAgentDashboardActions = careaiMockAgentActionItems.slice(
  0,
  3,
);

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
