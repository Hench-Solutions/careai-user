import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { RegistrationEdit } from "@/components/portal/agent-pages/RegistrationEdit";

export const metadata: Metadata = {
  title: "Edit registration",
};

export default function AgentRegistrationEditPage({
  params,
}: {
  params: Promise<{ claimNo: string }>;
}) {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <div className="lm-content case-registration-page">
        <Suspense fallback={<p className="lm-sub">Loading registration…</p>}>
          <RegistrationEdit params={params} />
        </Suspense>
      </div>
    </>
  );
}
