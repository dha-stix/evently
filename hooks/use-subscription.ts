"use client";

import { useEffect, useRef, useState } from "react";
import type { Unsubscribe } from "@/lib/firebase-actions";

type Subscriber<A extends readonly unknown[], T> = (
  ...args: [...A, (data: T) => void, (error: Error) => void]
) => Unsubscribe;
type Result<T> = { key: string; data: T | null; error: Error | null };

/**
 * Subscribes to a live `subscribeTo…` function from lib/firebase-actions while mounted.
 *
 *   const { data, loading, error } = useSubscription(subscribeToEvent, [eventId]);
 *
 * Re-subscribes when `args` change. Pass `null` as args to wait (e.g. until the user is known).
 */
export function useSubscription<const A extends readonly unknown[], T>(subscribe: Subscriber<A, T>, args: A | null) {
  const key = args ? JSON.stringify(args) : null;
  const latest = useRef({ subscribe, args });
  useEffect(() => {
    latest.current = { subscribe, args };
  });

  const [result, setResult] = useState<Result<T> | null>(null);

  useEffect(() => {
    if (key === null) return;
    const { subscribe: fn, args: current } = latest.current;
    const onData = (data: T) => setResult({ key, data, error: null });
    const onError = (error: Error) => setResult({ key, data: null, error });
    try {
      return fn(...([...(current ?? []), onData, onError] as unknown as [...A, typeof onData, typeof onError]));
    } catch (error) {
      // e.g. Firebase isn't configured yet; report it like any other error.
      queueMicrotask(() => onError(error as Error));
    }
  }, [key]);

  const current = key !== null && result?.key === key ? result : null;
  return { data: current?.data ?? null, error: current?.error ?? null, loading: key !== null && !current };
}
