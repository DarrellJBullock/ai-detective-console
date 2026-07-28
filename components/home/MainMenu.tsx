"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { useGamepadNavigation } from "@/hooks/useGamepadNavigation";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  action: () => void;
}

export function MainMenu() {
  const router = useRouter();
  const hasSave = useGameStore((s) => s.hasSave);
  const startNewCase = useGameStore((s) => s.startNewCase);
  const continueCase = useGameStore((s) => s.continueCase);

  const items: MenuItem[] = [
    {
      id: "new-case",
      label: "New Case",
      action: () => {
        startNewCase();
        router.push("/case/briefing");
      },
    },
    {
      id: "continue",
      label: "Continue",
      disabled: !hasSave,
      action: () => {
        if (!hasSave) return;
        continueCase();
        router.push("/case/board");
      },
    },
    { id: "case-files", label: "Case Files", action: () => router.push("/case/briefing") },
    { id: "evidence-room", label: "Evidence Room", disabled: !hasSave, action: () => router.push("/case/evidence") },
    { id: "settings", label: "Settings", action: () => router.push("/settings") },
  ];

  const enabledItems = items.filter((i) => !i.disabled);
  const [focusIndex, setFocusIndex] = useState(0);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (dir: 1 | -1) => {
    setFocusIndex((prev) => {
      const next = (prev + dir + enabledItems.length) % enabledItems.length;
      refs.current[enabledItems[next].id]?.focus();
      return next;
    });
  };

  useGamepadNavigation({
    onUp: () => move(-1),
    onDown: () => move(1),
    onSelect: () => enabledItems[focusIndex]?.action(),
  });

  return (
    <nav aria-label="Main menu" className="flex flex-col gap-1">
      {items.map((item) => (
        <button
          key={item.id}
          ref={(el) => {
            refs.current[item.id] = el;
          }}
          disabled={item.disabled}
          onClick={item.action}
          onFocus={() => {
            const idx = enabledItems.findIndex((i) => i.id === item.id);
            if (idx >= 0) setFocusIndex(idx);
          }}
          className={cn(
            "console-focus font-display group flex items-center gap-3 py-2.5 text-left text-2xl tracking-wide transition-colors sm:text-3xl",
            item.disabled ? "cursor-not-allowed text-steel" : "text-paper hover:text-red-string"
          )}
        >
          <span
            className={cn(
              "font-mono text-sm text-red-string opacity-0 transition-opacity",
              !item.disabled && "group-hover:opacity-100 group-focus-visible:opacity-100"
            )}
          >
            &gt;
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
