import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Native `<dialog>` shell: centred card with a dimmed backdrop (open it with `showModal()`). */
export function DialogShell({ className, ...props }: ComponentProps<"dialog">) {
  return (
    <dialog
      className={cn(
        "m-auto w-[min(520px,calc(100vw-32px))] overflow-hidden rounded-2xl border-none bg-white p-0 text-care-ink shadow-[0_24px_60px_rgba(26,26,46,0.35)] backdrop:bg-[rgba(26,26,46,0.45)]",
        className,
      )}
      {...props}
    />
  );
}

/** Gradient title bar with a round badge (`!`, `?`) beside the heading. */
export function DialogHeader({
  badge,
  titleId,
  children,
}: {
  badge: string;
  titleId: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 bg-[linear-gradient(90deg,var(--color-care-purple),var(--color-care-coral))] px-6 py-[18px] text-white">
      <span
        className="inline-flex size-6 items-center justify-center rounded-full bg-white text-[15px] font-extrabold text-care-purple"
        aria-hidden
      >
        {badge}
      </span>
      <h2 id={titleId} className="m-0 text-lg font-bold">
        {children}
      </h2>
    </div>
  );
}

export function DialogActions({
  split,
  children,
}: {
  split?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex justify-end px-6 pt-3 pb-5", split && "gap-2.5")}>
      {children}
    </div>
  );
}

export function DialogButton({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      type="button"
      className={cn(
        "min-w-[94px] cursor-pointer rounded-[10px] border-none px-6 py-[11px] text-[15px] font-bold",
        variant === "primary" &&
          "bg-[linear-gradient(90deg,var(--color-care-purple),var(--color-care-coral))] text-white",
        variant === "secondary" &&
          "border border-care-line bg-care-bg text-[#3f3b52] hover:border-[#d8d3e6] hover:bg-[#eeebf6] hover:text-care-purple",
        className,
      )}
      {...props}
    />
  );
}
