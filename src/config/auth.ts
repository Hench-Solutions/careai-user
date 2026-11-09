import { ROUTES } from "@/config/routes";

/** Facilitator accounts use the agent (business) portal. */
export const AGENT_ACCOUNT_ROLE = "facilitator" as const;

export const accountRoles = ["patient", AGENT_ACCOUNT_ROLE] as const;

export type AccountRole = (typeof accountRoles)[number];

export type AuthTab = "signin" | "signup";

export const roleLabels: Record<AccountRole, string> = {
  patient: "Patient",
  facilitator: "Agent",
};

export const signInRoles: AccountRole[] = ["patient", "facilitator"];

/** Self-service registration is patient-only; agents are provisioned in the admin panel. */
export function canSelfRegister(role: AccountRole): boolean {
  return role === "patient";
}

export function dashboardPathForRole(role: AccountRole): string {
  return role === "patient" ? ROUTES.patient.dashboard : ROUTES.agent.dashboard;
}

export function isAgentRole(role: AccountRole): boolean {
  return role === AGENT_ACCOUNT_ROLE;
}
