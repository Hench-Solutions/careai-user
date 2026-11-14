import type { AccountRole, ApiUserType } from "@/config/auth";

import { roleForApiUserType } from "@/config/auth";

export type PortalProfile = {
  user_Type: ApiUserType;
  user_Cd: string;
  user_Full_Name: string;
  email_Id: string;
  calling_Cd: string;
  mobile_No: string;
};

/** What the portal UI needs about the signed-in user; nothing sensitive. */
export type SessionUser = {
  role: AccountRole;
  userCd: string;
  name: string;
  firstName: string;
  initials: string;
};

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const letters =
    parts.length > 1 ?
      `${parts[0]![0]}${parts.at(-1)![0]}`
    : parts[0]!.slice(0, 2);
  return letters.toUpperCase();
}

export function toSessionUser(profile: PortalProfile): SessionUser | null {
  const role = roleForApiUserType(profile.user_Type);
  if (!role) return null;
  const name = profile.user_Full_Name.trim();
  return {
    role,
    userCd: profile.user_Cd,
    name,
    firstName: name.split(/\s+/)[0] ?? "",
    initials: initialsOf(name),
  };
}
