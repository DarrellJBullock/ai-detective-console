"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import { getCase } from "@/lib/game/cases";
import type { SuspectId } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface OrionPanelProps {
  variant: "summary" | "hint";
  focusSuspectId?: SuspectId;
  className?: string;
}

export function OrionPanel({ variant, focusSuspectId, className }: OrionPanelProps) {
  const progress = useGameStore((s) => s.progress);
  const settings = useGameStore((s) => s.settings);
  const incrementHint = useGameStore((s) => s.incrementHint);
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [glitch, setGlitch] = useState(false);

  const caseDef = getCase(progress.caseId);
  const unlockedEvidenceTitles = caseDef.evidence.filter((e) => progress.evidenceUnlocked[e.id]).map(
    (e) => e.title
  );
  const contradictionsFound = Object.values(progress.suspectStates).flatMap(
    (s) => s.contradictionsFound
  );

  const fetchOrion = async (type: "summary" | "hint") => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/orion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          mode: settings.aiMode,
          caseId: progress.caseId,
          caseProgressSummary: "",
          unlockedEvidenceTitles,
          contradictionsFound,
          timelineConfidence: progress.timelineConfidence,
          focusSuspectId,
        }),
      });
      const data = await res.json();
      setText(data.text);
      setGlitch(true);
      setTimeout(() => setGlitch(false), 250);
      if (type === "hint") incrementHint();
    } catch {
      setText("ORION connection unstable. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (variant !== "summary") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch-on-mount for the case summary
    fetchOrion("summary");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  return (
    <GameCard className={cn("border-cyan-signal/30", className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono flex items-center gap-2 text-[11px] uppercase tracking-widest text-cyan-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-signal" aria-hidden />
          ORION
        </p>
        {variant === "summary" && (
          <button
            onClick={() => fetchOrion("summary")}
            className="console-focus font-mono text-[11px] text-fog hover:text-cyan-signal"
            disabled={loading}
          >
            refresh
          </button>
        )}
      </div>

      {variant === "hint" && !text && (
        <GameButton variant="secondary" size="sm" onClick={() => fetchOrion("hint")} disabled={loading}>
          {loading ? "Analyzing..." : "Request Hint"}
        </GameButton>
      )}

      {text && (
        <p className={cn("text-sm leading-relaxed text-paper-dim", glitch && "orion-glitch")}>{text}</p>
      )}

      {variant === "hint" && text && (
        <GameButton
          variant="ghost"
          size="sm"
          className="mt-3"
          onClick={() => fetchOrion("hint")}
          disabled={loading}
        >
          Ask again
        </GameButton>
      )}

      {loading && !text && <p className="font-mono text-xs text-fog">Analyzing case data...</p>}
    </GameCard>
  );
}
