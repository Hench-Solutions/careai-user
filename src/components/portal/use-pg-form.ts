"use client";

import { useCallback, useEffect, useState } from "react";

/** Brief pause so the submitting state is visible (demo forms have no network call). */
const DEMO_SUBMIT_MS = 280;

export function usePgFormSubmit() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    requestAnimationFrame(() => {
      document
        .querySelector("[data-slot='form-success'][data-show]")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
    });
  }, [submitted]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submitting || submitted) return;
      setSubmitting(true);
      try {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, DEMO_SUBMIT_MS);
        });
        setSubmitted(true);
      } catch {
        setSubmitting(false);
      }
    },
    [submitted, submitting],
  );

  return { submitted, submitting, onSubmit };
}
