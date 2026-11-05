"use client";

import { useCallback, useEffect, useState } from "react";

export function usePgFormSubmit() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    requestAnimationFrame(() => {
      document.querySelector(".pg-success.show")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, [submitted]);

  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  }, []);

  return { submitted, onSubmit };
}
