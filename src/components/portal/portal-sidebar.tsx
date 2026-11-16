import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

import { X } from "lucide-react";

import type { ReactNode } from "react";

import { PortalSidebarFoot } from "@/components/portal/portal-sidebar-foot";

type PortalNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
};

export type PortalNavSection = {
  label: string;
  items: PortalNavItem[];
};

/** Intrinsic size of `public/images/care-ai-logo.png`. */
const CARE_AI_LOGO_WIDTH = 1024;
const CARE_AI_LOGO_HEIGHT = 304;

type PortalSidebarProps = {
  id: string;
  /** Phone layout: whether the slide-in menu is showing. */
  open: boolean;
  onClose: () => void;
  sections: PortalNavSection[];
  logoVariant: "agent" | "patient";
  /** Role line under the signed-in user's name. */
  footerRole: string;
};

export function PortalSidebar({
  id,
  open,
  onClose,
  sections,
  logoVariant,
  footerRole,
}: PortalSidebarProps) {
  return (
    <aside id={id} className={open ? "lm-sidebar open" : "lm-sidebar"}>
      <button
        type="button"
        className="lm-sidebar-close"
        aria-label="Close menu"
        onClick={onClose}
      >
        <X aria-hidden size={18} />
      </button>
      {logoVariant === "agent" ?
        <div className="lm-logo">
          <div className="lm-logo-mark">
            <Image
              src="/images/care-ai-logo.png"
              alt="CareAI Logo"
              width={CARE_AI_LOGO_WIDTH}
              height={CARE_AI_LOGO_HEIGHT}
              sizes="270px"
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
            sizes="160px"
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

      <PortalSidebarFoot role={footerRole} />
    </aside>
  );
}
