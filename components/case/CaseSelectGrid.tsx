"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import { GameBadge } from "@/components/ui/GameBadge";
import { CASE_LIST } from "@/lib/game/cases";

export function CaseSelectGrid() {
  const router = useRouter();
  const startNewCase = useGameStore((s) => s.startNewCase);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {CASE_LIST.map((meta) => (
        <GameCard key={meta.id} className="flex flex-col">
          <div className="mb-3 flex items-center justify-between gap-2">
            <GameBadge variant={meta.difficulty === "advanced" ? "red" : "cyan"}>{meta.difficulty}</GameBadge>
          </div>
          <h2 className="font-display mb-1 text-xl text-paper">{meta.title}</h2>
          <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-fog">
            Victim: {meta.victim.name} &middot; {meta.victim.role}
          </p>
          <p className="mb-6 flex-1 text-sm leading-relaxed text-paper-dim">{meta.tagline}</p>
          <GameButton
            onClick={() => {
              startNewCase(meta.id);
              router.push("/case/briefing");
            }}
          >
            Start Investigation
          </GameButton>
        </GameCard>
      ))}
    </div>
  );
}
