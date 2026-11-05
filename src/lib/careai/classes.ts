import { cn } from "@/lib/utils";

/** Portal layout shell (agent + patient) — chrome in careai-portal.css (.lm-*). */
export const careaiPortal = {
  root: "careai-portal",
  main: "lm-main",
} as const;

/** Login page utilities — styles in careai-login.css (matches login1.html). */
export const careaiLogin = {
  root: "careai-login",
  backLink: "back-link",
  card: "login-card",
  tab: (active: boolean) => cn("auth-tab", active && "active"),
  roleBtn: (active: boolean, locked?: boolean) =>
    cn("role-btn", active && !locked && "active", locked && "locked"),
} as const;
