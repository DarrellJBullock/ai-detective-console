"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Evidence } from "@/lib/game/types";
import { GameBadge } from "@/components/ui/GameBadge";
import { SUSPECTS } from "@/lib/game/suspects";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function EvidenceDetailDrawer({
  evidence,
  onClose,
}: {
  evidence: Evidence | null;
  onClose: () => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {evidence && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-label={`${evidence.title} detail`}
            className="fixed right-0 top-0 z-50 h-dvh w-full max-w-md overflow-y-auto border-l border-steel bg-case-file p-6"
            initial={reducedMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              aria-label="Close evidence detail"
              className="console-focus font-mono mb-4 text-fog hover:text-red-string"
            >
              &larr; Back to inventory
            </button>

            <div className="mb-3 flex flex-wrap gap-2">
              <GameBadge variant="amber">{evidence.importanceLevel}</GameBadge>
              <GameBadge>{evidence.category.replace("-", " ")}</GameBadge>
              {evidence.contradictionTags.length > 0 && (
                <GameBadge variant="red">Contradiction Tagged</GameBadge>
              )}
            </div>

            <h2 className="font-display mb-2 text-2xl text-paper">{evidence.title}</h2>
            <p className="mb-6 text-sm leading-relaxed text-paper-dim">{evidence.description}</p>

            <dl className="flex flex-col gap-4 text-xs">
              <div>
                <dt className="mb-1 uppercase tracking-wide text-fog">Source</dt>
                <dd className="font-mono text-paper">{evidence.sourceLocation}</dd>
              </div>
              <div>
                <dt className="mb-1 uppercase tracking-wide text-fog">Discovered</dt>
                <dd className="font-mono text-paper">{evidence.discoveredAt}</dd>
              </div>
              <div>
                <dt className="mb-1 uppercase tracking-wide text-fog">Related suspects</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {evidence.relatedSuspects.length === 0 && <span className="text-fog">None identified</span>}
                  {evidence.relatedSuspects.map((id) => {
                    const suspect = SUSPECTS.find((s) => s.id === id);
                    if (!suspect) return null;
                    return (
                      <Link
                        key={id}
                        href={`/case/suspects/${id}`}
                        className="console-focus font-mono rounded-sm border border-steel px-2 py-1 text-paper hover:border-cyan-signal hover:text-cyan-signal"
                      >
                        {suspect.name}
                      </Link>
                    );
                  })}
                </dd>
              </div>
            </dl>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
