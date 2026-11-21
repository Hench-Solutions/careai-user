type PortalMockBannerProps = {
  message: string | null;
};

export function PortalMockBanner({ message }: PortalMockBannerProps) {
  if (!message) return null;

  return (
    <div
      className="mx-9 mb-0 rounded-xl border border-[#ddd4f5] bg-[#f0ebff] px-4 py-3 text-[13.5px] font-semibold text-[#3f3b52] max-[900px]:mx-4"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}
