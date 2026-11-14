import { UserField } from "@/components/portal/portal-user-field";
import { cn } from "@/lib/utils";

type PortalTopbarAvatarProps = {
  className?: string;
};

export function PortalTopbarAvatar({ className }: PortalTopbarAvatarProps) {
  return (
    <div className={cn("lm-avatar", className)}>
      <UserField field="initials" />
    </div>
  );
}
