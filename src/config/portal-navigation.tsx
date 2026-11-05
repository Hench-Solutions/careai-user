import type { PortalNavSection } from "@/components/portal/portal-sidebar";

const dashboardIcon = (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" rx="2" />
    <rect x="14" y="3" width="7" height="5" rx="2" />
    <rect x="14" y="12" width="7" height="9" rx="2" />
    <rect x="3" y="16" width="7" height="5" rx="2" />
  </svg>
);

export function getAgentNavSections(activeHref: string): PortalNavSection[] {
  return [
    {
      label: "Overview",
      items: [
        {
          href: "/agent/dashboard",
          label: "Dashboard",
          icon: dashboardIcon,
          active: activeHref === "/agent/dashboard",
        },
      ],
    },
    {
      label: "Quick Actions",
      items: [
        {
          href: "/agent/case-registration",
          label: "Case Registration",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
          ),
          active: activeHref === "/agent/case-registration",
        },
        {
          href: "/agent/referral-invoice",
          label: "Referral & Invoice",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          ),
          active: activeHref === "/agent/referral-invoice",
        },
        {
          href: "/agent/case-status",
          label: "Case Status",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          ),
          active: activeHref === "/agent/case-status",
        },
        {
          href: "/agent/action-required",
          label: "Action Required",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          ),
          active: activeHref === "/agent/action-required",
        },
      ],
    },
  ];
}

export function getPatientNavSections(activeHref: string): PortalNavSection[] {
  return [
    {
      label: "Overview",
      items: [
        {
          href: "/patient/dashboard",
          label: "Dashboard",
          icon: dashboardIcon,
          active: activeHref === "/patient/dashboard",
        },
      ],
    },
    {
      label: "Our Services",
      items: [
        {
          href: "/patient/overseas-treatment",
          label: "Overseas Treatment",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z" />
            </svg>
          ),
          active: activeHref === "/patient/overseas-treatment",
        },
        {
          href: "/patient/consult-expert",
          label: "Consult an Expert",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="9" cy="8" r="3.5" />
              <path d="M3 21v-1a6 6 0 0 1 6-6h0" />
              <rect x="13" y="9" width="8" height="6" rx="1.5" />
              <path d="M15 12h4" />
            </svg>
          ),
          active: activeHref === "/patient/consult-expert",
        },
        {
          href: "/patient/second-opinion",
          label: "Second Opinion",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 3h8l4 4v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          ),
          active: activeHref === "/patient/second-opinion",
        },
        {
          href: "/patient/education-prevention",
          label: "Education Prevention",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 4l9 4-9 4-9-4z" />
              <path d="M6 10v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
            </svg>
          ),
          active: activeHref === "/patient/education-prevention",
        },
        {
          href: "/patient/contact-us",
          label: "Contact Us",
          icon: (
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v12H7l-3 3z" />
              <path d="M8 9h8M8 12h5" />
            </svg>
          ),
          active: activeHref === "/patient/contact-us",
        },
      ],
    },
  ];
}
