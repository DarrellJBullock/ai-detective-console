"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "./useGameStore";

export type GamepadAction = "up" | "down" | "left" | "right" | "select" | "back";

interface GamepadHandlers {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onSelect?: () => void;
  onBack?: () => void;
}

const AXIS_THRESHOLD = 0.5;
const REPEAT_DELAY_MS = 220;

/**
 * Experimental Gamepad API navigation. Polls the first connected gamepad and
 * maps d-pad / left-stick / face buttons to directional + select/back actions.
 */
export function useGamepadNavigation(handlers: GamepadHandlers, enabled = true) {
  const gamepadEnabled = useGameStore((s) => s.settings.gamepadEnabled);
  const lastActionAt = useRef<Record<GamepadAction, number>>({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    select: 0,
    back: 0,
  });
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!enabled || !gamepadEnabled) return;
    if (typeof navigator === "undefined" || !("getGamepads" in navigator)) return;

    let frame: number;

    const fire = (action: GamepadAction) => {
      const now = performance.now();
      if (now - lastActionAt.current[action] < REPEAT_DELAY_MS) return;
      lastActionAt.current[action] = now;
      const map: Record<GamepadAction, (() => void) | undefined> = {
        up: handlersRef.current.onUp,
        down: handlersRef.current.onDown,
        left: handlersRef.current.onLeft,
        right: handlersRef.current.onRight,
        select: handlersRef.current.onSelect,
        back: handlersRef.current.onBack,
      };
      map[action]?.();
    };

    const poll = () => {
      const pads = navigator.getGamepads?.() ?? [];
      const pad = pads.find(Boolean);
      if (pad) {
        const [axisX, axisY] = pad.axes;
        if (pad.buttons[12]?.pressed || axisY < -AXIS_THRESHOLD) fire("up");
        if (pad.buttons[13]?.pressed || axisY > AXIS_THRESHOLD) fire("down");
        if (pad.buttons[14]?.pressed || axisX < -AXIS_THRESHOLD) fire("left");
        if (pad.buttons[15]?.pressed || axisX > AXIS_THRESHOLD) fire("right");
        if (pad.buttons[0]?.pressed) fire("select");
        if (pad.buttons[1]?.pressed) fire("back");
      }
      frame = requestAnimationFrame(poll);
    };

    frame = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(frame);
  }, [enabled, gamepadEnabled]);
}
