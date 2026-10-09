"use client";

import { useEffect, useState } from "react";

/**
 * Current time that refreshes on an interval, so time-based UI (e.g. "registration closed",
 * "event ended") updates on its own while a page stays open.
 */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
