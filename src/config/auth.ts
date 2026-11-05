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
export const signUpRoles: AccountRole[] = ["patient"];

export function canSelfRegister(role: AccountRole): boolean {
  return role === "patient";
}

export function dashboardPathForRole(role: AccountRole): string {
  if (role === "patient") {
    return "/patient/dashboard";
  }
  return "/agent/dashboard";
}

export function isAgentRole(role: AccountRole): boolean {
  return role === AGENT_ACCOUNT_ROLE;
}
