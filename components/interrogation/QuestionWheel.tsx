"use client";

import type { PresetQuestion, QuestionCategory } from "@/lib/game/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  timeline: "Timeline",
  relationship: "Relationship",
  motive: "Motive",
  alibi: "Alibi",
  evidence: "Evidence",
  pressure: "Pressure",
};

interface QuestionWheelProps {
  questions: PresetQuestion[];
  onAsk: (question: PresetQuestion) => void;
  disabled?: boolean;
}

export function QuestionWheel({ questions, onAsk, disabled }: QuestionWheelProps) {
  const radius = 44;
  const center = 50;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="font-display flex h-16 w-16 items-center justify-center rounded-full border border-red-string/50 text-center text-[11px] text-red-string">
          ASK
        </div>
      </div>
      {questions.map((q, i) => {
        const angle = (i / questions.length) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <button
            key={q.id}
            disabled={disabled}
            onClick={() => onAsk(q)}
            style={{ left: `${x}%`, top: `${y}%` }}
            className={cn(
              "console-focus font-mono absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-steel bg-case-file px-2 py-1.5 text-center text-[10px] uppercase tracking-wide text-fog transition-colors hover:border-cyan-signal hover:text-cyan-signal disabled:cursor-not-allowed disabled:opacity-40"
            )}
            title={q.prompt}
          >
            {CATEGORY_LABELS[q.category]}
          </button>
        );
      })}
    </div>
  );
}
