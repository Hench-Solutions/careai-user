import Link from "next/link";

import { PatientDateBadge } from "@/components/portal/patient-date-badge";
import { careaiMockMember } from "@/config/careai-mock";

export function PatientDashboardContent() {
  return (
    <div className="lm-content">
      <div className="lm-headrow">
        <div>
          <div className="lm-eyebrow">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l1.7 6.6L20 10l-6.3 1.4L12 18l-1.7-6.6L4 10l6.3-1.4z" />
            </svg>
            Hello, Welcome Back
          </div>
          <h1 className="lm-h1">
            Good Morning, <span>{careaiMockMember.displayName}</span>
          </h1>
        </div>
        <PatientDateBadge />
      </div>

      <div className="lm-stats">
        <div className="lm-stat">
          <div className="lm-stat-bar grad1" />
          <div className="lm-stat-body">
            <div className="lm-stat-icon tint1">
              <svg
                fill="none"
                stroke="#6B2FD9"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4M9 11V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-8z" />
              </svg>
            </div>
            <div>
              <div className="lm-stat-label">Total Requests</div>
              <div className="lm-stat-num">24</div>
              <div className="lm-stat-foot c1">↗ All time</div>
            </div>
          </div>
        </div>
        <div className="lm-stat">
          <div className="lm-stat-bar grad2" />
          <div className="lm-stat-body">
            <div className="lm-stat-icon tint2">
              <svg
                fill="none"
                stroke="#0F9D58"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="lm-stat-label">Closed Requests</div>
              <div className="lm-stat-num">18</div>
              <div className="lm-stat-foot c2">✓ 75% resolved</div>
            </div>
          </div>
        </div>
        <div className="lm-stat">
          <div className="lm-stat-bar grad3" />
          <div className="lm-stat-body">
            <div className="lm-stat-icon tint3">
              <svg
                fill="none"
                stroke="#B8720A"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <div className="lm-stat-label">In Progress Request</div>
              <div className="lm-stat-num">6</div>
              <div className="lm-stat-foot c3">🕐 Being handled</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lm-panels">
        <div className="lm-panel">
          <div className="lm-panel-head">
            <div className="lm-panel-title">
              <div className="lm-panel-title-icon">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              Our Services
            </div>
          </div>
          <div className="lm-qa-grid">
            <Link href="/patient/overseas-treatment" className="lm-qa-card">
              <div className="lm-svc-icon s1">
                <svg fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#6B2FD9"
                    strokeWidth="1.7"
                  />
                  <path stroke="#6B2FD9" strokeWidth="1.7" d="M3 12h18" />
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.7"
                    d="M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"
                  />
                  <path
                    fill="#D6238C"
                    d="M11 10.6h2v1h.7v1.1H13v1.1h-2v-1.1h-.7v-1.1H11z"
                  />
                </svg>
              </div>
              <div className="lm-qa-text">Overseas Treatment</div>
            </Link>
            <Link href="/patient/consult-expert" className="lm-qa-card">
              <div className="lm-svc-icon s2">
                <svg fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="9"
                    cy="8"
                    r="3.5"
                    stroke="#D6238C"
                    strokeWidth="1.7"
                  />
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.7"
                    d="M3.5 21v-1a6 6 0 0 1 6-6"
                  />
                  <rect
                    x="12.5"
                    y="9"
                    width="9"
                    height="6.5"
                    rx="1.6"
                    fill="#6B2FD9"
                  />
                  <path
                    d="M15 12h4M15 13.8h2.5"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="lm-qa-text">Consult an Expert</div>
            </Link>
            <Link href="/patient/second-opinion" className="lm-qa-card">
              <div className="lm-svc-icon s3">
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="#6B2FD9"
                    strokeWidth="1.7"
                    d="M6 3.5h8l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z"
                  />
                  <path stroke="#6B2FD9" strokeWidth="1.5" d="M14 3.5v4h4" />
                  <circle cx="12" cy="14" r="3.4" fill="#D6238C" />
                  <path
                    d="M10.7 14l1 1 1.8-1.8"
                    stroke="#fff"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="lm-qa-text">Second Opinion</div>
            </Link>
            <Link href="/patient/education-prevention" className="lm-qa-card">
              <div className="lm-svc-icon s4">
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.7"
                    d="M12 6.2l8.5 3.6-8.5 3.6-8.5-3.6z"
                  />
                  <path
                    stroke="#6B2FD9"
                    strokeWidth="1.7"
                    d="M6.5 11.2v4.4c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.4"
                  />
                  <path stroke="#D6238C" strokeWidth="1.5" d="M20.5 9.8v5" />
                </svg>
              </div>
              <div className="lm-qa-text">Education Prevention</div>
            </Link>
            <Link href="/patient/contact-us" className="lm-qa-card">
              <div className="lm-svc-icon s5">
                <svg fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.7"
                    d="M4 5.5h16v11H8l-4 3.5z"
                  />
                  <path
                    stroke="#D6238C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    d="M8 10h8M8 13h5"
                  />
                </svg>
              </div>
              <div className="lm-qa-text">Contact Us</div>
            </Link>
            <Link href="#" className="lm-qa-card viewall">
              <div className="lm-svc-icon s6">
                <svg fill="#6B2FD9" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="2" />
                  <circle cx="12" cy="6" r="2" />
                  <circle cx="18" cy="6" r="2" />
                  <circle cx="6" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="18" cy="12" r="2" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <circle cx="18" cy="18" r="2" />
                </svg>
              </div>
              <div>
                <div className="lm-qa-text">View All</div>
                <div className="lm-qa-sub">All services</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="lm-panel">
          <div className="lm-panel-head">
            <div className="lm-panel-title">
              <div className="lm-panel-title-icon">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              Reminders
            </div>
            <Link href="#" className="lm-seeall">
              See all{" "}
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          <div className="lm-reminders">
            <div className="lm-reminder">
              <div className="lm-rem-icon amber">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 3h12l4 6-10 12L2 9z" />
                </svg>
              </div>
              <div className="lm-rem-body">
                <div className="lm-rem-title">
                  Blood Test — Apollo Diagnostics
                </div>
                <div className="lm-rem-sub">New Delhi</div>
              </div>
              <div className="lm-rem-time amber">9:00 AM</div>
            </div>
            <div className="lm-reminder">
              <div className="lm-rem-icon purple">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                </svg>
              </div>
              <div className="lm-rem-body">
                <div className="lm-rem-title">Medication — Vitamin D</div>
                <div className="lm-rem-sub">Take with breakfast</div>
              </div>
              <div className="lm-rem-time purple">11:00 AM</div>
            </div>
            <div className="lm-reminder">
              <div className="lm-rem-icon green">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
              </div>
              <div className="lm-rem-body">
                <div className="lm-rem-title">Video Consult — Dr. Sharma</div>
                <div className="lm-rem-sub">Cardiology follow-up</div>
              </div>
              <div className="lm-rem-time green">3:30 PM</div>
            </div>
            <div className="lm-reminder">
              <div className="lm-rem-icon coral">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 2h6v4H9z" />
                  <rect x="5" y="4" width="14" height="18" rx="2" />
                  <path d="M9 12h6M9 16h6" />
                </svg>
              </div>
              <div className="lm-rem-body">
                <div className="lm-rem-title">Upload MRI Report</div>
                <div className="lm-rem-sub">Required for REQ-2241</div>
              </div>
              <div className="lm-rem-time coral">5:00 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
