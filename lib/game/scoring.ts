import { CORRECT_SUSPECT_ID, CORRECT_MOTIVE_ID, REQUIRED_EVIDENCE_IDS } from "./caseData";
import { CONTRADICTION_RULES } from "./contradictions";
import type { Accusation, CaseProgress, DetectiveGrade, EndingType } from "./types";

export function scoreAccusation(
  accusation: Accusation,
  progress: CaseProgress
): DetectiveGrade {
  const correctSuspect = accusation.suspectId === CORRECT_SUSPECT_ID;
  const correctMotive = accusation.motiveId === CORRECT_MOTIVE_ID;

  const requiredFound = REQUIRED_EVIDENCE_IDS.filter((id) =>
    accusation.evidenceIds.includes(id)
  ).length;

  const contradictionsResolved = Object.values(progress.suspectStates).reduce(
    (sum, s) => sum + s.contradictionsFound.length,
    0
  );
  const contradictionsTotal = CONTRADICTION_RULES.length;

  const hintsUsed = progress.hintCount;

  let score = 0;
  if (correctSuspect) score += 40;
  if (correctMotive) score += 15;
  score += Math.round((requiredFound / REQUIRED_EVIDENCE_IDS.length) * 25);
  score += Math.round((contradictionsResolved / contradictionsTotal) * 15);
  score += Math.round((progress.timelineConfidence / 100) * 5);
  score -= Math.min(hintsUsed * 3, 15);
  score = Math.max(0, Math.min(100, score));

  let grade: DetectiveGrade["grade"];
  if (correctSuspect && correctMotive && requiredFound === REQUIRED_EVIDENCE_IDS.length && score >= 85) {
    grade = "S";
  } else if (correctSuspect && correctMotive && requiredFound >= REQUIRED_EVIDENCE_IDS.length - 1) {
    grade = "A";
  } else if (correctSuspect) {
    grade = "B";
  } else if (score >= 40) {
    grade = "C";
  } else {
    grade = "D";
  }

  return {
    grade,
    score,
    breakdown: {
      correctSuspect,
      correctMotive,
      requiredEvidenceFound: requiredFound,
      requiredEvidenceTotal: REQUIRED_EVIDENCE_IDS.length,
      contradictionsResolved,
      contradictionsTotal,
      timelineConfidence: progress.timelineConfidence,
      hintsUsed,
    },
  };
}

export function determineEnding(grade: DetectiveGrade, accusation: Accusation): EndingType {
  if (!accusation.submitted) return "case-unsolved";
  if (!grade.breakdown.correctSuspect) return "wrong-accusation";
  if (grade.grade === "S" || grade.grade === "A") return "perfect-solve";
  return "correct-weak-evidence";
}
