"use client";

import { PortalTopbar } from "@/components/portal/portal-topbar";
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
    <PortalTopbar>
      <label className="flex w-[340px] max-w-[50vw] items-center gap-2.5 rounded-xl bg-care-bg px-4 py-2.5 text-[13.5px] text-care-search">
        <svg
          className="size-[17px] shrink-0"
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
          className="min-w-0 flex-1 border-none bg-transparent font-[inherit] text-care-ink outline-none placeholder:text-care-search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => onQueryChange?.(event.target.value)}
          aria-label={searchPlaceholder}
        />
      </label>
      <div className="flex items-center gap-[18px]">
        <button
          type="button"
          className="relative flex size-10 cursor-pointer items-center justify-center rounded-[11px] bg-care-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-care-purple [&_svg]:size-[19px] [&_svg]:text-care-nav-ink"
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
          <span className="absolute top-2 right-2 size-[7px] rounded-full border-2 border-white bg-care-coral" />
        </button>
        <PortalTopbarAvatar />
      </div>
    </PortalTopbar>
  );
}
