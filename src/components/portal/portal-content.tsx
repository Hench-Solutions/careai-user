import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The padded page body inside the portal; `wizard` centres the multi-step form. */
export function PortalContent({
  wizard,
  children,
}: {
  wizard?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "px-9 pt-8 pb-[60px] max-[900px]:overflow-x-clip max-[640px]:px-4 max-[640px]:pt-5 max-[640px]:pb-12",
        wizard && "flex items-start justify-center",
      )}
    >
      {children}
    </div>
  );
}
