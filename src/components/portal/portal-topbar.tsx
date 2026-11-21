import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Sticky top bar of the portal pages (leaves room for the phone menu button). */
export function PortalTopbar({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between border-b border-care-line bg-white px-9 py-5 max-[1100px]:px-5 max-[900px]:pl-[66px]",
        className,
      )}
      {...props}
    />
  );
}
