import Link from "next/link";
import type { SuspectProfile } from "@/lib/game/types";
import { GameCard } from "@/components/ui/GameCard";

export function SuspectCard({ suspect, href }: { suspect: SuspectProfile; href?: string }) {
  const content = (
    <GameCard interactive={Boolean(href)} className="h-full">
      <div className="flex items-center gap-3">
        <div className="font-mono flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-steel text-xs text-fog">
          {suspect.portraitInitials}
        </div>
        <div>
          <div className="font-display text-sm text-paper">{suspect.name}</div>
          <div className="text-xs text-fog">{suspect.role}</div>
        </div>
      </div>
    </GameCard>
  );

  if (!href) return content;

  return (
    <Link href={href} className="console-focus block">
      {content}
    </Link>
  );
}
