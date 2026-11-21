"use client";

import { LogOut } from "lucide-react";

import { PortalAvatar } from "@/components/portal/portal-avatar";
import { UserField } from "@/components/portal/portal-user-field";
import { ROUTES } from "@/config/routes";
import { signOutAction } from "@/server/auth-actions";

export function PortalSidebarFoot({ role }: { role: string }) {
  const handleLogout = async () => {
    await signOutAction().catch(() => undefined);
    window.location.replace(ROUTES.login);
  };

  return (
    <div className="mt-auto flex items-center gap-2.5 border-t border-care-line pt-4">
      <PortalAvatar>
        <UserField field="initials" />
      </PortalAvatar>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-bold">
          <UserField field="name" fallback={" "} />
        </div>
        <div className="text-[11.5px] text-care-sub">{role}</div>
        <button
          type="button"
          className="mt-1.5 inline-flex cursor-pointer items-center gap-[5px] border-none bg-transparent p-0 text-[11.5px] font-bold text-care-sub transition-colors duration-150 hover:text-care-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-care-purple"
          onClick={handleLogout}
        >
          <LogOut aria-hidden size={13} strokeWidth={2.25} />
          Log out
        </button>
      </div>
    </div>
  );
}
