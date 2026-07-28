import type { ContradictionRule } from "./types";

export const CONTRADICTION_RULES: ContradictionRule[] = [
  {
    id: "lena-server-room-denial",
    suspectId: "lena-cross",
    triggerEvidenceId: "security-badge-log",
    claimText: "I never went into the server room that night.",
    proofText:
      "Badge logs place Lena Cross's credentials at the server room door at 10:44 PM and 11:52 PM.",
    contradictionTag: "lena-server-room-denial",
    pressureDelta: 25,
    truthDelta: -30,
    trustDelta: -10,
    unlocksDialogueId: "lena-contradiction-response",
  },
  {
    id: "adrian-shell-vendor",
    suspectId: "adrian-shaw",
    triggerEvidenceId: "encrypted-finance-ledger",
    claimText: "There's nothing unusual about Ridgeline. It's a standard vendor.",
    proofText:
      "The decrypted finance ledger shows transfers to Ridgeline Consulting approved under Adrian Shaw's signing authority, with no matching deliverables.",
    contradictionTag: "adrian-shell-vendor",
    pressureDelta: 20,
    truthDelta: -25,
    trustDelta: -10,
    unlocksDialogueId: "adrian-ledger-response",
  },
  {
    id: "adrian-straight-home",
    suspectId: "adrian-shaw",
    triggerEvidenceId: "parking-garage-still",
    claimText: "I left the dinner and went straight home. I was asleep by eleven.",
    proofText:
      "Parking garage camera footage shows Adrian Shaw's vehicle leaving the executive garage at 12:41 AM.",
    contradictionTag: "adrian-straight-home",
    pressureDelta: 30,
    truthDelta: -35,
    trustDelta: -15,
    unlocksDialogueId: "adrian-garage-response",
  },
  {
    id: "maya-heard-nothing",
    suspectId: "maya-reed",
    triggerEvidenceId: "stairwell-audio-transcript",
    claimText: "I didn't hear anything unusual. It was a quiet night.",
    proofText:
      "Emergency stairwell audio captured raised voices at 12:03 AM, directly contradicting Maya Reed's account of a quiet night.",
    contradictionTag: "maya-heard-nothing",
    pressureDelta: 25,
    truthDelta: -30,
    trustDelta: -10,
    unlocksDialogueId: "maya-audio-response",
  },
];

export function getContradictionForEvidence(
  suspectId: string,
  evidenceId: string
): ContradictionRule | undefined {
  return CONTRADICTION_RULES.find(
    (rule) => rule.suspectId === suspectId && rule.triggerEvidenceId === evidenceId
  );
}

export function getContradictionsForSuspect(suspectId: string): ContradictionRule[] {
  return CONTRADICTION_RULES.filter((rule) => rule.suspectId === suspectId);
}
