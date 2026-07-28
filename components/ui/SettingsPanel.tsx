"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { GameCard } from "./GameCard";
import { GameButton } from "./GameButton";
import { GameBadge } from "./GameBadge";
import { Modal } from "./Modal";
import type { GameSettings } from "@/lib/game/types";

const AI_MODES: { id: GameSettings["aiMode"]; label: string; note: string }[] = [
  { id: "mock", label: "Mock AI", note: "Deterministic, no API key required — default." },
  { id: "openai", label: "OpenAI", note: "Requires OPENAI_API_KEY server-side. Falls back to mock if unset." },
  { id: "claude", label: "Claude", note: "Requires ANTHROPIC_API_KEY server-side. Falls back to mock if unset." },
];

const TEXT_SPEEDS: GameSettings["textSpeed"][] = ["slow", "normal", "fast", "instant"];

export function SettingsPanel() {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const resetProgress = useGameStore((s) => s.resetProgress);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <GameCard>
        <h3 className="font-display mb-3 text-sm text-cyan-signal">AI Provider Mode</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {AI_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => updateSettings({ aiMode: mode.id })}
              aria-pressed={settings.aiMode === mode.id}
              className={`console-focus rounded-sm border p-3 text-left transition-colors ${
                settings.aiMode === mode.id
                  ? "border-red-string bg-case-file-hover"
                  : "border-steel hover:border-fog"
              }`}
            >
              <div className="font-display text-sm text-paper">{mode.label}</div>
              <p className="mt-1 text-xs text-fog">{mode.note}</p>
            </button>
          ))}
        </div>
      </GameCard>

      <GameCard>
        <h3 className="font-display mb-3 text-sm text-cyan-signal">Accessibility</h3>
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm text-paper">Reduced motion</span>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="console-focus h-5 w-5 accent-red-string"
            />
          </label>

          <div>
            <span className="mb-2 block text-sm text-paper">Text speed</span>
            <div className="flex flex-wrap gap-2">
              {TEXT_SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSettings({ textSpeed: speed })}
                  aria-pressed={settings.textSpeed === speed}
                  className={`console-focus font-mono rounded-sm border px-3 py-1.5 text-xs uppercase transition-colors ${
                    settings.textSpeed === speed
                      ? "border-amber text-amber"
                      : "border-steel text-fog hover:text-paper"
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GameCard>

      <GameCard>
        <h3 className="font-display mb-3 text-sm text-cyan-signal">Interface</h3>
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm text-paper">Sound effects</span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="console-focus h-5 w-5 accent-red-string"
            />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-sm text-paper">
              Gamepad navigation <GameBadge variant="amber">Experimental</GameBadge>
            </span>
            <input
              type="checkbox"
              checked={settings.gamepadEnabled}
              onChange={(e) => updateSettings({ gamepadEnabled: e.target.checked })}
              className="console-focus h-5 w-5 accent-red-string"
            />
          </label>
        </div>
      </GameCard>

      <GameCard className="border-red-string/40">
        <h3 className="font-display mb-2 text-sm text-red-string">Danger Zone</h3>
        <p className="mb-3 text-xs text-fog">
          Resetting will permanently erase your saved case progress, including evidence, interview
          history, and accusations.
        </p>
        <GameButton variant="danger" onClick={() => setConfirmOpen(true)}>
          Reset Saved Progress
        </GameButton>
      </GameCard>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Reset">
        <p className="mb-5 text-sm text-fog">
          This will erase all case progress. This action cannot be undone. Continue?
        </p>
        <div className="flex justify-end gap-3">
          <GameButton variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </GameButton>
          <GameButton
            variant="danger"
            onClick={() => {
              resetProgress();
              setConfirmOpen(false);
              router.push("/");
            }}
          >
            Erase Progress
          </GameButton>
        </div>
      </Modal>
    </div>
  );
}
