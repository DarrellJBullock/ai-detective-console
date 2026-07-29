"use client";

import { useEffect, useState } from "react";
import { GameCard } from "@/components/ui/GameCard";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { getCase } from "@/lib/game/cases";
import type { DetectiveGrade } from "@/lib/game/types";
import { useGameStore } from "@/hooks/useGameStore";

const ENDING_TITLES: Record<string, string> = {
  "perfect-solve": "Case Closed — Perfect Solve",
  "correct-weak-evidence": "Case Closed — Right Call, Thin Case",
  "wrong-accusation": "Case Closed — Wrong Accusation",
  "case-unsolved": "Case File — Unsolved",
};

export function EndingCinematic({
  endingType,
  grade,
  accusedSuspectId,
}: {
  endingType: string;
  grade: DetectiveGrade;
  accusedSuspectId: string | null;
}) {
  const settings = useGameStore((s) => s.settings);
  const caseId = useGameStore((s) => s.progress.caseId);
  const [narration, setNarration] = useState<string | null>(null);
  const accusedName = getCase(caseId).suspects.find((s) => s.id === accusedSuspectId)?.name ?? "no one";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/orion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ending",
        mode: settings.aiMode,
        caseId,
        correctSuspect: grade.breakdown.correctSuspect,
        correctMotive: grade.breakdown.correctMotive,
        gradeLabel: grade.grade,
        accusedSuspectName: accusedName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setNarration(data.text);
      })
      .catch(() => {
        if (!cancelled) setNarration("The case file closes. The full story stays with ORION's records.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GameCard className="border-red-string/30">
      <p className="font-mono mb-2 text-[11px] uppercase tracking-widest text-red-string">
        {ENDING_TITLES[endingType] ?? "Case Closed"}
      </p>
      {narration ? (
        <TypewriterText text={narration} className="text-sm leading-relaxed text-paper-dim" />
      ) : (
        <p className="font-mono text-xs text-fog">ORION is compiling the closing report...</p>
      )}
    </GameCard>
  );
}
