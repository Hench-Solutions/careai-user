"use client";

import { useSyncExternalStore } from "react";

function formatTodayLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function subscribe() {
  return () => {};
}

function getClientLabel() {
  return formatTodayLabel(new Date());
}

function getServerLabel() {
  return "";
}

export function PatientDateBadge() {
  const label = useSyncExternalStore(subscribe, getClientLabel, getServerLabel);

  return (
    <div className="flex items-center gap-2.5 rounded-[14px] border border-care-line bg-white px-[18px] py-3 text-sm font-bold whitespace-nowrap text-care-ink shadow-care [&_svg]:size-[17px] [&_svg]:shrink-0 [&_svg]:text-care-purple">
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      <span suppressHydrationWarning>{label || "\u00a0"}</span>
    </div>
  );
}
