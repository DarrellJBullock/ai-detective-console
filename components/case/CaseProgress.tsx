"use client";

import { useGameStore } from "@/hooks/useGameStore";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getCase } from "@/lib/game/cases";

export function CaseProgress() {
  const progress = useGameStore((s) => s.progress);
  const caseDef = getCase(progress.caseId);
  const evidenceCount = Object.values(progress.evidenceUnlocked).filter(Boolean).length;
  const contradictionsCount = Object.values(progress.suspectStates).reduce(
    (sum, s) => sum + s.contradictionsFound.length,
    0
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <ProgressBar
        label="Evidence Found"
        value={evidenceCount}
        max={caseDef.evidence.length}
        variant="amber"
      />
      <ProgressBar
        label="Contradictions"
        value={contradictionsCount}
        max={caseDef.contradictions.length}
        variant="red"
      />
      <ProgressBar label="Timeline Confidence" value={progress.timelineConfidence} variant="cyan" />
    </div>
  );
}
