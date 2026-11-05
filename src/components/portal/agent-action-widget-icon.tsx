type WidgetIconKind = "gem" | "card" | "user" | "bell" | "file";

export function AgentActionWidgetIcon({ kind }: { kind: WidgetIconKind }) {
  switch (kind) {
    case "gem":
      return (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 3h12l4 6-10 12L2 9z" />
        </svg>
      );
    case "card":
      return (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <rect x="2" y="6" width="20" height="13" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "user":
      return (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
      );
    case "file":
      return (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M9 3h6l1 3h3a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    default:
      return (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
  }
}
