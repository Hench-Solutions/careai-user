import { Fragment } from "react";
import Image from "next/image";

import { X } from "lucide-react";

import type { ReactNode } from "react";

import { PortalNavLink } from "@/components/portal/portal-nav-link";
import { PortalSidebarFoot } from "@/components/portal/portal-sidebar-foot";
import { cn } from "@/lib/utils";

const sidebarClass = (open: boolean) =>
  cn(
    "fixed top-0 left-0 bottom-0 z-50 flex w-[260px] flex-col gap-7 border-r border-care-line bg-white px-5 py-7",
    "max-[900px]:invisible max-[900px]:-translate-x-full max-[900px]:transition-[transform,visibility] max-[900px]:duration-[220ms] max-[900px]:ease-in-out",
    open &&
      "max-[900px]:visible max-[900px]:translate-x-0 max-[900px]:shadow-[0_0_40px_rgba(26,26,46,0.28)]",
  );

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

const CARE_AI_LOGO_WIDTH = 1024;
const CARE_AI_LOGO_HEIGHT = 304;

type PortalSidebarProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  sections: PortalNavSection[];
  logoVariant: "agent" | "patient";
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
    <aside id={id} className={sidebarClass(open)}>
      <button
        type="button"
        className="lm-sidebar-close hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-care-purple max-[900px]:absolute max-[900px]:top-3.5 max-[900px]:right-3.5 max-[900px]:flex max-[900px]:size-[34px] max-[900px]:cursor-pointer max-[900px]:items-center max-[900px]:justify-center max-[900px]:rounded-[10px] max-[900px]:border-none max-[900px]:bg-[color-mix(in_oklab,var(--color-care-purple)_8%,#fff)] max-[900px]:text-care-purple"
        aria-label="Close menu"
        onClick={onClose}
      >
        <X aria-hidden size={18} />
      </button>
      {logoVariant === "agent" ?
        <div className="px-1.5">
          <div className="flex h-20 w-auto shrink-0 items-center justify-center overflow-hidden [&_img]:block [&_img]:h-full [&_img]:w-auto [&_img]:max-w-full [&_img]:object-contain">
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
      : <div className="px-1.5">
          <Image
            src="/images/care-ai-logo.png"
            alt="CareAI Logo"
            width={CARE_AI_LOGO_WIDTH}
            height={CARE_AI_LOGO_HEIGHT}
            sizes="160px"
            priority
            className="block h-auto w-[160px] max-w-[160px] object-contain"
          />
        </div>
      }

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {sections.map((section) => (
          <Fragment key={section.label}>
            <div className="px-3 pt-2 pb-1 text-[11px] font-bold tracking-[0.08em] text-care-nav-muted uppercase">
              {section.label}
            </div>
            {section.items.map((item) => (
              <PortalNavLink
                key={item.href + item.label}
                href={item.href}
                active={item.active}
                icon={item.icon}
                label={item.label}
                onNavigate={onClose}
              />
            ))}
          </Fragment>
        ))}
      </nav>

      <PortalSidebarFoot role={footerRole} />
    </aside>
  );
}
