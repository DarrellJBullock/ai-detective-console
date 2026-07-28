"use client";

import { useRouter } from "next/navigation";
import { GameButton } from "@/components/ui/GameButton";
import { GameCard } from "@/components/ui/GameCard";
import { useGameStore } from "@/hooks/useGameStore";
import { DetectiveGrade } from "./DetectiveGrade";
import { CaseStats } from "./CaseStats";
import { EndingCinematic } from "./EndingCinematic";

export function EndingResult() {
  const router = useRouter();
  const progress = useGameStore((s) => s.progress);
  const startNewCase = useGameStore((s) => s.startNewCase);

  if (!progress.detectiveGrade || !progress.endingType) {
    return (
      <GameCard className="mx-auto max-w-lg text-center">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-red-string">
          Case Still Open
        </p>
        <p className="mb-5 text-sm text-fog">
          You haven&apos;t submitted an accusation yet. The case can&apos;t close until you do.
        </p>
        <GameButton onClick={() => router.push("/case/accuse")}>Go to Accusation</GameButton>
      </GameCard>
    );
  }

  const { detectiveGrade, endingType, accusation } = progress;

  return (
    <div className="flex flex-col items-center gap-8">
      <DetectiveGrade grade={detectiveGrade.grade} score={detectiveGrade.score} />

      <div className="w-full max-w-2xl">
        <EndingCinematic
          endingType={endingType}
          grade={detectiveGrade}
          accusedSuspectId={accusation.suspectId}
        />
      </div>

      <div className="w-full max-w-2xl">
        <CaseStats breakdown={detectiveGrade.breakdown} />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <GameButton
          variant="secondary"
          onClick={() => {
            startNewCase();
            router.push("/case/briefing");
          }}
        >
          Replay Case
        </GameButton>
        <GameButton variant="ghost" onClick={() => router.push("/")}>
          Return to Menu
        </GameButton>
      </div>
    </div>
  );
}
