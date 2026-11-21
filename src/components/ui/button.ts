import { cn } from "@/lib/utils";

/** Gradient primary label (links use :where(.careai-portal) a so utilities win). */
export const portalPrimaryLinkText = cn(
  "text-white visited:text-white hover:text-white focus-visible:text-white",
);

const portalBtnBase = cn(
  "flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl px-[26px] py-[13px] font-[inherit] text-[14.5px] font-bold",
  "[&_svg]:size-4",
);

export function portalButtonClass(
  variant: "primary" | "ghost",
  className?: string,
) {
  return cn(
    portalBtnBase,
    variant === "primary" &&
      cn(
        "border-none bg-care-grad shadow-portal-primary-btn",
        portalPrimaryLinkText,
      ),
    variant === "ghost" &&
      "border-[1.5px] border-care-line bg-care-bg text-[#3f3b52] visited:text-[#3f3b52]",
    className,
  );
}

/** Gradient CTA used in list toolbars (`.rv-newbtn`). */
export const portalToolbarNewLink = cn(
  "flex cursor-pointer items-center gap-2 rounded-xl border-none bg-care-grad px-5 py-3 text-[13.5px] font-bold shadow-portal-primary-btn",
  portalPrimaryLinkText,
);
