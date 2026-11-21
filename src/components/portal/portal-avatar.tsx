import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Round gradient badge with the user's initials. */
export function PortalAvatar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-[38px] shrink-0 items-center justify-center rounded-full bg-care-grad text-[13px] font-bold text-white",
        className,
      )}
      {...props}
    />
  );
}
