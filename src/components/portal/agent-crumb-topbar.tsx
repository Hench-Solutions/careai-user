import { PortalTopbarAvatar } from "@/components/portal/portal-topbar-avatar";

type AgentCrumbTopbarProps = {
  label: string;
};

export function AgentCrumbTopbar({ label }: AgentCrumbTopbarProps) {
  return (
    <header className="lm-topbar">
      <div className="lm-crumb">
        Quick Action / <span>{label}</span>
      </div>
      <PortalTopbarAvatar className="sm" />
    </header>
  );
}
