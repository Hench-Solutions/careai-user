import { Suspense } from "react";

import type { Metadata } from "next";

import { AgentCrumbTopbar } from "@/components/portal/agent-crumb-topbar";
import { RegistrationList } from "@/components/portal/agent-pages/RegistrationList";

export const metadata: Metadata = {
  title: "Case Registration",
};

export default function AgentManageRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ by?: string; q?: string }>;
}) {
  return (
    <>
      <AgentCrumbTopbar label="Case Registration" />
      <div className="lm-content">
        <h1 className="lm-h1">Case Registration</h1>
        <p className="lm-sub">View and update the cases you have registered.</p>
        <Suspense fallback={<p className="lm-sub">Loading registrations…</p>}>
          <RegistrationList searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
