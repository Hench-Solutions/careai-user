/** Name of the httpOnly cookie that carries the portal token (never readable by page scripts). */
export const PORTAL_TOKEN_COOKIE = "careai_portal_token";

/** Must match the API's JwtIssuer / PortalJwtAudience. */
export const PORTAL_TOKEN_ISSUER = "CareAi.Api";
export const PORTAL_TOKEN_AUDIENCE = "CareAi.Portal";

/** Claim names the API puts in the portal token. */
export const PORTAL_CLAIMS = {
  userType: "UserType",
  userCd: "UserCd",
} as const;
