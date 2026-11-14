import type { NextRequest } from "next/server";

import { API_ENDPOINTS, API_MESSAGES } from "@/config/api";
import { getToApiWithPortalToken, jsonEnvelope } from "@/server/auth-bff";

/** Must match PortalMasterController allowlist. */
const ALLOWED_MODES = new Set([
  "DrpSource",
  "ddlNationality",
  "ddlPatientLocation",
  "ddlDocumentType",
  "ddlProvider",
  "DrpBranch",
  "drpDoctor",
  "drpGuarantor",
]);

type DropdownItem = {
  value?: string;
  text?: string;
  Value?: string;
  Text?: string;
};

/** Cookie JWT → PortalMaster/dropdown. */
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode")?.trim() ?? "";
  const filterId = request.nextUrl.searchParams.get("filterId")?.trim() ?? "";
  if (!mode || !ALLOWED_MODES.has(mode)) {
    return jsonEnvelope(null, 400, "Invalid master dropdown mode.");
  }

  const qs = new URLSearchParams({ mode });
  if (filterId) qs.set("filterId", filterId);

  const result = await getToApiWithPortalToken<DropdownItem[]>(
    request,
    `${API_ENDPOINTS.master.portalDropdown}?${qs.toString()}`,
    API_MESSAGES.generic,
  );
  if (!result.ok) return result.response;

  return jsonEnvelope(result.data);
}
