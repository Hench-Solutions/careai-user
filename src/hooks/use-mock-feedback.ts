"use client";

import { useCallback, useEffect, useState } from "react";

const MOCK_FEEDBACK_MS = 4500;

export function useMockFeedback() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), MOCK_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  const showFeedback = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessage(trimmed);
  }, []);

  const clearFeedback = useCallback(() => setMessage(null), []);

  return { message, showFeedback, clearFeedback };
}
