import type { NextRequest } from "next/server";

import { API_ENDPOINTS } from "@/config/api";
import { streamFromApiWithPortalToken } from "@/server/bff";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const claimNo = searchParams.get("claimNo")?.trim() ?? "";
  const fileName = searchParams.get("fileName")?.trim() ?? "";
  if (!claimNo || !fileName) return new Response(null, { status: 400 });

  const query = new URLSearchParams({ claimNo, fileName });
  return streamFromApiWithPortalToken(
    request,
    `${API_ENDPOINTS.lead.portalDocument}?${query}`,
  );
}
