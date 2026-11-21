"use client";

import Link from "next/link";

import { ROUTES } from "@/config/routes";

type CareaiErrorPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  error?: Error & { digest?: string };
  onRetry?: () => void;
  retryLabel?: string;
  backHref?: string;
  backLabel?: string;
};

const isDev = process.env.NODE_ENV === "development";

export function CareaiErrorPage({
  eyebrow = "Something went wrong",
  title,
  description,
  error,
  onRetry,
  retryLabel = "Try again",
  backHref = ROUTES.login,
  backLabel = "Go to sign in",
}: CareaiErrorPageProps) {
  const devMessage = error?.message?.trim();
  const devDigest = error?.digest;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-care-bg px-6 text-center font-care text-care-ink">
      <p className="text-sm leading-5 font-semibold text-care-sub">{eyebrow}</p>
      <h1 className="text-2xl leading-8 font-extrabold tracking-tight">
        {title}
      </h1>
      <p className="max-w-sm text-sm leading-5 text-care-sub">{description}</p>
      {isDev && (devMessage || devDigest) ?
        <details className="mt-2 max-w-md text-left text-xs leading-4 text-care-sub">
          <summary className="cursor-pointer font-semibold text-care-ink">
            Technical details (development only)
          </summary>
          <div className="mt-2 rounded-lg border border-care-line bg-white/60 p-3 font-mono break-all">
            {devMessage ?
              <p>{devMessage}</p>
            : null}
            {devDigest ?
              <p className="mt-1 text-care-sub">Digest: {devDigest}</p>
            : null}
          </div>
        </details>
      : null}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        {onRetry ?
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl bg-linear-to-br from-care-purple to-care-pink px-5 py-2.5 text-sm leading-5 font-bold whitespace-nowrap text-white shadow-care"
          >
            {retryLabel}
          </button>
        : null}
        <Link
          href={backHref}
          className={
            onRetry ?
              "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-care-line bg-white px-5 py-2.5 text-sm leading-5 font-bold whitespace-nowrap text-care-ink shadow-sm"
            : "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl bg-linear-to-br from-care-purple to-care-pink px-5 py-2.5 text-sm leading-5 font-bold whitespace-nowrap text-white shadow-care"
          }
        >
          {backLabel}
        </Link>
      </div>
    </main>
  );
}
