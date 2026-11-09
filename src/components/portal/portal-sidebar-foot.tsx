"use client";

import { memo } from "react";

import { LogOut } from "lucide-react";

import { ROUTES } from "@/config/routes";
import { useCareaiSession } from "@/hooks/use-careai-session";
import { clearCareaiSession, sessionInitials } from "@/lib/careai/session";
import { logout } from "@/services/auth";

type PortalSidebarFootProps = {
  fallback: {
    initials: string;
    name?: string;
    role: string;
  };
};

export const PortalSidebarFoot = memo(function PortalSidebarFoot({
  fallback,
}: PortalSidebarFootProps) {
  const session = useCareaiSession();

  const initials = session ? sessionInitials(session) : fallback.initials;
  const name = session?.name ?? fallback.name;
  const role = fallback.role;

  const handleLogout = async () => {
    // Clear the httpOnly cookie first; the proxy decides access from it, not from local storage.
    await logout().catch(() => undefined);
    clearCareaiSession();
    // Full navigation, not router.replace: it also drops the client-side page cache.
    window.location.replace(ROUTES.login);
  };

  return (
    <div className="lm-sidebar-foot">
      <div className="lm-avatar">{initials}</div>
      <div className="lm-sidebar-foot-meta">
        {name ?
          <div className="name">{name}</div>
        : null}
        <div className="role">{role}</div>
        <button type="button" className="lm-logout" onClick={handleLogout}>
          <LogOut aria-hidden size={13} strokeWidth={2.25} />
          Log out
        </button>
      </div>
    </div>
  );
});
