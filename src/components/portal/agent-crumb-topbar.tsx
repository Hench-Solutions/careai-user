import { PortalTopbar } from "@/components/portal/portal-topbar";
import { PortalTopbarAvatar } from "@/components/portal/portal-topbar-avatar";

type AgentCrumbTopbarProps = {
  label: string;
};

export function AgentCrumbTopbar({ label }: AgentCrumbTopbarProps) {
  return (
    <PortalTopbar>
      <div className="text-sm font-semibold text-care-sub [&_span]:font-extrabold [&_span]:text-care-ink">
        Quick Action / <span>{label}</span>
      </div>
      <PortalTopbarAvatar />
    </PortalTopbar>
  );
}
