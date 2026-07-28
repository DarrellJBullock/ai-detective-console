"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { SUSPECTS } from "@/lib/game/suspects";
import { EVIDENCE } from "@/lib/game/evidence";
import { CONTRADICTION_RULES } from "@/lib/game/contradictions";
import { TIMELINE_EVENTS } from "@/lib/game/timeline";
import type { Evidence } from "@/lib/game/types";
import { SuspectNode } from "./SuspectNode";
import { EvidenceNode } from "./EvidenceNode";
import { TimelineNode } from "./TimelineNode";
import { RedStringLayer } from "./RedStringLayer";
import { Modal } from "@/components/ui/Modal";
import { GameBadge } from "@/components/ui/GameBadge";

export function EvidenceBoard() {
  const router = useRouter();
  const progress = useGameStore((s) => s.progress);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  const [connections, setConnections] = useState<
    { x1: number; y1: number; x2: number; y2: number; key: string }[]
  >([]);

  useEffect(() => {
    const recompute = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      const found = CONTRADICTION_RULES.filter((rule) =>
        progress.suspectStates[rule.suspectId]?.contradictionsFound.includes(rule.contradictionTag)
      );

      const next = found
        .map((rule) => {
          const fromEl = nodeRefs.current.get(`suspect-${rule.suspectId}`);
          const toEl = nodeRefs.current.get(`evidence-${rule.triggerEvidenceId}`);
          if (!fromEl || !toEl) return null;
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          return {
            key: rule.id,
            x1: fromRect.left + fromRect.width / 2 - containerRect.left,
            y1: fromRect.bottom - containerRect.top,
            x2: toRect.left + toRect.width / 2 - containerRect.left,
            y2: toRect.top - containerRect.top,
          };
        })
        .filter((c): c is NonNullable<typeof c> => c !== null);

      setConnections(next);
    };

    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [progress.suspectStates]);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-8">
      <RedStringLayer connections={connections} />

      <section>
        <h2 className="font-display mb-3 text-sm text-amber">Suspects</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {SUSPECTS.map((suspect) => (
            <SuspectNode
              key={suspect.id}
              suspect={suspect}
              state={progress.suspectStates[suspect.id]}
              registerRef={registerRef}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display mb-3 text-sm text-amber">Timeline Preview</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {TIMELINE_EVENTS.map((event) => (
            <TimelineNode key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm text-amber">Evidence Board</h2>
          <button
            onClick={() => router.push("/case/evidence")}
            className="console-focus font-mono text-[11px] uppercase tracking-wider text-fog hover:text-cyan-signal"
          >
            Open Evidence Room &rarr;
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {EVIDENCE.map((evidence) => (
            <EvidenceNode
              key={evidence.id}
              evidence={evidence}
              unlocked={progress.evidenceUnlocked[evidence.id]}
              registerRef={registerRef}
              onSelect={setSelectedEvidence}
            />
          ))}
        </div>
      </section>

      <Modal
        open={Boolean(selectedEvidence)}
        onClose={() => setSelectedEvidence(null)}
        title={selectedEvidence?.title ?? ""}
      >
        {selectedEvidence && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <GameBadge variant="amber">{selectedEvidence.importanceLevel}</GameBadge>
              <GameBadge>{selectedEvidence.category}</GameBadge>
            </div>
            <p className="text-sm leading-relaxed text-paper-dim">{selectedEvidence.description}</p>
            <p className="font-mono text-xs text-fog">Source: {selectedEvidence.sourceLocation}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
