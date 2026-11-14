"use client";

import { createContext, use } from "react";

import type { ReactNode } from "react";

import type { SessionUser } from "@/lib/auth/user";

const UserContext = createContext<SessionUser | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return <UserContext value={user}>{children}</UserContext>;
}

/** The signed-in user, or null while the portal shell is still waiting for the API's answer. */
export function useUser(): SessionUser | null {
  return use(UserContext);
}
