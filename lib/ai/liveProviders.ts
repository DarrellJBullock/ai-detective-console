import { getSuspect, getContradiction, getEvidence, getCase } from "@/lib/game/cases";
import {
  contradictionResponsePrompt,
  endingSummaryPrompt,
  evidencePresentationNote,
  orionCaseSummaryPrompt,
  orionHintPrompt,
  suspectInterviewSystemPrompt,
  suspectInterviewUserPrompt,
} from "./promptTemplates";
import { mockProvider } from "./mockProvider";
import type {
  AIProvider,
  EndingSummaryContext,
  InterviewContext,
  InterviewResult,
  OrionHintContext,
  OrionSummaryContext,
} from "./aiProvider";

type ChatCall = (system: string, user: string) => Promise<string>;

async function callOpenAI(system: string, user: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.8,
      max_tokens: 200,
    }),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed: ${response.status} ${body}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function callClaude(system: string, user: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Anthropic request failed: ${response.status} ${body}`);
  }
  const data = await response.json();
  return data.content?.[0]?.text?.trim() ?? "";
}

function buildProvider(mode: "openai" | "claude", chat: ChatCall): AIProvider {
  async function interviewSuspect(ctx: InterviewContext): Promise<InterviewResult> {
    const suspect = getSuspect(ctx.caseId, ctx.suspectId);
    if (!suspect) return mockProvider.interviewSuspect(ctx);
    const caseMeta = getCase(ctx.caseId).meta;

    try {
      const system = suspectInterviewSystemPrompt(suspect, caseMeta);

      if (ctx.presentedEvidenceId) {
        const evidence = getEvidence(ctx.caseId, ctx.presentedEvidenceId);
        const rule = getContradiction(ctx.caseId, ctx.suspectId, ctx.presentedEvidenceId);
        const base = suspectInterviewUserPrompt(ctx, caseMeta);
        const note = rule
          ? contradictionResponsePrompt(rule.claimText, rule.proofText)
          : evidencePresentationNote(evidence?.title ?? "evidence");
        const dialogue = await chat(system, `${base}\n\n${note}`);

        if (rule && !ctx.contradictionsFound.includes(rule.contradictionTag)) {
          return {
            dialogue: dialogue || suspect.truthStatement,
            stressDelta: 20,
            trustDelta: rule.trustDelta,
            pressureDelta: rule.pressureDelta,
            truthDelta: rule.truthDelta,
            contradictionTriggered: rule,
            cooperative: true,
          };
        }
        return {
          dialogue: dialogue || "That doesn't change what I've told you.",
          stressDelta: rule ? 5 : 0,
          trustDelta: rule ? 0 : -3,
          pressureDelta: rule ? 5 : -5,
          truthDelta: 0,
          cooperative: !rule,
        };
      }

      const user = suspectInterviewUserPrompt(ctx, caseMeta);
      const dialogue = await chat(system, user);
      const isPressure = ctx.category === "pressure";
      return {
        dialogue: dialogue || "...",
        stressDelta: isPressure ? 10 : ctx.category === "timeline" || ctx.category === "relationship" ? -3 : 3,
        trustDelta: isPressure ? -2 : 2,
        pressureDelta: isPressure ? 10 : 0,
        truthDelta: 0,
        cooperative: true,
      };
    } catch (error) {
      console.error(`[ai:${mode}] interviewSuspect failed, using mock fallback:`, error);
      const fallback = await mockProvider.interviewSuspect(ctx);
      return { ...fallback, providerNote: `Live ${mode} call failed — used mock fallback.` };
    }
  }

  async function orionSummary(ctx: OrionSummaryContext): Promise<string> {
    try {
      const prompt = orionCaseSummaryPrompt(
        `Unlocked evidence: ${ctx.unlockedEvidenceTitles.join(", ") || "none"}. Contradictions found: ${ctx.contradictionsFound.join(", ") || "none"}. Timeline confidence: ${ctx.timelineConfidence}%.`
      );
      const text = await chat("You are ORION, a detective AI partner.", prompt);
      return text || (await mockProvider.orionSummary(ctx));
    } catch (error) {
      console.error(`[ai:${mode}] orionSummary failed, using mock fallback:`, error);
      return mockProvider.orionSummary(ctx);
    }
  }

  async function orionHint(ctx: OrionHintContext): Promise<string> {
    try {
      const prompt = orionHintPrompt(
        `Unlocked evidence: ${ctx.unlockedEvidenceTitles.join(", ") || "none"}. Contradictions found: ${ctx.contradictionsFound.join(", ") || "none"}.`,
        ctx.focusSuspectId
      );
      const text = await chat("You are ORION, a detective AI partner.", prompt);
      return text || (await mockProvider.orionHint(ctx));
    } catch (error) {
      console.error(`[ai:${mode}] orionHint failed, using mock fallback:`, error);
      return mockProvider.orionHint(ctx);
    }
  }

  async function endingSummary(ctx: EndingSummaryContext): Promise<string> {
    try {
      const prompt = endingSummaryPrompt(ctx.correctSuspect, ctx.gradeLabel, ctx.accusedSuspectName);
      const text = await chat("You are ORION, a detective AI partner narrating a case close.", prompt);
      return text || (await mockProvider.endingSummary(ctx));
    } catch (error) {
      console.error(`[ai:${mode}] endingSummary failed, using mock fallback:`, error);
      return mockProvider.endingSummary(ctx);
    }
  }

  return { mode, interviewSuspect, orionSummary, orionHint, endingSummary };
}

export function createOpenAIProvider(): AIProvider {
  return buildProvider("openai", callOpenAI);
}

export function createClaudeProvider(): AIProvider {
  return buildProvider("claude", callClaude);
}
