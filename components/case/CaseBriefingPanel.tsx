"use client";

import { useRouter } from "next/navigation";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { VictimProfile } from "./VictimProfile";
import { SuspectCard } from "@/components/suspects/SuspectCard";
import { SUSPECTS } from "@/lib/game/suspects";
import { CASE_META } from "@/lib/game/caseData";
import { useGameStore } from "@/hooks/useGameStore";

export function CaseBriefingPanel() {
  const router = useRouter();
  const markBriefingViewed = useGameStore((s) => s.markBriefingViewed);

  return (
    <div className="flex flex-col gap-6">
      <GameCard className="border-cyan-signal/30">
        <p className="font-mono mb-2 text-[11px] uppercase tracking-widest text-cyan-signal">
          ORION &middot; Case Briefing
        </p>
        <TypewriterText text={CASE_META.orionBriefing} className="text-sm leading-relaxed text-paper-dim" />
      </GameCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <VictimProfile />

        <GameCard>
          <p className="font-mono mb-2 text-[11px] uppercase tracking-widest text-amber">
            Crime Scene Summary
          </p>
          <p className="text-sm leading-relaxed text-paper-dim">{CASE_META.crimeSceneSummary}</p>
        </GameCard>
      </div>

      <GameCard>
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">Known Facts</p>
        <ul className="flex flex-col gap-2">
          {CASE_META.knownFacts.map((fact, i) => (
            <li key={i} className="flex gap-3 text-sm text-paper-dim">
              <span className="font-mono text-red-string">&middot;</span>
              {fact}
            </li>
          ))}
        </ul>
      </GameCard>

      <GameCard>
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-amber">
          Suspect Preview
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {SUSPECTS.map((s) => (
            <SuspectCard key={s.id} suspect={s} />
          ))}
        </div>
      </GameCard>

      <div className="flex justify-end">
        <GameButton
          size="lg"
          onClick={() => {
            markBriefingViewed();
            router.push("/case/board");
          }}
        >
          Start Investigation
        </GameButton>
      </div>
    </div>
  );
}
