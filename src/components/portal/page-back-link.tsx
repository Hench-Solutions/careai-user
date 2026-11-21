import Link from "next/link";

import { portalPrimaryLinkText } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const portalBackLink = {
  wizard: cn(
    "absolute top-[18px] left-[18px] inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-white/[0.38] bg-white/[0.14] px-3.5 py-2 text-[13px] font-bold transition-[background,border-color] duration-150",
    portalPrimaryLinkText,
    "max-[640px]:top-3 max-[640px]:left-2.5 max-[640px]:px-2.5 max-[640px]:py-[7px] max-[640px]:text-xs",
    "hover:border-white/[0.55] hover:bg-white/[0.24]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ),
} as const;

function BackArrow() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

type PageBackLinkProps = {
  label: string;
  variant?: "default" | "wizard";
  className?: string;
} & (
  | { href: string; onClick?: undefined }
  | { href?: undefined; onClick: () => void }
);

/** Uniform portal back control (arrow + label). Use `onClick` for guarded wizard exits. */
export function PageBackLink({
  href,
  onClick,
  label,
  variant = "default",
  className,
}: PageBackLinkProps) {
  const classes = cn(
    variant === "wizard" ?
      portalBackLink.wizard
    : "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-care-line bg-care-bg px-4 py-[9px] text-[13px] font-bold text-[#3f3b52] transition-[background,border-color] duration-150 hover:border-[#d8d3e6] hover:bg-care-control-hover hover:text-care-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-care-purple [&_svg]:size-4 [&_svg]:shrink-0",
    className,
  );
  const content = (
    <>
      <BackArrow />
      {label}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
