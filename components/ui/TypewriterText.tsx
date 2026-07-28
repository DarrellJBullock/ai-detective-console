"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const SPEED_MS: Record<string, number> = {
  slow: 45,
  normal: 22,
  fast: 10,
  instant: 0,
};

interface TypewriterTextProps {
  text: string;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({ text, className, onComplete }: TypewriterTextProps) {
  const textSpeed = useGameStore((s) => s.settings.textSpeed);
  const reducedMotion = useReducedMotion();
  const instant = reducedMotion || textSpeed === "instant";

  const [trackedText, setTrackedText] = useState(text);
  const [shown, setShown] = useState(instant ? text.length : 0);

  if (text !== trackedText) {
    setTrackedText(text);
    setShown(instant ? text.length : 0);
  }

  useEffect(() => {
    if (instant) {
      onComplete?.();
      return;
    }
    const interval = setInterval(() => {
      setShown((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, SPEED_MS[textSpeed] ?? 22);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, textSpeed, instant]);

  const isTyping = shown < text.length;

  return (
    <p className={cn(isTyping && "typewriter-caret", className)}>{text.slice(0, shown)}</p>
  );
}
