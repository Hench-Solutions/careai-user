import Link from "next/link";

import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-care-bg px-6 text-center font-care text-care-ink">
      <p className="text-sm font-semibold text-care-sub">404</p>
      <h1 className="text-2xl font-extrabold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-sm text-care-sub">
        We couldn&apos;t find that page. It may have been moved or the link is
        out of date.
      </p>
      <Link
        href={ROUTES.login}
        className="mt-2 cursor-pointer rounded-xl bg-linear-to-br from-care-purple to-care-pink px-5 py-2.5 text-sm font-bold text-white shadow-care"
      >
        Go to sign in
      </Link>
    </main>
  );
}
