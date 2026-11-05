"use client";

import "@/styles/globals.css";

import { CareaiErrorPage } from "@/components/careai/careai-error-page";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <CareaiErrorPage
          title="We hit a snag"
          description="Something unexpected happened. Please try again or return to sign in."
          error={error}
          onRetry={reset}
        />
      </body>
    </html>
  );
}
