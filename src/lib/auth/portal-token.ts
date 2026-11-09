import type { AccountRole } from "@/config/auth";

import { roleForApiUserType } from "@/config/auth";
import {
  PORTAL_CLAIMS,
  PORTAL_TOKEN_AUDIENCE,
  PORTAL_TOKEN_ISSUER,
} from "@/config/portal-session";

export type PortalTokenClaims = {
  role: AccountRole;
  userCd: string;
  /** Expiry, seconds since epoch. */
  exp: number;
};

const encoder = new TextEncoder();

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
    return Uint8Array.from(binary, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

function parseJson(bytes: Uint8Array | null): Record<string, unknown> | null {
  if (!bytes) return null;
  try {
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return typeof value === "object" && value !== null ?
        (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/**
 * Verifies the API's portal token (HS256 signature, issuer, audience, expiry, user type).
 * Uses Web Crypto only, so it runs in the proxy. Returns null for anything invalid.
 */
export async function verifyPortalToken(
  token: string | undefined,
  secret: string,
): Promise<PortalTokenClaims | null> {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerPart, payloadPart, signaturePart] = parts as [
    string,
    string,
    string,
  ];

  const header = parseJson(base64UrlToBytes(headerPart));
  if (header?.alg !== "HS256") return null;

  const signature = base64UrlToBytes(signaturePart);
  if (!signature) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(`${headerPart}.${payloadPart}`),
  );
  if (!valid) return null;

  const payload = parseJson(base64UrlToBytes(payloadPart));
  if (!payload) return null;
  const { exp, iss, aud } = payload;
  const role = roleForApiUserType(payload[PORTAL_CLAIMS.userType]);
  const userCd = payload[PORTAL_CLAIMS.userCd];
  if (
    typeof exp !== "number" ||
    exp * 1000 <= Date.now() ||
    iss !== PORTAL_TOKEN_ISSUER ||
    aud !== PORTAL_TOKEN_AUDIENCE ||
    role === null ||
    typeof userCd !== "string"
  ) {
    return null;
  }
  return { role, userCd, exp };
}
