// Core domain types for AI Detective: Console Edition
//
// SuspectId and EvidenceId are plain strings (not per-case literal unions)
// because the game supports multiple cases (see lib/game/cases/), each with
// its own suspect and evidence ids. Uniqueness only needs to hold within a
// single case's CaseDefinition, not across the whole game.
export type SuspectId = string;

export type EvidenceId = string;

export type EvidenceCategory =
  | "digital"
  | "physical"
  | "audio"
  | "document"
  | "access-record";

export type ImportanceLevel = "low" | "medium" | "high" | "critical";

export interface Evidence {
  id: EvidenceId;
  title: string;
  description: string;
  category: EvidenceCategory;
  discoveredAt: string;
  relatedSuspects: SuspectId[];
  contradictionTags: string[];
  unlocked: boolean;
  importanceLevel: ImportanceLevel;
  sourceLocation: string;
}

export type QuestionCategory =
  | "timeline"
  | "relationship"
  | "motive"
  | "alibi"
  | "evidence"
  | "pressure";

export interface PresetQuestion {
  id: string;
  category: QuestionCategory;
  prompt: string;
}

export interface SuspectProfile {
  id: SuspectId;
  name: string;
  role: string;
  motive: string;
  personality: string;
  secret: string;
  lieStatement: string;
  truthStatement: string;
  contradictingEvidenceId: EvidenceId;
  portraitInitials: string;
  knownTimeline: string[];
  presetQuestions: PresetQuestion[];
}

export interface DialogueLine {
  id: string;
  speaker: "player" | SuspectId | "orion";
  text: string;
  timestamp: number;
  category?: QuestionCategory;
  presentedEvidenceId?: EvidenceId;
  triggeredContradiction?: boolean;
}

export interface SuspectRuntimeState {
  stress: number; // 0-100
  trust: number; // 0-100
  truth: number; // 0-100, consistency with known evidence
  pressure: number; // 0-100
  interviewed: boolean;
  contradictionsFound: string[];
  dialogueHistory: DialogueLine[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  sortKey: number;
  title: string;
  description: string;
  relatedSuspects: SuspectId[];
  relatedEvidence: EvidenceId[];
  confirmed: boolean;
  contested: boolean;
  resolvesWithTag?: string;
}

export interface ContradictionRule {
  id: string;
  suspectId: SuspectId;
  triggerEvidenceId: EvidenceId;
  claimText: string;
  proofText: string;
  contradictionTag: string;
  pressureDelta: number;
  truthDelta: number;
  trustDelta: number;
  unlocksDialogueId: string;
}

export type EndingType =
  | "perfect-solve"
  | "correct-weak-evidence"
  | "wrong-accusation"
  | "case-unsolved";

export interface Accusation {
  suspectId: SuspectId | null;
  motiveId: string | null;
  evidenceIds: EvidenceId[];
  timelineExplanationId: string | null;
  submitted: boolean;
}

export interface DetectiveGrade {
  grade: "S" | "A" | "B" | "C" | "D";
  score: number;
  breakdown: {
    correctSuspect: boolean;
    correctMotive: boolean;
    requiredEvidenceFound: number;
    requiredEvidenceTotal: number;
    contradictionsResolved: number;
    contradictionsTotal: number;
    timelineConfidence: number;
    hintsUsed: number;
  };
}

export interface GameSettings {
  aiMode: "mock" | "openai" | "claude";
  reducedMotion: boolean;
  textSpeed: "slow" | "normal" | "fast" | "instant";
  soundEnabled: boolean;
  gamepadEnabled: boolean;
}

export interface CaseProgress {
  caseId: string;
  startedAt: number;
  updatedAt: number;
  evidenceUnlocked: Record<EvidenceId, boolean>;
  suspectStates: Record<SuspectId, SuspectRuntimeState>;
  timelineConfidence: number;
  playerNotes: string;
  hintCount: number;
  accusation: Accusation;
  endingType: EndingType | null;
  detectiveGrade: DetectiveGrade | null;
  briefingViewed: boolean;
}

export interface SaveFile {
  version: number;
  savedAt: number;
  progress: CaseProgress;
  settings: GameSettings;
  lastMenuItem: string | null;
}

// ---------------------------------------------------------------------- //
// Multi-case support
// ---------------------------------------------------------------------- //

export interface Victim {
  name: string;
  role: string;
  age: number;
  causeOfDeath: string;
  timeOfDeath: string;
}

export interface CaseMeta {
  id: string;
  title: string;
  tagline: string;
  difficulty: "standard" | "advanced";
  victim: Victim;
  premise: string;
  crimeSceneSummary: string;
  knownFacts: string[];
  initialEvidenceIds: EvidenceId[];
  orionBriefing: string;
}

export interface MotiveOption {
  id: string;
  label: string;
  suspectId: SuspectId;
}

export interface TimelineExplanationOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface CaseDefinition {
  meta: CaseMeta;
  suspects: SuspectProfile[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  contradictions: ContradictionRule[];
  motiveOptions: MotiveOption[];
  requiredEvidenceIds: EvidenceId[];
  supportingEvidenceIds: EvidenceId[];
  timelineExplanationOptions: TimelineExplanationOption[];
  correctSuspectId: SuspectId;
  correctMotiveId: string;
}
