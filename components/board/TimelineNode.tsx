import type { TimelineEvent } from "@/lib/game/types";
import { cn } from "@/lib/utils";

export function TimelineNode({ event }: { event: TimelineEvent }) {
  return (
    <div
      className={cn(
        "panel flex min-w-[180px] shrink-0 flex-col gap-1 rounded-sm p-3",
        event.contested && "border-red-string/50"
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-amber">{event.time}</span>
      <span className="text-xs leading-tight text-paper-dim">{event.title}</span>
      {event.contested && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-red-string">Contested</span>
      )}
    </div>
  );
}
