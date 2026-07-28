"use client";

import type { Evidence } from "@/lib/game/types";
import { GameBadge } from "@/components/ui/GameBadge";
import { cn } from "@/lib/utils";

interface EvidenceNodeProps {
  evidence: Evidence;
  unlocked: boolean;
  registerRef: (id: string, el: HTMLElement | null) => void;
  onSelect: (evidence: Evidence) => void;
}

export function EvidenceNode({ evidence, unlocked, registerRef, onSelect }: EvidenceNodeProps) {
  return (
    <button
      ref={(el) => registerRef(`evidence-${evidence.id}`, el)}
      onClick={() => unlocked && onSelect(evidence)}
      disabled={!unlocked}
      className={cn(
        "console-focus panel flex w-full flex-col gap-1.5 rounded-sm p-3 text-left transition-opacity",
        !unlocked && "cursor-not-allowed opacity-40"
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-fog">
        {unlocked ? evidence.category : "locked"}
      </span>
      <span className="font-display text-sm leading-tight text-paper">
        {unlocked ? evidence.title : "??? Unidentified File"}
      </span>
      {unlocked && evidence.contradictionTags.length > 0 && (
        <GameBadge variant="red" className="w-fit">
          Tagged
        </GameBadge>
      )}
    </button>
  );
}
