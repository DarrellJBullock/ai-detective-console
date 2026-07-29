import { getCase } from "./cases";
import type { Accusation, CaseProgress, DetectiveGrade, EndingType } from "./types";

export function scoreAccusation(
  accusation: Accusation,
  progress: CaseProgress
): DetectiveGrade {
  const caseDef = getCase(progress.caseId);
  const correctSuspect = accusation.suspectId === caseDef.correctSuspectId;
  const correctMotive = accusation.motiveId === caseDef.correctMotiveId;

  const requiredFound = caseDef.requiredEvidenceIds.filter((id) =>
    accusation.evidenceIds.includes(id)
  ).length;

  const contradictionsResolved = Object.values(progress.suspectStates).reduce(
    (sum, s) => sum + s.contradictionsFound.length,
    0
  );
  const contradictionsTotal = caseDef.contradictions.length;

  const hintsUsed = progress.hintCount;

  let score = 0;
  if (correctSuspect) score += 40;
  if (correctMotive) score += 15;
  score += Math.round((requiredFound / caseDef.requiredEvidenceIds.length) * 25);
  score += Math.round((contradictionsResolved / contradictionsTotal) * 15);
  score += Math.round((progress.timelineConfidence / 100) * 5);
  score -= Math.min(hintsUsed * 3, 15);
  score = Math.max(0, Math.min(100, score));

  let grade: DetectiveGrade["grade"];
  if (correctSuspect && correctMotive && requiredFound === caseDef.requiredEvidenceIds.length && score >= 85) {
    grade = "S";
  } else if (correctSuspect && correctMotive && requiredFound >= caseDef.requiredEvidenceIds.length - 1) {
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
      requiredEvidenceTotal: caseDef.requiredEvidenceIds.length,
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
