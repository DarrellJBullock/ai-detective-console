import { ProgressBar } from "@/components/ui/ProgressBar";
import { GameCard } from "@/components/ui/GameCard";

export function TimelineValidator({ confidence, resolvedCount, contestedTotal }: {
  confidence: number;
  resolvedCount: number;
  contestedTotal: number;
}) {
  const message =
    confidence >= 90
      ? "The timeline holds together. Every contested moment is backed by evidence."
      : confidence >= 50
        ? "The timeline is taking shape, but contested moments still need proof."
        : "Most of the timeline is still unconfirmed. Present evidence during interrogation to resolve it.";

  return (
    <GameCard>
      <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
        Timeline Validation
      </p>
      <ProgressBar label="Confidence Score" value={confidence} variant="cyan" />
      <p className="mt-3 text-sm text-paper-dim">{message}</p>
      <p className="font-mono mt-2 text-xs text-fog">
        {resolvedCount} / {contestedTotal} contested events resolved
      </p>
    </GameCard>
  );
}
