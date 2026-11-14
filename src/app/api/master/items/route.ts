import type { NextRequest } from "next/server";

import { API_ENDPOINTS, MASTER_ITEM_TYPES, MASTER_QUERY } from "@/config/api";
import { proxyMasterList } from "@/server/bff";

export function GET(request: NextRequest) {
  return proxyMasterList(request, {
    param: MASTER_QUERY.itemType,
    allowed: Object.values(MASTER_ITEM_TYPES),
    apiPath: API_ENDPOINTS.master.items,
  });
}
