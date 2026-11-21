import { PortalAvatar } from "@/components/portal/portal-avatar";
import { UserField } from "@/components/portal/portal-user-field";

export function PortalTopbarAvatar() {
  return (
    <PortalAvatar>
      <UserField field="initials" />
    </PortalAvatar>
  );
}
