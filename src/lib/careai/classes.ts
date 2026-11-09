import { cn } from "@/lib/utils";

export const careaiPortal = {
  root: "careai-portal",
  main: "lm-main",
} as const;

export const careaiLogin = {
  root: "careai-login",
  backLink: "back-link",
  card: "login-card",
  tab: (active: boolean) => cn("auth-tab", active && "active"),
  roleBtn: (active: boolean, locked?: boolean) =>
    cn("role-btn", active && !locked && "active", locked && "locked"),
} as const;
