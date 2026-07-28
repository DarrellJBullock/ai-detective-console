import type { TimelineEvent } from "@/lib/game/types";
import { GameBadge } from "@/components/ui/GameBadge";
import { SUSPECTS } from "@/lib/game/suspects";
import { cn } from "@/lib/utils";

export function TimelineEventCard({ event, resolved }: { event: TimelineEvent; resolved: boolean }) {
  const suspects = event.relatedSuspects.map((id) => SUSPECTS.find((s) => s.id === id)?.name).filter(Boolean);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-3 w-3 shrink-0 rounded-full border-2",
            event.contested
              ? resolved
                ? "border-success bg-success"
                : "border-red-string bg-transparent"
              : "border-cyan-signal bg-cyan-signal"
          )}
        />
        <div className="w-px flex-1 bg-steel" />
      </div>
      <div className="panel mb-6 flex-1 rounded-sm p-4">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-amber">{event.time}</span>
          {event.contested && (
            <GameBadge variant={resolved ? "success" : "red"}>
              {resolved ? "Confirmed by evidence" : "Contested"}
            </GameBadge>
          )}
        </div>
        <h3 className="font-display mb-1 text-base text-paper">{event.title}</h3>
        <p className="mb-2 text-sm text-fog">{event.description}</p>
        {suspects.length > 0 && (
          <p className="font-mono text-[11px] uppercase tracking-wide text-fog">
            Involves: {suspects.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
