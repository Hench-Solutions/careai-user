type PortalMockBannerProps = {
  message: string | null;
};

export function PortalMockBanner({ message }: PortalMockBannerProps) {
  if (!message) return null;

  return (
    <div
      className="lm-mock-banner"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}
