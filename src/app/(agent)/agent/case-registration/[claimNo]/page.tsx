import { redirect } from "next/navigation";

import { ROUTES } from "@/config/routes";

/** Former read-only view; agents edit cases directly. */
export default async function AgentRegistrationDetailPage({
  params,
}: {
  params: Promise<{ claimNo: string }>;
}) {
  const { claimNo } = await params;
  const decoded = decodeURIComponent(claimNo);
  redirect(
    `${ROUTES.agent.caseRegistration}/${encodeURIComponent(decoded)}/edit`,
  );
}
