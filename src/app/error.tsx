"use client";

import { CareaiErrorPage } from "@/components/careai/careai-error-page";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <CareaiErrorPage
      title="We hit a snag"
      description="Please try again or go back to sign in. If this keeps happening, contact support."
      error={error}
      onRetry={reset}
    />
  );
}
