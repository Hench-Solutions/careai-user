"use client";

import Link, { useLinkStatus } from "next/link";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const navItemClass = (active?: boolean) =>
  cn(
    "flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-[11px] text-[14.5px] font-semibold text-care-nav-ink",
    "transition-[background,color] duration-150",
    "hover:bg-care-nav-hover hover:text-care-purple",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-care-purple",
    active &&
      cn("bg-care-grad text-white shadow-care-nav-active", "hover:text-white"),
    "[&_svg]:size-[19px] [&_svg]:shrink-0",
  );

type PortalNavLinkProps = {
  href: string;
  active?: boolean;
  icon: ReactNode;
  label: string;
  onNavigate?: () => void;
};

function NavLinkStatus({ icon, label }: { icon: ReactNode; label: string }) {
  const { pending } = useLinkStatus();
  return (
    <>
      {pending ?
        <span
          className="lm-route-progress pointer-events-none fixed top-0 left-0 z-[120] h-[3px] w-full origin-left animate-[lm-route-progress_0.9s_ease-in-out_infinite] bg-[linear-gradient(90deg,var(--color-care-purple),color-mix(in_oklab,var(--color-care-purple)_60%,white))] motion-reduce:animate-none motion-reduce:opacity-[0.85]"
          aria-hidden
        />
      : null}
      {icon}
      <span className={cn(pending && "opacity-[0.65]")}>{label}</span>
    </>
  );
}

export function PortalNavLink({
  href,
  active,
  icon,
  label,
  onNavigate,
}: PortalNavLinkProps) {
  return (
    <Link href={href} className={navItemClass(active)} onClick={onNavigate}>
      <NavLinkStatus icon={icon} label={label} />
    </Link>
  );
}
