"use client";

import { useGameStore } from "@/hooks/useGameStore";
import { getCase } from "@/lib/game/cases";
import { cn } from "@/lib/utils";
import type { EvidenceId } from "@/lib/game/types";

export function EvidencePresenter({
  onPresent,
  disabled,
}: {
  onPresent: (evidenceId: EvidenceId) => void;
  disabled?: boolean;
}) {
  const caseId = useGameStore((s) => s.progress.caseId);
  const evidenceUnlocked = useGameStore((s) => s.progress.evidenceUnlocked);
  const unlockedEvidence = getCase(caseId).evidence.filter((e) => evidenceUnlocked[e.id]);

  if (unlockedEvidence.length === 0) {
    return <p className="font-mono text-xs text-fog">No evidence unlocked yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {unlockedEvidence.map((e) => (
        <button
          key={e.id}
          disabled={disabled}
          onClick={() => onPresent(e.id)}
          className={cn(
            "console-focus font-mono rounded-sm border border-steel px-3 py-1.5 text-xs text-paper-dim transition-colors hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          {e.title}
        </button>
      ))}
    </div>
  );
}
