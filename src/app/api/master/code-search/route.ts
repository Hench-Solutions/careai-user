import type { NextRequest } from "next/server";

import {
  API_ENDPOINTS,
  MASTER_CODE_QUERY_MAX_LENGTH,
  MASTER_CODE_TYPES,
} from "@/config/api";
import { proxyCodeSearch } from "@/server/bff";

export function GET(request: NextRequest) {
  return proxyCodeSearch(request, {
    allowed: Object.values(MASTER_CODE_TYPES),
    apiPath: API_ENDPOINTS.master.codeSearch,
    maxLength: MASTER_CODE_QUERY_MAX_LENGTH,
  });
}
