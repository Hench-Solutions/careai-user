import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { RegistrationView } from "@/components/portal/agent-pages/RegistrationView";

export const metadata: Metadata = {
  title: "Registration details",
};

export default function AgentRegistrationViewPage({
  params,
}: {
  params: Promise<{ claimNo: string }>;
}) {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <div className="lm-content">
        <Suspense fallback={<p className="lm-sub">Loading registration…</p>}>
          <RegistrationView params={params} />
        </Suspense>
      </div>
    </>
  );
}
