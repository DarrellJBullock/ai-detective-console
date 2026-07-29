import { GameCard } from "@/components/ui/GameCard";
import type { Victim } from "@/lib/game/types";

export function VictimProfile({ victim }: { victim: Victim }) {
  return (
    <GameCard>
      <p className="font-mono mb-2 text-[11px] uppercase tracking-widest text-red-string">Victim</p>
      <h2 className="font-display text-2xl text-paper">{victim.name}</h2>
      <p className="mb-4 text-sm text-fog">{victim.role}</p>
      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-fog uppercase tracking-wide">Age</dt>
          <dd className="font-mono text-paper">{victim.age}</dd>
        </div>
        <div>
          <dt className="text-fog uppercase tracking-wide">Time of death</dt>
          <dd className="font-mono text-paper">{victim.timeOfDeath}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-fog uppercase tracking-wide">Cause of death</dt>
          <dd className="font-mono text-paper">{victim.causeOfDeath}</dd>
        </div>
      </dl>
    </GameCard>
  );
}
