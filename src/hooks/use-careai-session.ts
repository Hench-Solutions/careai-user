"use client";

import { useSyncExternalStore } from "react";

import type { CareaiSession } from "@/lib/careai/session";

import {
  readCareaiSession,
  subscribeCareaiSession,
} from "@/lib/careai/session";

const CAREAI_SESSION_SERVER_SNAPSHOT: CareaiSession | null = null;

function getCareaiSessionServerSnapshot(): CareaiSession | null {
  return CAREAI_SESSION_SERVER_SNAPSHOT;
}

export function useCareaiSession(): CareaiSession | null {
  return useSyncExternalStore(
    subscribeCareaiSession,
    readCareaiSession,
    getCareaiSessionServerSnapshot,
  );
}
