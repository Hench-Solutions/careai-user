import { Suspense } from "react";
import { redirect } from "next/navigation";

import type { ReactNode } from "react";

import { UserProvider } from "@/components/auth/user-provider";
import { PortalShell } from "@/components/portal/portal-shell";
import { dashboardPathForRole, portalBaseForRole } from "@/config/auth";
import { ROUTES } from "@/config/routes";
import { getCurrentUser } from "@/server/session";

type Portal = "agent" | "patient";

async function VerifiedPortal({
  portal,
  children,
}: {
  portal: Portal;
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  // The proxy only reads the cookie; this is the real check that the user belongs here.
  if (portalBaseForRole(user.role) !== ROUTES[portal].base) {
    redirect(dashboardPathForRole(user.role));
  }
  return (
    <UserProvider user={user}>
      <PortalShell portal={portal}>{children}</PortalShell>
    </UserProvider>
  );
}

/**
 * Asks the API who the user is before showing the portal. The lookup is request data, so it sits
 * behind Suspense: the empty portal frame paints at once and the page streams in after it.
 */
export function PortalSession({
  portal,
  children,
}: {
  portal: Portal;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<PortalShell portal={portal}>{null}</PortalShell>}>
      <VerifiedPortal portal={portal}>{children}</VerifiedPortal>
    </Suspense>
  );
}
