export const CASE_META = {
  id: "midnight-ledger",
  title: "The Midnight Ledger",
  gameTitle: "AI Detective: Console Edition",
  victim: {
    name: "Marcus Vale",
    role: "Chief Financial Officer, Northstar Systems",
    age: 47,
    causeOfDeath: "Blunt force trauma, struck by a heavy desk award during a struggle in his office.",
    timeOfDeath: "Between 12:03 AM and 12:45 AM",
  },
  premise:
    "A tech company CFO is found dead after discovering missing funds tied to a secret internal project. Three suspects had motive, access, and conflicting timelines. The player must interview suspects, inspect evidence, identify contradictions, reconstruct the timeline, and make the correct accusation.",
  crimeSceneSummary:
    "Marcus Vale was found dead in his 40th-floor corner office at Northstar Systems shortly before 1:00 AM. The room showed signs of a struggle: broken glass near the window, an overturned desk lamp, and a shattered service award used as the weapon. His terminal was left logged in to the finance ledger. Security found his office door unlocked and his badge still in his jacket pocket.",
  knownFacts: [
    "Marcus Vale discovered a discrepancy in Northstar's quarterly ledger three days before his death.",
    "He had scheduled private meetings with each of his three direct reports that week.",
    "The building's server room and executive floor both require badge access, logged automatically.",
    "Marcus sent an internal email an hour before his death referencing 'the shell account.'",
    "A handwritten note was found crumpled near his desk.",
  ],
  initialEvidenceIds: ["security-badge-log", "broken-glass"],
  orionBriefing:
    "Detective, I've pulled the preliminary incident report. Marcus Vale, CFO, found dead in his office just before 1 AM. Cause of death points to a struggle, not an accident. Three people had reason to want him silenced: his lead engineer, his COO, and his executive assistant. Each has a motive. Each has a gap in their story. I'll track contradictions as you find them — but the conclusion has to be yours. Let's get to work.",
} as const;

export const CORRECT_SUSPECT_ID = "adrian-shaw" as const;
export const CORRECT_MOTIVE_ID = "financial-fraud-coverup" as const;

export const MOTIVE_OPTIONS = [
  { id: "financial-fraud-coverup", label: "Financial fraud cover-up", suspectId: "adrian-shaw" },
  { id: "expose-ai-experiment", label: "Silencing an unauthorized AI experiment", suspectId: "lena-cross" },
  { id: "retaliation-termination", label: "Retaliation for a threatened firing", suspectId: "maya-reed" },
] as const;

export const REQUIRED_EVIDENCE_IDS = [
  "encrypted-finance-ledger",
  "deleted-email-thread",
  "stairwell-audio-transcript",
  "final-note",
] as const;

export const SUPPORTING_EVIDENCE_IDS = [
  "parking-garage-still",
  "security-badge-log",
] as const;

export const TIMELINE_EXPLANATION_OPTIONS = [
  {
    id: "adrian-returned",
    label: "Adrian never left — he returned to the building after the dinner and confronted Marcus about the ledger.",
    correct: true,
  },
  {
    id: "lena-confronted",
    label: "Lena confronted Marcus in the server room over her AI project.",
    correct: false,
  },
  {
    id: "maya-argument",
    label: "Maya argued with Marcus in the stairwell over her termination.",
    correct: false,
  },
  {
    id: "unrelated-intruder",
    label: "An unrelated intruder entered through the parking garage.",
    correct: false,
  },
] as const;
