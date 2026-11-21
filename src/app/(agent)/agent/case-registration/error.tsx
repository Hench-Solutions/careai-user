"use client";

import { CareaiErrorPage } from "@/components/careai/careai-error-page";
import { ROUTES } from "@/config/routes";

export default function CaseRegistrationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <CareaiErrorPage
      title="Registrations unavailable"
      description="We couldn't load your registrations. Try again or start a new registration."
      error={error}
      onRetry={reset}
      backHref={ROUTES.agent.dashboard}
      backLabel="Back to dashboard"
    />
  );
}
