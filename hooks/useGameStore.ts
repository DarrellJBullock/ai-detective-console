"use client";

import { create } from "zustand";
import type {
  Accusation,
  CaseProgress,
  DetectiveGrade,
  DialogueLine,
  EndingType,
  EvidenceId,
  GameSettings,
  SuspectId,
} from "@/lib/game/types";
import type { InterviewResult } from "@/lib/ai/aiProvider";
import { applyDelta } from "@/lib/ai/mockProvider";
import {
  DEFAULT_SETTINGS,
  clearSave,
  createInitialProgress,
  loadSave,
  loadSettings,
  writeSave,
  writeSettings,
} from "@/lib/game/storage";
import { EVIDENCE } from "@/lib/game/evidence";

interface GameStore {
  settings: GameSettings;
  progress: CaseProgress;
  lastMenuItem: string | null;
  hydrated: boolean;
  hasSave: boolean;

  hydrate: () => void;
  startNewCase: () => void;
  continueCase: () => boolean;
  markBriefingViewed: () => void;
  unlockEvidenceForSuspect: (suspectId: SuspectId) => void;
  recordInterviewExchange: (
    suspectId: SuspectId,
    playerLine: DialogueLine,
    suspectLine: DialogueLine,
    result: InterviewResult
  ) => void;
  setTimelineConfidence: (value: number) => void;
  setPlayerNotes: (text: string) => void;
  incrementHint: () => void;
  setAccusation: (patch: Partial<Accusation>) => void;
  submitAccusation: (grade: DetectiveGrade, ending: EndingType) => void;
  updateSettings: (patch: Partial<GameSettings>) => void;
  setLastMenuItem: (item: string) => void;
  resetProgress: () => void;
  persist: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  progress: createInitialProgress(),
  lastMenuItem: null,
  hydrated: false,
  hasSave: false,

  hydrate: () => {
    if (get().hydrated) return;
    const settings = loadSettings();
    const save = loadSave();
    if (save) {
      set({
        settings: save.settings,
        progress: save.progress,
        lastMenuItem: save.lastMenuItem,
        hydrated: true,
        hasSave: true,
      });
    } else {
      set({ settings, hydrated: true, hasSave: false });
    }
  },

  startNewCase: () => {
    const progress = createInitialProgress();
    set({ progress, hasSave: true });
    get().persist();
  },

  continueCase: () => {
    const save = loadSave();
    if (!save) return false;
    set({
      settings: save.settings,
      progress: save.progress,
      lastMenuItem: save.lastMenuItem,
      hasSave: true,
    });
    return true;
  },

  markBriefingViewed: () => {
    set((state) => ({ progress: { ...state.progress, briefingViewed: true, updatedAt: Date.now() } }));
    get().persist();
  },

  unlockEvidenceForSuspect: (suspectId) => {
    set((state) => {
      const nextUnlocked = { ...state.progress.evidenceUnlocked };
      EVIDENCE.filter((e) => e.relatedSuspects.includes(suspectId)).forEach((e) => {
        nextUnlocked[e.id] = true;
      });
      return {
        progress: { ...state.progress, evidenceUnlocked: nextUnlocked, updatedAt: Date.now() },
      };
    });
    get().persist();
  },

  recordInterviewExchange: (suspectId, playerLine, suspectLine, result) => {
    set((state) => {
      const current = state.progress.suspectStates[suspectId];
      const contradictionsFound = result.contradictionTriggered
        ? Array.from(new Set([...current.contradictionsFound, result.contradictionTriggered.contradictionTag]))
        : current.contradictionsFound;

      const nextEvidenceUnlocked = { ...state.progress.evidenceUnlocked };

      const nextState = {
        ...current,
        stress: applyDelta(current.stress, result.stressDelta),
        trust: applyDelta(current.trust, result.trustDelta),
        pressure: applyDelta(current.pressure, result.pressureDelta),
        truth: applyDelta(current.truth, result.truthDelta),
        interviewed: true,
        contradictionsFound,
        dialogueHistory: [...current.dialogueHistory, playerLine, suspectLine],
      };

      return {
        progress: {
          ...state.progress,
          suspectStates: { ...state.progress.suspectStates, [suspectId]: nextState },
          evidenceUnlocked: nextEvidenceUnlocked,
          updatedAt: Date.now(),
        },
      };
    });
    get().persist();
  },

  setTimelineConfidence: (value) => {
    set((state) => ({ progress: { ...state.progress, timelineConfidence: value, updatedAt: Date.now() } }));
    get().persist();
  },

  setPlayerNotes: (text) => {
    set((state) => ({ progress: { ...state.progress, playerNotes: text, updatedAt: Date.now() } }));
    get().persist();
  },

  incrementHint: () => {
    set((state) => ({ progress: { ...state.progress, hintCount: state.progress.hintCount + 1, updatedAt: Date.now() } }));
    get().persist();
  },

  setAccusation: (patch) => {
    set((state) => ({
      progress: {
        ...state.progress,
        accusation: { ...state.progress.accusation, ...patch },
        updatedAt: Date.now(),
      },
    }));
    get().persist();
  },

  submitAccusation: (grade, ending) => {
    set((state) => ({
      progress: {
        ...state.progress,
        accusation: { ...state.progress.accusation, submitted: true },
        detectiveGrade: grade,
        endingType: ending,
        updatedAt: Date.now(),
      },
    }));
    get().persist();
  },

  updateSettings: (patch) => {
    set((state) => ({ settings: { ...state.settings, ...patch } }));
    writeSettings(get().settings);
    get().persist();
  },

  setLastMenuItem: (item) => {
    set({ lastMenuItem: item });
    get().persist();
  },

  resetProgress: () => {
    clearSave();
    set({ progress: createInitialProgress(), lastMenuItem: null, hasSave: false });
  },

  persist: () => {
    const { progress, settings, lastMenuItem, hasSave } = get();
    if (!hasSave) return;
    writeSave(progress, settings, lastMenuItem);
  },
}));

export function evidenceIdList(): EvidenceId[] {
  return EVIDENCE.map((e) => e.id);
}
