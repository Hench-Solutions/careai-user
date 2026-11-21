"use client";

import { createContext, useContext } from "react";

import type { ReactNode } from "react";

import {
  PgFormSuccess,
  portalPgBtnClass,
} from "@/components/portal/patient-pages/patient-page-blocks";
import { usePgFormSubmit } from "@/components/portal/use-pg-form";
import { cn } from "@/lib/utils";

type PgFormContextValue = {
  submitting: boolean;
};

const PgFormContext = createContext<PgFormContextValue>({ submitting: false });

type PgFormProps = {
  className?: string;
  successTitle: string;
  successMessage: string;
  children: ReactNode;
};

type PgSubmitButtonProps = {
  children: ReactNode;
  className?: string;
};

export function PgSubmitButton({ children, className }: PgSubmitButtonProps) {
  const btnClass = className ?? portalPgBtnClass("solid");
  const { submitting } = useContext(PgFormContext);
  return (
    <button
      type="submit"
      className={btnClass}
      disabled={submitting}
      aria-busy={submitting}
    >
      {submitting ? "Submitting…" : children}
    </button>
  );
}

/** Client leaf for the demo request forms; the fields stay server-rendered as `children`. */
export function PgForm({
  className,
  successTitle,
  successMessage,
  children,
}: PgFormProps) {
  const { submitted, submitting, onSubmit } = usePgFormSubmit();

  return (
    <PgFormContext.Provider value={{ submitting }}>
      {submitted ? null : (
        <form
          className={cn(
            "grid grid-cols-2 gap-4 max-[1100px]:grid-cols-1",
            className,
          )}
          onSubmit={onSubmit}
          aria-busy={submitting}
        >
          {children}
        </form>
      )}
      <PgFormSuccess
        show={submitted}
        title={successTitle}
        message={successMessage}
      />
    </PgFormContext.Provider>
  );
}
