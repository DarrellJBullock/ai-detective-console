"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { useGameStore } from "@/hooks/useGameStore";
import { getCase } from "@/lib/game/cases";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/case/briefing", label: "Briefing" },
  { href: "/case/board", label: "Board" },
  { href: "/case/evidence", label: "Evidence" },
  { href: "/case/timeline", label: "Timeline" },
  { href: "/case/accuse", label: "Accuse" },
];

export function CaseNav() {
  const pathname = usePathname();
  const caseId = useGameStore((s) => s.progress.caseId);
  const title = getCase(caseId).meta.title;

  return (
    <header className="sticky top-0 z-30 border-b border-steel bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link href="/" className="font-display text-sm tracking-wide text-paper hover:text-red-string">
          {title}
        </Link>
        <nav aria-label="Case navigation" className="flex flex-wrap gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "console-focus font-mono rounded-sm px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
                  active ? "bg-case-file-hover text-red-string" : "text-fog hover:text-paper"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <SaveIndicator />
      </div>
    </header>
  );
}
