"use client";

import { useGameStore } from "@/hooks/useGameStore";

function formatRelative(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin === 1) return "1 min ago";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}

export function SaveIndicator() {
  const updatedAt = useGameStore((s) => s.progress.updatedAt);
  const hasSave = useGameStore((s) => s.hasSave);

  if (!hasSave) return null;

  return (
    <div className="font-mono flex items-center gap-2 text-[11px] uppercase tracking-wider text-fog">
      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
      <span>Saved &middot; {formatRelative(updatedAt)}</span>
    </div>
  );
}
