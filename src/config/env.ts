/** Local API (dotnet run) address; override with NEXT_PUBLIC_API_BASE_URL in deployed environments. */
const DEFAULT_API_BASE_URL = "http://localhost:5244";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");
