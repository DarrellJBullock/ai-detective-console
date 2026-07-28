import type { SuspectProfile } from "./types";

export const SUSPECTS: SuspectProfile[] = [
  {
    id: "lena-cross",
    name: "Lena Cross",
    role: "Lead Engineer",
    motive: "Marcus planned to expose her unauthorized AI experiment.",
    personality: "Calm, analytical, guarded.",
    secret:
      "She accessed the server room after midnight but claims it was for a failed deployment.",
    lieStatement: "I never went into the server room that night.",
    truthStatement:
      "Fine — I was in the server room. Twice. I was trying to roll back a deployment before anyone noticed it existed.",
    contradictingEvidenceId: "security-badge-log",
    portraitInitials: "LC",
    knownTimeline: [
      "Left her desk around 10:30 PM after most of the floor had cleared.",
      "Badge shows server room access at 10:44 PM.",
      "Badge shows a second server room access at 11:52 PM.",
      "Claims she was home by 1:00 AM.",
    ],
    presetQuestions: [
      { id: "lena-timeline", category: "timeline", prompt: "Walk me through your night, minute by minute." },
      { id: "lena-relationship", category: "relationship", prompt: "What was your relationship with Marcus like?" },
      { id: "lena-motive", category: "motive", prompt: "Did Marcus have a problem with your work?" },
      { id: "lena-alibi", category: "alibi", prompt: "Where were you when Marcus was killed?" },
      { id: "lena-evidence", category: "evidence", prompt: "Did you enter the server room that night?" },
      { id: "lena-pressure", category: "pressure", prompt: "You're lying to me, Lena. I can see it." },
    ],
  },
  {
    id: "adrian-shaw",
    name: "Adrian Shaw",
    role: "Chief Operating Officer",
    motive: "Marcus found financial irregularities tied to Adrian's expansion deal.",
    personality: "Charming, defensive, polished.",
    secret: "He moved money into a shell vendor account.",
    lieStatement: "I left the dinner and went straight home. I was asleep by eleven.",
    truthStatement:
      "Okay. I went back to the office. Marcus called me, furious about Ridgeline. I went to explain it — that's all it was supposed to be.",
    contradictingEvidenceId: "parking-garage-still",
    portraitInitials: "AS",
    knownTimeline: [
      "Attended a board dinner downtown, left around 10:05 PM.",
      "Claims he drove straight home and was asleep by 11:00 PM.",
      "Parking garage camera shows his car leaving the executive garage at 12:41 AM.",
      "Deleted email thread shows Marcus demanded to speak with him at 9:15 PM about Ridgeline Consulting.",
    ],
    presetQuestions: [
      { id: "adrian-timeline", category: "timeline", prompt: "What did you do after the board dinner?" },
      { id: "adrian-relationship", category: "relationship", prompt: "How would you describe your working relationship with Marcus?" },
      { id: "adrian-motive", category: "motive", prompt: "Did Marcus raise any concerns about the expansion deal?" },
      { id: "adrian-alibi", category: "alibi", prompt: "Can anyone confirm you went straight home?" },
      { id: "adrian-evidence", category: "evidence", prompt: "What is Ridgeline Consulting?" },
      { id: "adrian-pressure", category: "pressure", prompt: "Your car left the garage after midnight, Adrian. Explain that." },
    ],
  },
  {
    id: "maya-reed",
    name: "Maya Reed",
    role: "Executive Assistant",
    motive: "Marcus threatened to fire her after finding leaked documents.",
    personality: "Nervous, observant, emotional.",
    secret:
      "She saw someone leaving Marcus's office but hid it because she feared retaliation.",
    lieStatement: "I didn't hear anything unusual. It was a quiet night.",
    truthStatement:
      "I heard shouting near the stairwell around midnight. I didn't say anything because I was scared — I thought I'd be blamed, or worse, targeted next.",
    contradictingEvidenceId: "stairwell-audio-transcript",
    portraitInitials: "MR",
    knownTimeline: [
      "Brought Marcus coffee around 9:30 PM while working late on quarterly documents.",
      "Claims she left the office by 11:30 PM and heard nothing unusual.",
      "Stairwell intercom captured raised voices at 12:03 AM near her known route home.",
      "Was seen near the executive floor as late as 11:20 PM by a night-shift janitor.",
    ],
    presetQuestions: [
      { id: "maya-timeline", category: "timeline", prompt: "What time did you leave the office?" },
      { id: "maya-relationship", category: "relationship", prompt: "How did Marcus treat you as his assistant?" },
      { id: "maya-motive", category: "motive", prompt: "Was there any tension between you and Marcus recently?" },
      { id: "maya-alibi", category: "alibi", prompt: "Did you see or hear anything unusual before you left?" },
      { id: "maya-evidence", category: "evidence", prompt: "Do you recognize this stairwell audio transcript?" },
      { id: "maya-pressure", category: "pressure", prompt: "You were seen on the executive floor at 11:20 PM. Why lie about it?" },
    ],
  },
];

export function getSuspectById(id: string): SuspectProfile | undefined {
  return SUSPECTS.find((s) => s.id === id);
}
