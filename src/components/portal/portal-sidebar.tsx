import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

import type { ReactNode } from "react";

import { PortalSidebarFoot } from "@/components/portal/portal-sidebar-foot";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
};

export type PortalNavSection = {
  label: string;
  items: PortalNavItem[];
};

/** Intrinsic size of `public/images/care-ai-logo.png` (matches HTML CareAILogo.png). */
const CARE_AI_LOGO_WIDTH = 1024;
const CARE_AI_LOGO_HEIGHT = 304;

type PortalSidebarProps = {
  sections: PortalNavSection[];
  logoVariant: "agent" | "patient";
  footer: {
    initials: string;
    name?: string;
    role: string;
  };
};

export function PortalSidebar({
  sections,
  logoVariant,
  footer,
}: PortalSidebarProps) {
  return (
    <aside className="lm-sidebar">
      {logoVariant === "agent" ?
        <div className="lm-logo">
          <div className="lm-logo-mark">
            <Image
              src="/images/care-ai-logo.png"
              alt="CareAI Logo"
              width={CARE_AI_LOGO_WIDTH}
              height={CARE_AI_LOGO_HEIGHT}
              priority
            />
          </div>
        </div>
      : <div className="lm-logo">
          <Image
            src="/images/care-ai-logo.png"
            alt="CareAI Logo"
            width={CARE_AI_LOGO_WIDTH}
            height={CARE_AI_LOGO_HEIGHT}
            priority
            className="lm-logo-img"
          />
        </div>
      }

      <nav className="lm-nav">
        {sections.map((section) => (
          <Fragment key={section.label}>
            <div className="lm-nav-label">{section.label}</div>
            {section.items.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={item.active ? "lm-nav-item active" : "lm-nav-item"}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </Fragment>
        ))}
      </nav>

      <PortalSidebarFoot fallback={footer} />
    </aside>
  );
}
