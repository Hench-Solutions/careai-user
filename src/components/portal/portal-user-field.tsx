"use client";

import type { SessionUser } from "@/lib/auth/user";

import { useUser } from "@/components/auth/user-provider";

type UserTextField = keyof Pick<SessionUser, "firstName" | "initials" | "name">;

export function UserField({
  field,
  fallback = "",
}: {
  field: UserTextField;
  fallback?: string;
}) {
  return useUser()?.[field] ?? fallback;
}
