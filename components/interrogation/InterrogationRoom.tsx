"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContradictionRule, EvidenceId, PresetQuestion, SuspectProfile } from "@/lib/game/types";
import type { InterviewResult } from "@/lib/ai/aiProvider";
import { useGameStore } from "@/hooks/useGameStore";
import { getEvidenceById } from "@/lib/game/evidence";
import { makeId } from "@/lib/utils";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import { DialogueHistory } from "./DialogueHistory";
import { QuestionWheel } from "./QuestionWheel";
import { QuestionInput } from "./QuestionInput";
import { EvidencePresenter } from "./EvidencePresenter";
import { PressureMeter } from "./PressureMeter";
import { TruthMeter } from "./TruthMeter";
import { ContradictionAlert } from "./ContradictionAlert";
import { OrionPanel } from "@/components/case/OrionPanel";

export function InterrogationRoom({ suspect }: { suspect: SuspectProfile }) {
  const router = useRouter();
  const state = useGameStore((s) => s.progress.suspectStates[suspect.id]);
  const settings = useGameStore((s) => s.settings);
  const recordInterviewExchange = useGameStore((s) => s.recordInterviewExchange);
  const evidenceUnlocked = useGameStore((s) => s.progress.evidenceUnlocked);

  const [loading, setLoading] = useState(false);
  const [pendingContradiction, setPendingContradiction] = useState<ContradictionRule | null>(null);

  const unlockedEvidenceIds = Object.entries(evidenceUnlocked)
    .filter(([, unlocked]) => unlocked)
    .map(([id]) => id as EvidenceId);

  async function submitInteraction(payload: {
    category: PresetQuestion["category"] | "custom";
    presetQuestionId?: string;
    questionText: string;
    presentedEvidenceId?: EvidenceId;
  }) {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: settings.aiMode,
          suspectId: suspect.id,
          category: payload.category,
          presetQuestionId: payload.presetQuestionId,
          questionText: payload.questionText,
          presentedEvidenceId: payload.presentedEvidenceId,
          stress: state.stress,
          trust: state.trust,
          pressure: state.pressure,
          truth: state.truth,
          contradictionsFound: state.contradictionsFound,
          unlockedEvidenceIds,
          conversationHistory: state.dialogueHistory,
        }),
      });
      const result: InterviewResult = await res.json();

      const now = Date.now();
      const playerLine = {
        id: makeId("line"),
        speaker: "player" as const,
        text: payload.questionText,
        timestamp: now,
        category: payload.category === "custom" ? undefined : payload.category,
        presentedEvidenceId: payload.presentedEvidenceId,
      };
      const suspectLine = {
        id: makeId("line"),
        speaker: suspect.id,
        text: result.dialogue,
        timestamp: now + 1,
        triggeredContradiction: Boolean(result.contradictionTriggered),
      };

      recordInterviewExchange(suspect.id, playerLine, suspectLine, result);

      if (result.contradictionTriggered) {
        setPendingContradiction(result.contradictionTriggered);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleAskPreset = (q: PresetQuestion) =>
    submitInteraction({ category: q.category, presetQuestionId: q.id, questionText: q.prompt });

  const handleAskCustom = (text: string) => submitInteraction({ category: "custom", questionText: text });

  const handlePresentEvidence = (evidenceId: EvidenceId) => {
    const evidence = getEvidenceById(evidenceId);
    submitInteraction({
      category: "evidence",
      questionText: `[Presents evidence: ${evidence?.title ?? evidenceId}]`,
      presentedEvidenceId: evidenceId,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <GameCard className="relative overflow-hidden border-red-string/20">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,59,78,0.08), transparent 60%), radial-gradient(circle at 80% 80%, rgba(62,214,196,0.06), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="font-mono flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-string/60 text-lg text-paper">
                {suspect.portraitInitials}
              </div>
              <div>
                <h1 className="font-display text-xl text-paper sm:text-2xl">{suspect.name}</h1>
                <p className="text-xs text-fog">{suspect.role} &middot; Interrogation Room</p>
              </div>
            </div>
            <GameButton variant="ghost" size="sm" onClick={() => router.push(`/case/suspects/${suspect.id}`)}>
              Exit
            </GameButton>
          </div>
        </GameCard>

        <div className="grid gap-4 sm:grid-cols-2">
          <PressureMeter value={state.pressure} />
          <TruthMeter value={state.truth} />
        </div>

        <DialogueHistory history={state.dialogueHistory} suspect={suspect} />

        <GameCard>
          <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
            Present Evidence
          </p>
          <EvidencePresenter onPresent={handlePresentEvidence} disabled={loading} />
        </GameCard>

        <GameCard>
          <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
            Custom Question
          </p>
          <QuestionInput onAsk={handleAskCustom} disabled={loading} />
        </GameCard>
      </div>

      <div className="flex flex-col gap-6">
        <GameCard>
          <p className="font-mono mb-3 text-center text-[11px] uppercase tracking-widest text-amber">
            Question Wheel
          </p>
          <QuestionWheel questions={suspect.presetQuestions} onAsk={handleAskPreset} disabled={loading} />
        </GameCard>
        <OrionPanel variant="hint" focusSuspectId={suspect.id} />
      </div>

      <ContradictionAlert rule={pendingContradiction} onClose={() => setPendingContradiction(null)} />
    </div>
  );
}
