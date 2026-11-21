import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Layout pieces of the case registration wizard, shared by the form and its loading skeleton. */

export function WizardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-t-[22px] bg-care-grad px-[34px] pt-[30px] pb-[46px] text-center text-white max-[640px]:px-[18px] max-[640px]:pt-[52px] max-[640px]:pb-10",
        className,
      )}
      {...props}
    />
  );
}

export function WizardStepsCard({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative z-[2] mx-5 -mt-8 rounded-t-[18px] bg-white px-7 pt-[22px] shadow-portal-wizard-steps max-[640px]:mx-2 max-[640px]:-mt-8 max-[640px]:px-3.5 max-[640px]:pt-[18px]",
        className,
      )}
      {...props}
    />
  );
}

export function WizardStepRow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[460px] items-start justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

const formCardClass =
  "mx-5 box-border block rounded-b-[18px] bg-white px-[34px] pt-[30px] pb-[34px] shadow-portal-wizard-form max-[640px]:mx-2 max-[640px]:px-4 max-[640px]:py-[22px] max-[640px]:pb-[26px]";

export function WizardFormCard({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(formCardClass, className)} {...props} />;
}

export function WizardForm({ className, ...props }: ComponentProps<"form">) {
  return <form className={cn(formCardClass, className)} {...props} />;
}

export function WizardFieldGrid({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-5 gap-y-[18px] max-[820px]:grid-cols-1 [&>*]:min-w-0",
        className,
      )}
      {...props}
    />
  );
}
