import type { ActionKind } from "@/lib/lead/actions";

const ICON_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  viewBox: "0 0 24 24",
} as const;

/** The icon of an action item: a bell for information asked for, a person for ID, a file for reports. */
export function AgentActionIcon({ kind }: { kind: ActionKind }) {
  switch (kind) {
    case "id":
      return (
        <svg {...ICON_PROPS}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M20 8v6M23 11h-6" />
        </svg>
      );
    case "medical":
      return (
        <svg {...ICON_PROPS}>
          <path d="M9 3h6l1 3h3a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "info":
      return (
        <svg {...ICON_PROPS}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
  }
}
