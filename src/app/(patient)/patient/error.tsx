"use client";

import { CareaiErrorPage } from "@/components/careai/careai-error-page";

export default function PatientPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <CareaiErrorPage
      title="Patient portal unavailable"
      description="We couldn't load this page. Try again or return to your dashboard."
      error={error}
      onRetry={reset}
      backHref="/patient/dashboard"
      backLabel="Back to dashboard"
    />
  );
}
