import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Native file input stretched invisibly over its label, so the whole box opens the picker. */
export function FileInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="file"
      className={cn(
        "absolute inset-0 z-[2] m-0 size-full cursor-pointer border-none p-0 text-[0px] text-transparent opacity-0",
        className,
      )}
      {...props}
    />
  );
}
