"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { EVIDENCE } from "@/lib/game/evidence";
import type { Evidence, EvidenceCategory } from "@/lib/game/types";
import { Tabs } from "@/components/ui/Tabs";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceDetailDrawer } from "./EvidenceDetailDrawer";

const CATEGORY_TABS: { id: EvidenceCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "document", label: "Documents" },
  { id: "digital", label: "Digital" },
  { id: "physical", label: "Physical" },
  { id: "audio", label: "Audio" },
  { id: "access-record", label: "Access Records" },
];

export function EvidenceInventory() {
  const evidenceUnlocked = useGameStore((s) => s.progress.evidenceUnlocked);
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Evidence | null>(null);

  const filtered = useMemo(() => {
    return EVIDENCE.filter((e) => {
      const matchesCategory = category === "all" || e.category === category;
      const matchesQuery =
        query.trim().length === 0 || e.title.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const unlockedCount = Object.values(evidenceUnlocked).filter(Boolean).length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs items={CATEGORY_TABS} activeId={category} onChange={setCategory} />
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-fog">{unlockedCount} / {EVIDENCE.length} unlocked</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search evidence..."
            aria-label="Search evidence"
            className="console-focus panel rounded-sm px-3 py-1.5 text-sm text-paper placeholder:text-fog"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((evidence) => (
          <EvidenceCard
            key={evidence.id}
            evidence={evidence}
            unlocked={evidenceUnlocked[evidence.id]}
            onSelect={() => evidenceUnlocked[evidence.id] && setSelected(evidence)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-fog">No evidence matches your search.</p>
      )}

      <EvidenceDetailDrawer evidence={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
