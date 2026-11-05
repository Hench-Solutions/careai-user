"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { AccountRole } from "@/config/auth";

import { dashboardPathForRole, isAgentRole } from "@/config/auth";
import { useCareaiSession } from "@/hooks/use-careai-session";
import { readCareaiSession } from "@/lib/careai/session";

type PortalKind = "agent" | "patient";

function roleMatchesPortal(role: AccountRole, portal: PortalKind): boolean {
  return portal === "agent" ? isAgentRole(role) : role === "patient";
}

export function useRequireCareaiSession(portal: PortalKind): void {
  const router = useRouter();
  const pathname = usePathname();
  const session = useCareaiSession();

  useEffect(() => {
    // Client effects only: read storage directly so we do not redirect on the
    // SSR/hydration null snapshot before useSyncExternalStore catches up.
    const activeSession = readCareaiSession();
    if (activeSession === null) {
      if (pathname !== "/login") {
        router.replace("/login");
      }
      return;
    }
    if (!roleMatchesPortal(activeSession.role, portal)) {
      const target = dashboardPathForRole(activeSession.role);
      if (pathname !== target) {
        router.replace(target);
      }
    }
  }, [pathname, portal, router, session]);
}
