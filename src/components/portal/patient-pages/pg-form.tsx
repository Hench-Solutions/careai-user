"use client";

import type { ReactNode } from "react";

import { PgFormSuccess } from "@/components/portal/patient-pages/patient-page-blocks";
import { usePgFormSubmit } from "@/components/portal/use-pg-form";
import { cn } from "@/lib/utils";

type PgFormProps = {
  className?: string;
  successTitle: string;
  successMessage: string;
  children: ReactNode;
};

/** Client leaf for the demo request forms; the fields stay server-rendered as `children`. */
export function PgForm({
  className,
  successTitle,
  successMessage,
  children,
}: PgFormProps) {
  const { submitted, onSubmit } = usePgFormSubmit();

  return (
    <>
      {submitted ? null : (
        <form className={cn("pg-form", className)} onSubmit={onSubmit}>
          {children}
        </form>
      )}
      <PgFormSuccess
        show={submitted}
        title={successTitle}
        message={successMessage}
      />
    </>
  );
}
