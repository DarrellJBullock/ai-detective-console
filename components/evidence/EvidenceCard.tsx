"use client";

import type { Evidence } from "@/lib/game/types";
import { GameBadge } from "@/components/ui/GameBadge";
import { cn } from "@/lib/utils";

const IMPORTANCE_VARIANT = {
  low: "neutral",
  medium: "cyan",
  high: "amber",
  critical: "red",
} as const;

export function EvidenceCard({
  evidence,
  unlocked,
  onSelect,
}: {
  evidence: Evidence;
  unlocked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={!unlocked}
      className={cn(
        "console-focus panel flex h-full flex-col gap-2 rounded-sm p-4 text-left transition-opacity",
        !unlocked && "cursor-not-allowed opacity-40"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-fog">
          {evidence.category.replace("-", " ")}
        </span>
        <GameBadge variant={IMPORTANCE_VARIANT[evidence.importanceLevel]}>
          {evidence.importanceLevel}
        </GameBadge>
      </div>
      <h3 className="font-display text-base leading-tight text-paper">
        {unlocked ? evidence.title : "??? Unidentified File"}
      </h3>
      {unlocked ? (
        <p className="line-clamp-2 text-xs text-fog">{evidence.description}</p>
      ) : (
        <p className="text-xs text-fog">Unlocks after interviewing a related suspect.</p>
      )}
    </button>
  );
}
