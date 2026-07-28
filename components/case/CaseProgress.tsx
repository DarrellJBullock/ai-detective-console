"use client";

import { useGameStore } from "@/hooks/useGameStore";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EVIDENCE } from "@/lib/game/evidence";
import { CONTRADICTION_RULES } from "@/lib/game/contradictions";

export function CaseProgress() {
  const progress = useGameStore((s) => s.progress);
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
        max={EVIDENCE.length}
        variant="amber"
      />
      <ProgressBar
        label="Contradictions"
        value={contradictionsCount}
        max={CONTRADICTION_RULES.length}
        variant="red"
      />
      <ProgressBar label="Timeline Confidence" value={progress.timelineConfidence} variant="cyan" />
    </div>
  );
}
