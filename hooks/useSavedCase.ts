"use client";

import { useEffect } from "react";
import { useGameStore } from "./useGameStore";

export function useSavedCase() {
  const hydrate = useGameStore((s) => s.hydrate);
  const hydrated = useGameStore((s) => s.hydrated);
  const hasSave = useGameStore((s) => s.hasSave);
  const progress = useGameStore((s) => s.progress);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const evidenceCount = Object.values(progress.evidenceUnlocked).filter(Boolean).length;
  const contradictionsCount = Object.values(progress.suspectStates).reduce(
    (sum, s) => sum + s.contradictionsFound.length,
    0
  );

  return {
    ready: hydrated,
    hasSave,
    updatedAt: progress.updatedAt,
    evidenceCount,
    contradictionsCount,
    caseClosed: Boolean(progress.endingType),
  };
}
