import { portalPrimaryLinkText } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Filter chips (Case Status `cs-chip`, Action Required `ar-chip`). */
export function portalFilterChipClass(active: boolean, className?: string) {
  return cn(
    "cursor-pointer rounded-[20px] border px-4 py-[9px] font-[inherit] text-[13px] font-bold",
    "appearance-none",
    active ?
      cn("border-transparent bg-care-grad text-white", portalPrimaryLinkText)
    : "border-care-line bg-white text-care-sub",
    className,
  );
}
