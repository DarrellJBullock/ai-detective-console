import type { DetectiveGrade as DetectiveGradeType } from "@/lib/game/types";
import { GameCard } from "@/components/ui/GameCard";
import { GameBadge } from "@/components/ui/GameBadge";

export function CaseStats({ breakdown }: { breakdown: DetectiveGradeType["breakdown"] }) {
  return (
    <GameCard>
      <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-amber">Case Statistics</p>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-fog">Suspect</dt>
          <dd>
            <GameBadge variant={breakdown.correctSuspect ? "success" : "red"}>
              {breakdown.correctSuspect ? "Correct" : "Incorrect"}
            </GameBadge>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-fog">Motive</dt>
          <dd>
            <GameBadge variant={breakdown.correctMotive ? "success" : "red"}>
              {breakdown.correctMotive ? "Correct" : "Incorrect"}
            </GameBadge>
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-fog">Required Evidence</dt>
          <dd className="font-mono text-paper">
            {breakdown.requiredEvidenceFound} / {breakdown.requiredEvidenceTotal}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-fog">Contradictions</dt>
          <dd className="font-mono text-paper">
            {breakdown.contradictionsResolved} / {breakdown.contradictionsTotal}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-fog">Timeline Confidence</dt>
          <dd className="font-mono text-paper">{breakdown.timelineConfidence}%</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-fog">Hints Used</dt>
          <dd className="font-mono text-paper">{breakdown.hintsUsed}</dd>
        </div>
      </dl>
    </GameCard>
  );
}
