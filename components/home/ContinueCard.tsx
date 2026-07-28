"use client";

import { useRouter } from "next/navigation";
import { useSavedCase } from "@/hooks/useSavedCase";
import { useGameStore } from "@/hooks/useGameStore";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import { CASE_META } from "@/lib/game/caseData";

export function ContinueCard() {
  const router = useRouter();
  const { ready, hasSave, evidenceCount, contradictionsCount, caseClosed } = useSavedCase();
  const continueCase = useGameStore((s) => s.continueCase);

  if (!ready || !hasSave) return null;

  return (
    <GameCard className="max-w-sm">
      <p className="font-mono mb-1 text-[11px] uppercase tracking-widest text-amber">Case in progress</p>
      <h3 className="font-display mb-3 text-lg text-paper">{CASE_META.title}</h3>
      <dl className="mb-4 grid grid-cols-2 gap-2 text-xs text-fog">
        <div>
          <dt className="uppercase tracking-wide">Evidence</dt>
          <dd className="font-mono text-paper">{evidenceCount} / 10</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Contradictions</dt>
          <dd className="font-mono text-paper">{contradictionsCount} / 4</dd>
        </div>
      </dl>
      <GameButton
        size="sm"
        onClick={() => {
          continueCase();
          router.push(caseClosed ? "/case/ending" : "/case/board");
        }}
      >
        {caseClosed ? "Review Case" : "Resume Investigation"}
      </GameButton>
    </GameCard>
  );
}
