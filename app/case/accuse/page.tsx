"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameShell } from "@/components/ui/GameShell";
import { CaseNav } from "@/components/case/CaseNav";
import { PageTransition } from "@/components/ui/PageTransition";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import { Modal } from "@/components/ui/Modal";
import { getCase } from "@/lib/game/cases";
import { useGameStore } from "@/hooks/useGameStore";
import { scoreAccusation, determineEnding } from "@/lib/game/scoring";
import type { EvidenceId, SuspectId } from "@/lib/game/types";
import { cn } from "@/lib/utils";

export default function AccusePage() {
  const router = useRouter();
  const progress = useGameStore((s) => s.progress);
  const setAccusation = useGameStore((s) => s.setAccusation);
  const submitAccusation = useGameStore((s) => s.submitAccusation);

  const [suspectId, setSuspectId] = useState<SuspectId | null>(progress.accusation.suspectId);
  const [motiveId, setMotiveId] = useState<string | null>(progress.accusation.motiveId);
  const [evidenceIds, setEvidenceIds] = useState<EvidenceId[]>(progress.accusation.evidenceIds);
  const [timelineExplanationId, setTimelineExplanationId] = useState<string | null>(
    progress.accusation.timelineExplanationId
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const caseDef = getCase(progress.caseId);
  const unlockedEvidence = caseDef.evidence.filter((e) => progress.evidenceUnlocked[e.id]);
  const canSubmit = suspectId && motiveId && timelineExplanationId && evidenceIds.length > 0;

  const toggleEvidence = (id: EvidenceId) => {
    setEvidenceIds((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const handleSubmit = () => {
    const accusation = {
      suspectId,
      motiveId,
      evidenceIds,
      timelineExplanationId,
      submitted: true,
    };
    setAccusation(accusation);
    const grade = scoreAccusation(accusation, progress);
    const ending = determineEnding(grade, accusation);
    submitAccusation(grade, ending);
    router.push("/case/ending");
  };

  return (
    <GameShell>
      <CaseNav />
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-8">
        <PageTransition>
          <h1 className="font-display mb-2 text-2xl text-paper sm:text-3xl">Final Accusation</h1>
          <p className="mb-8 text-sm text-fog">
            This is irreversible. Choose carefully — your grade depends on the strength of your case.
          </p>

          <div className="flex flex-col gap-6">
            <GameCard>
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
                1. Select Suspect
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {caseDef.suspects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSuspectId(s.id)}
                    aria-pressed={suspectId === s.id}
                    className={cn(
                      "console-focus rounded-sm border p-3 text-left transition-colors",
                      suspectId === s.id ? "border-red-string bg-case-file-hover" : "border-steel hover:border-fog"
                    )}
                  >
                    <div className="font-display text-sm text-paper">{s.name}</div>
                    <div className="text-xs text-fog">{s.role}</div>
                  </button>
                ))}
              </div>
            </GameCard>

            <GameCard>
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
                2. Select Motive
              </p>
              <div className="flex flex-col gap-2">
                {caseDef.motiveOptions.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMotiveId(m.id)}
                    aria-pressed={motiveId === m.id}
                    className={cn(
                      "console-focus rounded-sm border p-3 text-left text-sm transition-colors",
                      motiveId === m.id ? "border-red-string bg-case-file-hover text-paper" : "border-steel text-paper-dim hover:border-fog"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </GameCard>

            <GameCard>
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
                3. Select Key Evidence
              </p>
              <div className="flex flex-wrap gap-2">
                {unlockedEvidence.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => toggleEvidence(e.id)}
                    aria-pressed={evidenceIds.includes(e.id)}
                    className={cn(
                      "console-focus font-mono rounded-sm border px-3 py-1.5 text-xs transition-colors",
                      evidenceIds.includes(e.id)
                        ? "border-amber text-amber"
                        : "border-steel text-paper-dim hover:border-fog"
                    )}
                  >
                    {e.title}
                  </button>
                ))}
              </div>
            </GameCard>

            <GameCard>
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
                4. Select Timeline Explanation
              </p>
              <div className="flex flex-col gap-2">
                {caseDef.timelineExplanationOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTimelineExplanationId(t.id)}
                    aria-pressed={timelineExplanationId === t.id}
                    className={cn(
                      "console-focus rounded-sm border p-3 text-left text-sm transition-colors",
                      timelineExplanationId === t.id
                        ? "border-red-string bg-case-file-hover text-paper"
                        : "border-steel text-paper-dim hover:border-fog"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </GameCard>

            <div className="flex justify-end">
              <GameButton size="lg" disabled={!canSubmit} onClick={() => setConfirmOpen(true)}>
                Submit Accusation
              </GameButton>
            </div>
          </div>

          <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Accusation">
            <p className="mb-5 text-sm text-fog">
              Once submitted, the case closes and your detective grade is calculated. You cannot change
              your accusation afterward. Proceed?
            </p>
            <div className="flex justify-end gap-3">
              <GameButton variant="ghost" onClick={() => setConfirmOpen(false)}>
                Cancel
              </GameButton>
              <GameButton variant="primary" onClick={handleSubmit}>
                Confirm &amp; Close Case
              </GameButton>
            </div>
          </Modal>
        </PageTransition>
      </div>
    </GameShell>
  );
}
