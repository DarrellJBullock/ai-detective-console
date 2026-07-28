"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const nextIndex =
      e.key === "ArrowRight" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
    const nextItem = items[nextIndex];
    onChange(nextItem.id);
    refs.current[nextItem.id]?.focus();
  };

  return (
    <div role="tablist" className={cn("flex gap-1 border-b border-steel", className)}>
      {items.map((item, index) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[item.id] = el;
            }}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "console-focus font-display px-4 py-2 text-sm tracking-wide transition-colors",
              active ? "border-b-2 border-red-string text-paper" : "border-b-2 border-transparent text-fog hover:text-paper"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
