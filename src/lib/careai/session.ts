import type { AccountRole } from "@/config/auth";

import { accountRoles } from "@/config/auth";

export const CAREAI_SESSION_STORAGE_KEY = "careai.session.v1";

export const CAREAI_SESSION_CHANGE_EVENT = "careai-session-change";

export type CareaiSession = {
  role: AccountRole;
  email: string;
  name?: string;
  /** Agent_Cd / Member_Id from portal sign-in. */
  userCd?: string;
};

/** Cached parse result; `lastRaw` is undefined until first client read. */
let lastRaw: string | null | undefined;
let lastParsed: CareaiSession | null = null;

function invalidateCareaiSessionCache(): void {
  lastRaw = undefined;
}

function parseSession(raw: string | null): CareaiSession | null {
  if (!raw) {
    return null;
  }
  try {
    const data = JSON.parse(raw) as CareaiSession;
    if (!accountRoles.includes(data.role)) {
      return null;
    }
    if (typeof data.email !== "string") {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function readCareaiSession(): CareaiSession | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(CAREAI_SESSION_STORAGE_KEY);
  if (lastRaw !== undefined && raw === lastRaw) {
    return lastParsed;
  }
  lastRaw = raw;
  lastParsed = parseSession(raw);
  return lastParsed;
}

export function writeCareaiSession(session: CareaiSession): void {
  localStorage.setItem(CAREAI_SESSION_STORAGE_KEY, JSON.stringify(session));
  invalidateCareaiSessionCache();
  window.dispatchEvent(new Event(CAREAI_SESSION_CHANGE_EVENT));
}

export function clearCareaiSession(): void {
  localStorage.removeItem(CAREAI_SESSION_STORAGE_KEY);
  invalidateCareaiSessionCache();
  window.dispatchEvent(new Event(CAREAI_SESSION_CHANGE_EVENT));
}

export function subscribeCareaiSession(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();
  window.addEventListener(CAREAI_SESSION_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CAREAI_SESSION_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function sessionInitials(session: CareaiSession): string {
  if (session.name?.trim()) {
    const parts = session.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
    }
    return session.name.trim().slice(0, 2).toUpperCase();
  }
  const local = session.email.split("@")[0] ?? "";
  return local.slice(0, 2).toUpperCase() || "CA";
}
