import { ROUTES } from "@/config/routes";

const caseBase = (claimNo: string) =>
  `${ROUTES.agent.caseRegistration}/${encodeURIComponent(claimNo)}`;

export const caseEditHref = (claimNo: string) => `${caseBase(claimNo)}/edit`;

export const caseDocumentsHref = (claimNo: string) =>
  `${caseBase(claimNo)}/documents`;
