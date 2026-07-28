"use client";

import Link from "next/link";
import type { SuspectProfile, SuspectRuntimeState } from "@/lib/game/types";
import { GameCard } from "@/components/ui/GameCard";
import { ContradictionBadge } from "./ContradictionBadge";

interface SuspectNodeProps {
  suspect: SuspectProfile;
  state: SuspectRuntimeState;
  registerRef: (id: string, el: HTMLElement | null) => void;
}

export function SuspectNode({ suspect, state, registerRef }: SuspectNodeProps) {
  return (
    <Link
      href={`/case/suspects/${suspect.id}`}
      ref={(el) => registerRef(`suspect-${suspect.id}`, el)}
      className="console-focus block"
    >
      <GameCard interactive className="h-full">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg text-paper">{suspect.name}</h3>
            <p className="text-xs text-fog">{suspect.role}</p>
          </div>
          <div className="font-mono flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-steel text-xs text-fog">
            {suspect.portraitInitials}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {state.interviewed ? (
            <ContradictionBadge count={state.contradictionsFound.length} />
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Not yet interviewed</span>
          )}
        </div>
      </GameCard>
    </Link>
  );
}
