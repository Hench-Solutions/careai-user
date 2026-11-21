import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** The padded white card every patient page section sits in. */
export function PgSection({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-5 mb-[22px] rounded-[18px] border border-care-line bg-care-card p-[26px_28px] shadow-care max-[640px]:px-4 max-[640px]:py-5",
        className,
      )}
      {...props}
    />
  );
}

/** Two columns of sections that stack on narrow screens; `contact` gives the form a little less room. */
export function PgPanels({
  contact,
  className,
  ...props
}: ComponentProps<"div"> & { contact?: boolean }) {
  return (
    <div
      className={cn(
        "mt-5 grid gap-5 max-[900px]:grid-cols-[minmax(0,1fr)] [&>*]:min-w-0",
        contact ? "grid-cols-[1.3fr_1fr]" : "grid-cols-[1.4fr_1fr]",
        className,
      )}
      {...props}
    />
  );
}

/** One label-and-control row of a patient form. */
export function PgField({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function Required() {
  return <span className="text-care-pink">*</span>;
}

/** Drop zone around a hidden native file input (the whole box is the click target). */
export function PgUpload({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[14px] border-[1.5px] border-dashed border-[#c9beea] bg-[#fbf9ff] p-7 text-center",
        "[&_svg]:mx-auto [&_svg]:mb-2.5 [&_svg]:block [&_svg]:size-[30px] [&_svg]:shrink-0 [&_svg]:text-care-purple",
        "[&_.browse]:font-bold [&_.browse]:text-care-purple [&_p]:m-0 [&_p]:text-[13px] [&_p]:text-care-sub",
        "[&>:not(input)]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}
