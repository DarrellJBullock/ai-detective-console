"use client";

import { useEffect, useRef } from "react";
import type { DialogueLine, SuspectProfile } from "@/lib/game/types";
import { cn } from "@/lib/utils";

export function DialogueHistory({
  history,
  suspect,
}: {
  history: DialogueLine[];
  suspect: SuspectProfile;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [history.length]);

  return (
    <div
      className="flex h-[360px] flex-col gap-3 overflow-y-auto rounded-sm border border-steel bg-ink-raised p-4"
      role="log"
      aria-live="polite"
      aria-label="Interview transcript"
    >
      {history.length === 0 && (
        <p className="font-mono text-xs text-fog">
          Interview not yet started. Choose a question or present evidence to begin.
        </p>
      )}
      {history.map((line) => {
        const isPlayer = line.speaker === "player";
        return (
          <div key={line.id} className={cn("flex flex-col", isPlayer ? "items-end" : "items-start")}>
            <span className="font-mono mb-1 text-[10px] uppercase tracking-wider text-fog">
              {isPlayer ? "Detective" : suspect.name}
            </span>
            <div
              className={cn(
                "max-w-[85%] rounded-sm border px-3 py-2 text-sm leading-relaxed",
                isPlayer
                  ? "border-cyan-signal/40 bg-cyan-signal/5 text-paper"
                  : line.triggeredContradiction
                    ? "border-red-string bg-red-string/10 text-paper"
                    : "border-steel bg-case-file text-paper-dim"
              )}
            >
              {line.text}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
