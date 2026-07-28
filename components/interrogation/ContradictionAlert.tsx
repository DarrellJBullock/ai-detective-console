"use client";

import { Modal } from "@/components/ui/Modal";
import type { ContradictionRule } from "@/lib/game/types";

export function ContradictionAlert({
  rule,
  onClose,
}: {
  rule: ContradictionRule | null;
  onClose: () => void;
}) {
  return (
    <Modal open={Boolean(rule)} onClose={onClose} title="Contradiction Caught">
      {rule && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono mb-1 text-[11px] uppercase tracking-widest text-fog">Their claim</p>
            <p className="rounded-sm border border-steel bg-ink-raised p-3 text-sm text-paper-dim">
              &ldquo;{rule.claimText}&rdquo;
            </p>
          </div>
          <div>
            <p className="font-mono mb-1 text-[11px] uppercase tracking-widest text-red-string">
              The evidence
            </p>
            <p className="rounded-sm border border-red-string/50 bg-red-string/10 p-3 text-sm text-paper">
              {rule.proofText}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
