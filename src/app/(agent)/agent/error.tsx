"use client";

import { CareaiErrorPage } from "@/components/careai/careai-error-page";

export default function AgentPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <CareaiErrorPage
      title="Agent portal unavailable"
      description="We couldn't load this page. Try again or return to the agent dashboard."
      error={error}
      onRetry={reset}
      backHref="/agent/dashboard"
      backLabel="Back to dashboard"
    />
  );
}
