import type { NextRequest } from "next/server";

import {
  API_ENDPOINTS,
  MASTER_DROPDOWN_MODES,
  MASTER_QUERY,
} from "@/config/api";
import { proxyMasterList } from "@/server/bff";

export function GET(request: NextRequest) {
  return proxyMasterList(request, {
    param: MASTER_QUERY.mode,
    allowed: Object.values(MASTER_DROPDOWN_MODES),
    apiPath: API_ENDPOINTS.master.portalDropdown,
  });
}
