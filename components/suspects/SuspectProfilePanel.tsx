"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { getCase, getSuspect } from "@/lib/game/cases";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import { GameBadge } from "@/components/ui/GameBadge";
import { StressMeter } from "./StressMeter";
import { TrustMeter } from "./TrustMeter";

export function SuspectProfilePanel({ suspectId }: { suspectId: string }) {
  const router = useRouter();
  const hydrated = useGameStore((s) => s.hydrated);
  const caseId = useGameStore((s) => s.progress.caseId);
  const suspect = getSuspect(caseId, suspectId);
  const state = useGameStore((s) => s.progress.suspectStates[suspectId]);
  const evidenceUnlocked = useGameStore((s) => s.progress.evidenceUnlocked);
  const unlockEvidenceForSuspect = useGameStore((s) => s.unlockEvidenceForSuspect);

  useEffect(() => {
    // Wait for the store to finish loading from localStorage — acting before
    // hydration completes would be overwritten the moment it does.
    if (hydrated && suspect) unlockEvidenceForSuspect(suspectId);
  }, [suspectId, suspect, hydrated, unlockEvidenceForSuspect]);

  if (!suspect || !state) {
    return (
      <GameCard className="mx-auto max-w-md text-center">
        <p className="mb-4 text-sm text-fog">That suspect isn&apos;t part of {getCase(caseId).meta.title}.</p>
        <GameButton onClick={() => router.push("/case/board")}>Back to Case Board</GameButton>
      </GameCard>
    );
  }

  const relatedEvidence = getCase(caseId).evidence.filter((e) => e.relatedSuspects.includes(suspectId));

  return (
    <div className="flex flex-col gap-6">
      <GameCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="font-mono flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-steel text-lg text-fog">
              {suspect.portraitInitials}
            </div>
            <div>
              <h1 className="font-display text-2xl text-paper sm:text-3xl">{suspect.name}</h1>
              <p className="text-sm text-fog">{suspect.role}</p>
            </div>
          </div>
          <GameButton onClick={() => router.push(`/case/interrogate/${suspect.id}`)}>
            Start Interrogation
          </GameButton>
        </div>
      </GameCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <GameCard>
          <p className="font-mono mb-2 text-[11px] uppercase tracking-widest text-amber">Motive</p>
          <p className="text-sm leading-relaxed text-paper-dim">{suspect.motive}</p>
        </GameCard>
        <GameCard>
          <p className="font-mono mb-2 text-[11px] uppercase tracking-widest text-amber">Personality</p>
          <p className="text-sm leading-relaxed text-paper-dim">{suspect.personality}</p>
        </GameCard>
      </div>

      <GameCard>
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">Known Timeline</p>
        <ul className="flex flex-col gap-2">
          {suspect.knownTimeline.map((entry, i) => (
            <li key={i} className="flex gap-3 text-sm text-paper-dim">
              <span className="font-mono text-cyan-signal">&middot;</span>
              {entry}
            </li>
          ))}
        </ul>
      </GameCard>

      <GameCard>
        <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-amber">Interview Status</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <StressMeter value={state.stress} />
          <TrustMeter value={state.trust} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {state.contradictionsFound.length > 0 ? (
            <GameBadge variant="red">{state.contradictionsFound.length} Contradiction(s) Found</GameBadge>
          ) : (
            <GameBadge>No contradictions yet</GameBadge>
          )}
          <GameBadge variant={state.interviewed ? "success" : "neutral"}>
            {state.interviewed ? `${state.dialogueHistory.length / 2} exchanges` : "Not interviewed"}
          </GameBadge>
        </div>
      </GameCard>

      <GameCard>
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
          Connected Evidence
        </p>
        <div className="flex flex-wrap gap-2">
          {relatedEvidence.map((e) => (
            <GameBadge key={e.id} variant={evidenceUnlocked[e.id] ? "cyan" : "neutral"}>
              {evidenceUnlocked[e.id] ? e.title : "Locked file"}
            </GameBadge>
          ))}
        </div>
      </GameCard>
    </div>
  );
}
