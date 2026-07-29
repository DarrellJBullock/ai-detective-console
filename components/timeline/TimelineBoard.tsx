"use client";

import { useEffect, useMemo } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { getCase } from "@/lib/game/cases";
import { TimelineEventCard } from "./TimelineEventCard";
import { TimelineValidator } from "./TimelineValidator";
import { OrionPanel } from "@/components/case/OrionPanel";

export function TimelineBoard() {
  const hydrated = useGameStore((s) => s.hydrated);
  const caseId = useGameStore((s) => s.progress.caseId);
  const suspectStates = useGameStore((s) => s.progress.suspectStates);
  const timelineConfidence = useGameStore((s) => s.progress.timelineConfidence);
  const setTimelineConfidence = useGameStore((s) => s.setTimelineConfidence);
  const timelineEvents = getCase(caseId).timeline;

  const allFoundTags = useMemo(
    () => new Set(Object.values(suspectStates).flatMap((s) => s.contradictionsFound)),
    [suspectStates]
  );

  const contestedEvents = timelineEvents.filter((e) => e.contested);
  const resolvedCount = contestedEvents.filter(
    (e) => e.resolvesWithTag && allFoundTags.has(e.resolvesWithTag)
  ).length;

  const confidence = Math.round(
    ((timelineEvents.length - contestedEvents.length + resolvedCount) / timelineEvents.length) * 100
  );

  useEffect(() => {
    // Wait for the store to finish loading from localStorage — acting before
    // hydration completes would be overwritten the moment it does.
    if (hydrated && confidence !== timelineConfidence) {
      setTimelineConfidence(confidence);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confidence, hydrated]);

  const sorted = [...timelineEvents].sort((a, b) => a.sortKey - b.sortKey);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        {sorted.map((event) => (
          <TimelineEventCard
            key={event.id}
            event={event}
            resolved={Boolean(event.resolvesWithTag && allFoundTags.has(event.resolvesWithTag))}
          />
        ))}
      </div>
      <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
        <TimelineValidator
          confidence={confidence}
          resolvedCount={resolvedCount}
          contestedTotal={contestedEvents.length}
        />
        <OrionPanel variant="summary" />
      </aside>
    </div>
  );
}
