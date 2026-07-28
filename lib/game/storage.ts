import type { CaseProgress, GameSettings, SaveFile, SuspectRuntimeState } from "./types";
import { EVIDENCE } from "./evidence";
import { SUSPECTS } from "./suspects";
import { CASE_META } from "./caseData";

export const SAVE_VERSION = 1;
const SAVE_KEY = "ai-detective-console:save";
const SETTINGS_KEY = "ai-detective-console:settings";

export const DEFAULT_SETTINGS: GameSettings = {
  aiMode: "mock",
  reducedMotion: false,
  textSpeed: "normal",
  soundEnabled: true,
  gamepadEnabled: false,
};

export function createInitialProgress(): CaseProgress {
  const evidenceUnlocked = Object.fromEntries(
    EVIDENCE.map((e) => [e.id, e.unlocked])
  ) as CaseProgress["evidenceUnlocked"];

  const suspectStates = Object.fromEntries(
    SUSPECTS.map((s) => [
      s.id,
      {
        stress: 10,
        trust: 50,
        truth: 100,
        pressure: 0,
        interviewed: false,
        contradictionsFound: [],
        dialogueHistory: [],
      } satisfies SuspectRuntimeState,
    ])
  ) as unknown as CaseProgress["suspectStates"];

  return {
    caseId: CASE_META.id,
    startedAt: Date.now(),
    updatedAt: Date.now(),
    evidenceUnlocked,
    suspectStates,
    timelineConfidence: 0,
    playerNotes: "",
    hintCount: 0,
    accusation: {
      suspectId: null,
      motiveId: null,
      evidenceIds: [],
      timelineExplanationId: null,
      submitted: false,
    },
    endingType: null,
    detectiveGrade: null,
    briefingViewed: false,
  };
}

export function loadSave(): SaveFile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveFile;
    if (parsed.version !== SAVE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSave(progress: CaseProgress, settings: GameSettings, lastMenuItem: string | null): void {
  if (typeof window === "undefined") return;
  const save: SaveFile = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    progress,
    settings,
    lastMenuItem,
  };
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // storage unavailable — fail silently, game remains playable in-memory
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SAVE_KEY);
}

export function loadSettings(): GameSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<GameSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeSettings(settings: GameSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable — fail silently, game remains playable in-memory
  }
}
