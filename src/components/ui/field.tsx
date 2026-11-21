import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * A form row: label, control and (optionally) a hint. `invalid` turns the label and the control red;
 * plain inputs do it through `group-data-invalid`, the custom controls through their `data-slot`.
 */
export function Field({
  invalid,
  className,
  ...props
}: ComponentProps<"div"> & { invalid?: boolean }) {
  return (
    <div
      data-invalid={invalid || undefined}
      className={cn(
        "group/field mb-[18px] flex flex-col gap-[7px]",
        "[&[data-invalid]_[data-slot=careai-select-trigger]]:border-care-red [&[data-invalid]_[data-slot=careai-select-trigger]]:bg-[#fef2f2]",
        "[&[data-invalid]_[data-slot=careai-date-trigger]]:border-care-red [&[data-invalid]_[data-slot=careai-date-trigger]]:bg-[#fef2f2]",
        "[&[data-invalid]_[data-slot=upload]]:border-care-red [&[data-invalid]_[data-slot=upload]]:bg-[#fef2f2]",
        "[&[data-invalid]_[data-slot=choose-btn]]:shadow-[0_0_0_1.5px_var(--color-care-red)]",
        className,
      )}
      {...props}
    />
  );
}

type Variant = { variant?: "default" | "soft" };

export function FieldLabel({
  variant = "default",
  className,
  ...props
}: ComponentProps<"label"> & Variant) {
  return (
    <label
      className={cn(
        variant === "soft" ?
          "block text-[12.5px] font-bold text-[#5b5670]"
        : "text-[13px] font-bold text-[#3f3b52] group-data-invalid/field:text-care-red [&_.req]:text-care-pink",
        className,
      )}
      {...props}
    />
  );
}

const control =
  "w-full border-[1.5px] border-care-line font-[inherit] text-care-ink outline-none transition-[border-color,background] duration-150 focus:border-care-purple focus:bg-white";
const controlDefault =
  "rounded-[11px] bg-[#fbfafd] px-3.5 py-3 text-sm group-data-invalid/field:border-care-red group-data-invalid/field:bg-[#fef2f2]";
const controlSoft =
  "cursor-text rounded-[10px] bg-care-bg px-3.5 py-[11px] text-[13.5px]";

export function Input({
  variant = "default",
  className,
  ...props
}: ComponentProps<"input"> & Variant) {
  return (
    <input
      className={cn(
        control,
        variant === "soft" ? controlSoft : controlDefault,
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  variant = "default",
  className,
  ...props
}: ComponentProps<"textarea"> & Variant) {
  return (
    <textarea
      className={cn(
        control,
        "resize-y",
        variant === "soft" ?
          cn(controlSoft, "min-h-[100px]")
        : cn(controlDefault, "min-h-20"),
        className,
      )}
      {...props}
    />
  );
}
