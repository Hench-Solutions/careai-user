import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Toolbar row above a list: the search on one side, the main action on the other. */
export function ListToolbar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mb-[18px] flex flex-wrap items-center justify-between gap-3",
        className,
      )}
      {...props}
    />
  );
}

export function ListSearchRow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-nowrap items-stretch gap-2 max-[640px]:w-full max-[640px]:flex-wrap",
        className,
      )}
      {...props}
    />
  );
}

/** White card that holds a table and scrolls sideways on narrow screens; styles its table cells. */
export function TableCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-[18px] border border-care-line bg-white shadow-care [-webkit-overflow-scrolling:touch] [&_table]:w-full [&_table]:border-collapse max-[640px]:[&_table]:min-w-0 [&_tbody_tr:hover]:bg-[#fbfafd] [&_td]:border-b [&_td]:border-care-line [&_td]:px-5 [&_td]:py-4 [&_td]:text-sm max-[640px]:[&_td]:px-2.5 max-[640px]:[&_td]:py-3 [&_th]:border-b [&_th]:border-care-line [&_th]:bg-[#fbfafd] [&_th]:px-5 [&_th]:py-4 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:tracking-[0.04em] [&_th]:text-care-sub [&_th]:uppercase max-[640px]:[&_th]:px-2.5 max-[640px]:[&_th]:py-3 [&_tr:last-child_td]:border-b-0",
        className,
      )}
      {...props}
    />
  );
}
