import type {
  DialogueLine,
  EvidenceId,
  QuestionCategory,
  SuspectId,
} from "@/lib/game/types";
import type { ContradictionRule } from "@/lib/game/types";

export interface InterviewContext {
  suspectId: SuspectId;
  category: QuestionCategory | "custom";
  presetQuestionId?: string;
  questionText: string;
  presentedEvidenceId?: EvidenceId;
  stress: number;
  trust: number;
  pressure: number;
  truth: number;
  contradictionsFound: string[];
  unlockedEvidenceIds: EvidenceId[];
  conversationHistory: DialogueLine[];
}

export interface InterviewResult {
  dialogue: string;
  stressDelta: number;
  trustDelta: number;
  pressureDelta: number;
  truthDelta: number;
  contradictionTriggered?: ContradictionRule;
  cooperative: boolean;
  providerNote?: string;
}

export interface OrionSummaryContext {
  caseProgressSummary: string;
  unlockedEvidenceTitles: string[];
  contradictionsFound: string[];
  timelineConfidence: number;
}

export interface OrionHintContext {
  caseProgressSummary: string;
  unlockedEvidenceTitles: string[];
  contradictionsFound: string[];
  focusSuspectId?: SuspectId;
}

export interface EndingSummaryContext {
  correctSuspect: boolean;
  correctMotive: boolean;
  gradeLabel: string;
  accusedSuspectName: string;
}

export interface AIProvider {
  readonly mode: "mock" | "openai" | "claude";
  interviewSuspect(ctx: InterviewContext): Promise<InterviewResult>;
  orionSummary(ctx: OrionSummaryContext): Promise<string>;
  orionHint(ctx: OrionHintContext): Promise<string>;
  endingSummary(ctx: EndingSummaryContext): Promise<string>;
}

export type AIMode = "mock" | "openai" | "claude";

export async function getAIProvider(mode: AIMode): Promise<AIProvider> {
  if (mode === "openai" && process.env.OPENAI_API_KEY) {
    const { createOpenAIProvider } = await import("./liveProviders");
    return createOpenAIProvider();
  }
  if (mode === "claude" && process.env.ANTHROPIC_API_KEY) {
    const { createClaudeProvider } = await import("./liveProviders");
    return createClaudeProvider();
  }
  const { mockProvider } = await import("./mockProvider");
  return mockProvider;
}
