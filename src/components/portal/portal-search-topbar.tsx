"use client";

import { PortalTopbarAvatar } from "@/components/portal/portal-topbar-avatar";

type PortalSearchTopbarProps = {
  searchPlaceholder?: string;
  query?: string;
  onQueryChange?: (query: string) => void;
};

export function PortalSearchTopbar({
  searchPlaceholder = "Search patients, cases, invoices...",
  query = "",
  onQueryChange,
}: PortalSearchTopbarProps) {
  return (
    <header className="lm-topbar">
      <label className="lm-search">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="search"
          className="lm-search-input"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => onQueryChange?.(event.target.value)}
          aria-label={searchPlaceholder}
        />
      </label>
      <div className="lm-top-actions">
        <button
          type="button"
          className="lm-icon-btn"
          aria-label="Notifications"
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="dot" />
        </button>
        <PortalTopbarAvatar />
      </div>
    </header>
  );
}
