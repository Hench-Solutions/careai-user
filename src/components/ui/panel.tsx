import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** White rounded card used for dashboard panels. */
export function Panel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-care-line bg-care-card p-[22px_24px] shadow-care max-[640px]:px-4 max-[640px]:py-[18px]",
        className,
      )}
      {...props}
    />
  );
}

export function PanelTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 text-[17px] font-extrabold",
        className,
      )}
      {...props}
    />
  );
}

/** Small tinted square that holds the panel's icon. */
export function PanelIcon({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#f1e9fe] text-care-purple [&_svg]:size-[17px]",
        className,
      )}
      {...props}
    />
  );
}
