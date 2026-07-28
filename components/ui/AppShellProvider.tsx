"use client";

import { useEffect } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useGameStore((s) => s.hydrate);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  return <>{children}</>;
}
