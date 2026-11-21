import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A centred "nothing here" message: round icon, title, a line of help and an optional button.
 * `card` stands alone on a page; `plain` sits inside a panel, table or dialog that already has its own frame.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "plain",
  compact,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "card" | "plain";
  /** Less padding and a smaller icon, for a short panel. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center gap-1.5 text-center",
        variant === "card" ?
          "rounded-[18px] border border-dashed border-[#d9d3ec] bg-white px-6 py-14 shadow-care"
        : compact ? "px-4 py-4"
        : "px-4 py-8",
        className,
      )}
    >
      <div
        className={cn(
          "mb-2 flex items-center justify-center rounded-full bg-[#f1e9fe] text-care-purple",
          compact ? "size-11" : "size-14",
        )}
      >
        <Icon aria-hidden className="size-6" strokeWidth={1.8} />
      </div>
      <p className="text-[15px] font-extrabold text-care-ink">{title}</p>
      {description ?
        <p className="max-w-[340px] text-[13.5px] leading-normal text-care-sub">
          {description}
        </p>
      : null}
      {action ?
        <div className="mt-3.5">{action}</div>
      : null}
    </div>
  );
}
