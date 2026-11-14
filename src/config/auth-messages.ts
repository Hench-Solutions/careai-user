import type { AccountRole } from "@/config/auth";

/** Smallest password the sign-up form accepts (mirrors the API's rule). */
export const MIN_PASSWORD_LENGTH = 6;

const AGENT_SIGNUP_BLOCKED_MESSAGE =
  "Agent accounts are created by an administrator. Please sign in or contact support.";

export const AUTH_MESSAGES = {
  agentSignupBlocked: AGENT_SIGNUP_BLOCKED_MESSAGE,
  agentSignupLockedTitle: "Agent accounts are created by an administrator",
  passwordRequired: "Please enter your password.",
  passwordTooShort: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  nameRequired: "Please enter your full name.",
  emailRequired: "Please enter your email address.",
  signInFailed: "Sign in failed. Please try again.",
  signUpFailed: "Sign up failed. Please try again.",
  sessionExpired: "Your session has expired. Please sign in again.",
  creatingAccount: "Creating your patient account…",
  signingIn: (roleLabel: string) => `Signing in as ${roleLabel}…`,
  loginIdRequired: (idLabel: string) => `Please enter your ${idLabel}.`,
  accountCreated: (memberId: string) =>
    `Account created. Your Member ID is ${memberId} — use it with your password to sign in.`,
} as const;

/** What each role types to sign in (label, input placeholder). */
export const LOGIN_ID_FIELD: Record<
  AccountRole,
  { label: string; placeholder: string }
> = {
  patient: { label: "Member ID", placeholder: "e.g. MEM261305002" },
  facilitator: { label: "Agent ID", placeholder: "e.g. AG001" },
};
