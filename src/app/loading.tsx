export default function Loading() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-care-bg px-6 font-care text-care-ink">
      <div
        className="size-10 animate-spin rounded-full border-[3px] border-care-line border-t-care-purple"
        aria-hidden
      />
      <p className="mt-4 text-sm font-semibold text-care-sub">Loading…</p>
    </main>
  );
}
