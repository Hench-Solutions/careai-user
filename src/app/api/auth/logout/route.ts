import type { NextRequest } from "next/server";

import {
  jsonEnvelope,
  rejectForeignOrigin,
  withoutTokenCookie,
} from "@/server/auth-bff";

/** Clears the portal cookie. The token is short-lived and cannot be revoked earlier. */
export function POST(request: NextRequest) {
  const blocked = rejectForeignOrigin(request);
  if (blocked) return blocked;
  return withoutTokenCookie(jsonEnvelope({ loggedOut: true }));
}
