"use client";

import { LogOut } from "lucide-react";

import { UserField } from "@/components/portal/portal-user-field";
import { ROUTES } from "@/config/routes";
import { signOutAction } from "@/server/auth-actions";

export function PortalSidebarFoot({ role }: { role: string }) {
  const handleLogout = async () => {
    await signOutAction().catch(() => undefined);
    // Full navigation, not router.replace: it also drops the client-side page cache.
    window.location.replace(ROUTES.login);
  };

  return (
    <div className="lm-sidebar-foot">
      <div className="lm-avatar">
        <UserField field="initials" />
      </div>
      <div className="lm-sidebar-foot-meta">
        <div className="name">
          <UserField field="name" fallback={" "} />
        </div>
        <div className="role">{role}</div>
        <button type="button" className="lm-logout" onClick={handleLogout}>
          <LogOut aria-hidden size={13} strokeWidth={2.25} />
          Log out
        </button>
      </div>
    </div>
  );
}
