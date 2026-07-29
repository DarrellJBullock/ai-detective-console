import type { CaseDefinition, ContradictionRule, Evidence, SuspectProfile, TimelineEvent } from "../types";
import { midnightLedgerCase } from "./midnight-ledger";
import { lastCommitCase } from "./last-commit";

export const CASES: Record<string, CaseDefinition> = {
  [midnightLedgerCase.meta.id]: midnightLedgerCase,
  [lastCommitCase.meta.id]: lastCommitCase,
};

export const CASE_LIST = Object.values(CASES).map((c) => c.meta);

export const DEFAULT_CASE_ID = midnightLedgerCase.meta.id;

export function getCase(caseId: string): CaseDefinition {
  const found = CASES[caseId];
  if (!found) {
    throw new Error(`Unknown case id: ${caseId}`);
  }
  return found;
}

export function getCaseSafe(caseId: string | undefined | null): CaseDefinition {
  if (!caseId || !CASES[caseId]) return CASES[DEFAULT_CASE_ID];
  return CASES[caseId];
}

export function getSuspect(caseId: string, suspectId: string): SuspectProfile | undefined {
  return getCaseSafe(caseId).suspects.find((s) => s.id === suspectId);
}

export function getEvidence(caseId: string, evidenceId: string): Evidence | undefined {
  return getCaseSafe(caseId).evidence.find((e) => e.id === evidenceId);
}

export function getContradiction(
  caseId: string,
  suspectId: string,
  evidenceId: string
): ContradictionRule | undefined {
  return getCaseSafe(caseId).contradictions.find(
    (rule) => rule.suspectId === suspectId && rule.triggerEvidenceId === evidenceId
  );
}

export function getContradictionsForSuspect(caseId: string, suspectId: string): ContradictionRule[] {
  return getCaseSafe(caseId).contradictions.filter((rule) => rule.suspectId === suspectId);
}

export function getTimelineEvent(caseId: string, eventId: string): TimelineEvent | undefined {
  return getCaseSafe(caseId).timeline.find((e) => e.id === eventId);
}
