"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "./useGameStore";

export function useReducedMotion(): boolean {
  const settingsReduced = useGameStore((s) => s.settings.reducedMotion);
  const [systemReduced, setSystemReduced] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (event: MediaQueryListEvent) => setSystemReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return settingsReduced || systemReduced;
}
