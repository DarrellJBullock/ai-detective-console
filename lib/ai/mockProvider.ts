import type { QuestionCategory } from "@/lib/game/types";
import { getSuspect, getContradiction, getEvidence } from "@/lib/game/cases";
import { clamp } from "@/lib/utils";
import type {
  AIProvider,
  EndingSummaryContext,
  InterviewContext,
  InterviewResult,
  OrionHintContext,
  OrionSummaryContext,
} from "./aiProvider";

interface ResponseVariant {
  calm: string;
  defensive: string;
}

const PRESET_RESPONSES: Record<string, ResponseVariant> = {
  // --- The Midnight Ledger -------------------------------------------- //
  "lena-timeline": {
    calm: "I left my desk around ten-thirty. Most of the floor had already cleared out. I went to check on a deployment, then headed home.",
    defensive: "I already told you — desk, then home. Why does it matter minute by minute? I'm an engineer, not a suspect on a clock.",
  },
  "lena-relationship": {
    calm: "Professional. Marcus respected results. We didn't socialize, but he trusted my technical judgment — most of the time.",
    defensive: "It was fine, until it wasn't. He started asking questions about my project that he had no context to understand.",
  },
  "lena-motive": {
    calm: "Marcus reviewed budgets, not architecture. If he had concerns about my work, he never raised them with me directly.",
    defensive: "You think I'd hurt someone over a project review? That's absurd. I had a deadline, not a grudge.",
  },
  "lena-alibi": {
    calm: "I was working. Then I was home. There's not much else to say.",
    defensive: "I don't have a doorman logging my apartment entries, if that's what you're asking.",
  },
  "lena-evidence": {
    calm: "I never went into the server room that night.",
    defensive: "I told you — I wasn't in there. Are we doing this again?",
  },
  "lena-pressure": {
    calm: "I don't respond well to accusations without proof, Detective.",
    defensive: "Careful. I have counsel on retainer, and right now you have a badge log and a theory.",
  },
  "adrian-timeline": {
    calm: "I said my goodbyes around ten, got in the car, and drove home. It had been a long week.",
    defensive: "I've told this story once already. Dinner, car, home. It doesn't change on the second telling.",
  },
  "adrian-relationship": {
    calm: "Marcus and I worked closely on the numbers side of expansion. We didn't always agree on pace, but we respected each other.",
    defensive: "We had our disagreements, sure. Every COO and CFO does. That's not a motive, that's Tuesday.",
  },
  "adrian-motive": {
    calm: "Marcus flagged a few line items on the expansion budget. Normal due diligence. Nothing that couldn't be explained.",
    defensive: "You're fishing. Every big deal has line items that need explaining. That's not fraud, that's finance.",
  },
  "adrian-alibi": {
    calm: "My building has a doorman. I'm sure he'd remember me coming in.",
    defensive: "What, you want a notarized statement? I went home. That's the truth.",
  },
  "adrian-evidence": {
    calm: "Ridgeline is a vendor we brought on for the west-coast expansion. Standard consulting engagement.",
    defensive: "I'm not going to explain our vendor structure to you like you're on the audit committee.",
  },
  "adrian-pressure": {
    calm: "I think you're reaching, Detective. I'd be careful about accusations you can't back up.",
    defensive: "This conversation is over unless my lawyer is in the room.",
  },
  "maya-timeline": {
    calm: "I left around eleven-thirty. I'd finished the quarterly binder Marcus asked for and there wasn't anything else to do.",
    defensive: "I've already told you when I left. I don't know what else you want from me.",
  },
  "maya-relationship": {
    calm: "He could be demanding, but he was fair, mostly. He trusted me with a lot of sensitive material.",
    defensive: "Why does it matter how he treated me? I did my job. That's all there is to it.",
  },
  "maya-motive": {
    calm: "There was some tension recently, about a document that went missing. But that happens. It wasn't personal.",
    defensive: "I don't like where this is going. I did not have a reason to hurt him.",
  },
  "maya-alibi": {
    calm: "I didn't see or hear anything unusual. It was a quiet night, like most nights.",
    defensive: "I already answered this. Quiet night. Nothing unusual. I don't know what you want me to add.",
  },
  "maya-evidence": {
    calm: "A stairwell recording? I don't know anything about that.",
    defensive: "I told you I didn't hear anything. I don't know what that recording is supposed to prove.",
  },
  "maya-pressure": {
    calm: "I— I was trying to leave quickly that night. I didn't want to get pulled into anything.",
    defensive: "Please, I already feel like a target here. I didn't do anything wrong.",
  },

  // --- The Last Commit --------------------------------------------------- //
  "marcus-timeline": {
    calm: "I stayed near the meeting room until it wrapped around eight, then went back to my desk to catch up on a backlog.",
    defensive: "I've said this already — meeting, desk, work. I don't log my bathroom breaks, if that's what you're after.",
  },
  "marcus-relationship": {
    calm: "Professional. Naomi trusted my judgment on anything technical — mostly.",
    defensive: "It was fine, until she started talking about 'shared credit' on architecture I built.",
  },
  "marcus-motive": {
    calm: "Naomi reviewed roadmaps, not who wrote what code. If she had concerns, she never raised them with me directly.",
    defensive: "You think I'd hurt someone over a credit line in a slide deck? That's insulting.",
  },
  "marcus-alibi": {
    calm: "I was at my desk. Ask anyone still in the office that night.",
    defensive: "I don't have a witness for every minute of my evening, Detective. Most people don't.",
  },
  "marcus-evidence": {
    calm: "I was heads-down on a client call all evening. I never left my desk.",
    defensive: "I already told you — I didn't leave. Are we doing this again?",
  },
  "marcus-pressure": {
    calm: "I don't respond well to accusations without proof, Detective.",
    defensive: "Careful. I have counsel on retainer, and right now you have a calendar entry and a theory.",
  },
  "priya-timeline": {
    calm: "I wrapped up my slides, answered a few investor questions, and left when the meeting broke at eight.",
    defensive: "I've already told this story once. Meeting, questions, home. It doesn't change on the second telling.",
  },
  "priya-relationship": {
    calm: "Naomi and I worked closely on positioning. We didn't always agree on how rosy to make the numbers look, but we respected each other.",
    defensive: "We had our disagreements, sure. Every founder and product lead do. That's not a motive, that's Tuesday.",
  },
  "priya-motive": {
    calm: "Naomi flagged a few metrics in the deck. Normal pre-pitch scrutiny. Nothing that couldn't be explained.",
    defensive: "You're fishing. Every board deck has numbers that need context. That's not fraud, that's storytelling.",
  },
  "priya-alibi": {
    calm: "My building has a doorman. I'm sure he'd remember me coming in.",
    defensive: "What, you want a notarized statement? I went home. That's the truth.",
  },
  "priya-evidence": {
    calm: "I haven't touched the metrics dashboard since the original draft, weeks ago.",
    defensive: "I'm not going to explain our analytics pipeline to you like you're on the audit committee.",
  },
  "priya-pressure": {
    calm: "I think you're reaching, Detective. I'd be careful about accusations you can't back up.",
    defensive: "This conversation is over unless my lawyer is in the room.",
  },
  "daniel-timeline": {
    calm: "I stayed for the full post-mortem, said my goodbyes around eight, and drove back to the city. Long night for everyone at that table.",
    defensive: "I've walked you through this once. Meeting, car, home. Nothing about that story is negotiable.",
  },
  "daniel-relationship": {
    calm: "Naomi and I talked more term sheets than small talk, if I'm honest. I respected how hard she pushed back — mine included.",
    defensive: "We had the normal friction between a founder and her lead investor. That's not a motive, Detective, that's governance.",
  },
  "daniel-motive": {
    calm: "She mentioned wanting to review some trading disclosures with the board. I assumed it was routine compliance.",
    defensive: "You're reaching. Every investor on that cap table has positions that need context. That doesn't make me a killer.",
  },
  "daniel-alibi": {
    calm: "My driver dropped me at home. He'd remember the time if you ask him.",
    defensive: "You want a sworn statement from my doorman? Fine. I went home.",
  },
  "daniel-evidence": {
    calm: "I left right after the meeting wrapped and was home well before nine.",
    defensive: "I've already answered this. I left. I don't know what else you're looking for.",
  },
  "daniel-pressure": {
    calm: "I'd tread carefully with accusations you can't yet support, Detective.",
    defensive: "This conversation ends the moment my attorney isn't in the room.",
  },
};

const CATEGORY_FALLBACK: Record<string, Record<QuestionCategory, ResponseVariant>> = {
  "lena-cross": {
    timeline: PRESET_RESPONSES["lena-timeline"],
    relationship: PRESET_RESPONSES["lena-relationship"],
    motive: PRESET_RESPONSES["lena-motive"],
    alibi: PRESET_RESPONSES["lena-alibi"],
    evidence: PRESET_RESPONSES["lena-evidence"],
    pressure: PRESET_RESPONSES["lena-pressure"],
  },
  "adrian-shaw": {
    timeline: PRESET_RESPONSES["adrian-timeline"],
    relationship: PRESET_RESPONSES["adrian-relationship"],
    motive: PRESET_RESPONSES["adrian-motive"],
    alibi: PRESET_RESPONSES["adrian-alibi"],
    evidence: PRESET_RESPONSES["adrian-evidence"],
    pressure: PRESET_RESPONSES["adrian-pressure"],
  },
  "maya-reed": {
    timeline: PRESET_RESPONSES["maya-timeline"],
    relationship: PRESET_RESPONSES["maya-relationship"],
    motive: PRESET_RESPONSES["maya-motive"],
    alibi: PRESET_RESPONSES["maya-alibi"],
    evidence: PRESET_RESPONSES["maya-evidence"],
    pressure: PRESET_RESPONSES["maya-pressure"],
  },
  "marcus-webb": {
    timeline: PRESET_RESPONSES["marcus-timeline"],
    relationship: PRESET_RESPONSES["marcus-relationship"],
    motive: PRESET_RESPONSES["marcus-motive"],
    alibi: PRESET_RESPONSES["marcus-alibi"],
    evidence: PRESET_RESPONSES["marcus-evidence"],
    pressure: PRESET_RESPONSES["marcus-pressure"],
  },
  "priya-anand": {
    timeline: PRESET_RESPONSES["priya-timeline"],
    relationship: PRESET_RESPONSES["priya-relationship"],
    motive: PRESET_RESPONSES["priya-motive"],
    alibi: PRESET_RESPONSES["priya-alibi"],
    evidence: PRESET_RESPONSES["priya-evidence"],
    pressure: PRESET_RESPONSES["priya-pressure"],
  },
  "daniel-cho": {
    timeline: PRESET_RESPONSES["daniel-timeline"],
    relationship: PRESET_RESPONSES["daniel-relationship"],
    motive: PRESET_RESPONSES["daniel-motive"],
    alibi: PRESET_RESPONSES["daniel-alibi"],
    evidence: PRESET_RESPONSES["daniel-evidence"],
    pressure: PRESET_RESPONSES["daniel-pressure"],
  },
};

const EVIDENCE_OTHER_RESPONSE: Record<string, string> = {
  "lena-cross": "I don't see how that involves me. You'll have to connect the dots yourself, Detective.",
  "adrian-shaw": "I'm not sure what you'd like me to say about that. It has nothing to do with me.",
  "maya-reed": "I don't know anything about that. I'm sorry, I wish I could help more.",
  "marcus-webb": "I don't see how that involves me. You'll have to connect the dots yourself, Detective.",
  "priya-anand": "I'm not sure what you'd like me to say about that. It has nothing to do with me.",
  "daniel-cho": "I don't know anything about that. I wish I could help more, Detective.",
};

const CONTRADICTION_REPEAT_RESPONSE: Record<string, string> = {
  "lena-cross": "I already told you what happened in there. I'm not going to keep repeating myself.",
  "adrian-shaw": "We've been over this. I explained the ledger. I explained the car.",
  "maya-reed": "I already admitted what I heard. Please, can we move on?",
  "marcus-webb": "I already told you what happened that night. I'm not going to keep repeating myself.",
  "priya-anand": "We've been over this. I explained the dashboard. I explained coming back.",
  "daniel-cho": "We've covered this already. I explained the badge. I explained the car.",
};

const KEYWORD_MAP: Record<QuestionCategory, string[]> = {
  timeline: ["when", "time", "night", "minute", "hour", "leave", "left", "arrive"],
  relationship: ["relationship", "get along", "feel about", "trust", "close", "friend"],
  motive: ["why", "reason", "upset", "angry", "motive", "grudge", "conflict"],
  alibi: ["where were you", "alone", "confirm", "alibi", "prove", "anyone with you"],
  evidence: [
    "ledger", "vendor", "ridgeline", "server", "badge", "audio", "note", "garage", "email", "stairwell", "recognize",
    "model", "nightfall", "leak", "dashboard", "metrics", "short", "advisor", "commit", "dm", "slack", "repo",
  ],
  pressure: ["lying", "truth", "admit", "really", "honest", "confess"],
};

function classifyCustomQuestion(text: string): QuestionCategory {
  const lower = text.toLowerCase();
  let bestCategory: QuestionCategory = "alibi";
  let bestScore = 0;
  (Object.keys(KEYWORD_MAP) as QuestionCategory[]).forEach((category) => {
    const score = KEYWORD_MAP[category].filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });
  return bestScore > 0 ? bestCategory : "alibi";
}

async function interviewSuspect(ctx: InterviewContext): Promise<InterviewResult> {
  const suspect = getSuspect(ctx.caseId, ctx.suspectId);
  if (!suspect) {
    return {
      dialogue: "...",
      stressDelta: 0,
      trustDelta: 0,
      pressureDelta: 0,
      truthDelta: 0,
      cooperative: true,
    };
  }

  const defensive = ctx.stress >= 50 || ctx.contradictionsFound.length > 0;

  if (ctx.presentedEvidenceId) {
    const evidence = getEvidence(ctx.caseId, ctx.presentedEvidenceId);
    const rule = getContradiction(ctx.caseId, ctx.suspectId, ctx.presentedEvidenceId);

    if (rule) {
      const alreadyCaught = ctx.contradictionsFound.includes(rule.contradictionTag);
      if (alreadyCaught) {
        return {
          dialogue: CONTRADICTION_REPEAT_RESPONSE[ctx.suspectId],
          stressDelta: 5,
          trustDelta: 0,
          pressureDelta: 5,
          truthDelta: 0,
          cooperative: true,
        };
      }
      return {
        dialogue: suspect.truthStatement,
        stressDelta: 20,
        trustDelta: rule.trustDelta,
        pressureDelta: rule.pressureDelta,
        truthDelta: rule.truthDelta,
        contradictionTriggered: rule,
        cooperative: true,
      };
    }

    return {
      dialogue: evidence
        ? `${EVIDENCE_OTHER_RESPONSE[ctx.suspectId]} ("${evidence.title}"?)`
        : EVIDENCE_OTHER_RESPONSE[ctx.suspectId],
      stressDelta: 0,
      trustDelta: -3,
      pressureDelta: -5,
      truthDelta: 0,
      cooperative: false,
    };
  }

  const category: QuestionCategory =
    ctx.category === "custom" ? classifyCustomQuestion(ctx.questionText) : ctx.category;

  const variant =
    (ctx.presetQuestionId ? PRESET_RESPONSES[ctx.presetQuestionId] : undefined) ??
    CATEGORY_FALLBACK[ctx.suspectId][category];

  const dialogue = defensive ? variant.defensive : variant.calm;

  let stressDelta = 0;
  let trustDelta = 0;
  let pressureDelta = 0;

  if (category === "pressure") {
    stressDelta = 10;
    pressureDelta = 10;
    trustDelta = -2;
  } else if (category === "timeline" || category === "relationship") {
    stressDelta = -3;
    trustDelta = 3;
  } else if (category === "alibi" || category === "motive") {
    stressDelta = 3;
    trustDelta = 1;
  } else {
    stressDelta = 0;
    trustDelta = 0;
  }

  if (ctx.category === "custom" && !PRESET_RESPONSES[ctx.presetQuestionId ?? ""]) {
    pressureDelta -= 2;
  }

  return {
    dialogue,
    stressDelta,
    trustDelta,
    pressureDelta,
    truthDelta: 0,
    cooperative: true,
  };
}

async function orionSummary(ctx: OrionSummaryContext): Promise<string> {
  const evidenceText =
    ctx.unlockedEvidenceTitles.length > 0
      ? `You've unlocked ${ctx.unlockedEvidenceTitles.length} piece${ctx.unlockedEvidenceTitles.length === 1 ? "" : "s"} of evidence, including ${ctx.unlockedEvidenceTitles.slice(-3).join(", ")}.`
      : "You haven't unlocked much evidence yet — start by reviewing suspect profiles.";
  const contradictionText =
    ctx.contradictionsFound.length > 0
      ? `You've caught ${ctx.contradictionsFound.length} contradiction${ctx.contradictionsFound.length === 1 ? "" : "s"} in suspect testimony.`
      : "No contradictions caught yet — try presenting evidence directly during interrogation.";
  const timelineText =
    ctx.timelineConfidence >= 70
      ? "The timeline is holding together well."
      : ctx.timelineConfidence >= 30
        ? "The timeline still has gaps worth resolving."
        : "The timeline is mostly unconfirmed — reconstruction should be a priority.";

  return `${evidenceText} ${contradictionText} ${timelineText} Keep cross-referencing testimony against the case file, Detective — the pattern is there.`;
}

const HINT_BY_SUSPECT: Record<string, string> = {
  "adrian-shaw": "Adrian's story about going straight home is worth testing against anything with a timestamp from that garage.",
  "lena-cross": "Lena's badge tells a story independent of what she says out loud. Compare the two.",
  "maya-reed": "Maya says the night was quiet. Audio evidence rarely agrees with 'quiet.'",
  "marcus-webb": "Marcus insists he never left his desk. Check anything with a timestamp from outside the building.",
  "priya-anand": "Priya says she went straight home. Building badges don't lie about re-entries.",
  "daniel-cho": "Daniel's timeline has two separate holes — a badge and a parking still. Either one is worth presenting.",
};

async function orionHint(ctx: OrionHintContext): Promise<string> {
  if (ctx.focusSuspectId && HINT_BY_SUSPECT[ctx.focusSuspectId]) {
    return HINT_BY_SUSPECT[ctx.focusSuspectId];
  }
  if (ctx.contradictionsFound.length === 0) {
    return "Try presenting evidence directly to a suspect during interrogation — testimony and case files don't always agree.";
  }
  return "Focus on the suspect whose financial trail doesn't add up. Money leaves a longer paper trail than people expect.";
}

async function endingSummary(ctx: EndingSummaryContext): Promise<string> {
  if (ctx.caseId === "last-commit") {
    if (ctx.correctSuspect && ctx.correctMotive) {
      return `The case closes clean. ${ctx.accusedSuspectName} didn't expect an old advisor badge to outlive its welcome. Cipher Dynamics' board will spend months untangling the short positions — but the truth is on record now, Detective. That's grade ${ctx.gradeLabel} work.`;
    }
    if (ctx.correctSuspect) {
      return `You named the right person — ${ctx.accusedSuspectName} — but the case you built had gaps a good defense attorney will find. It's a conviction on shaky ground. Grade ${ctx.gradeLabel}.`;
    }
    return `${ctx.accusedSuspectName} walks, and somewhere in Cipher Dynamics' repo history, the real story of that night stays buried in a commit nobody reopened. Grade ${ctx.gradeLabel}.`;
  }

  if (ctx.correctSuspect && ctx.correctMotive) {
    return `The case closes clean. ${ctx.accusedSuspectName} didn't expect the ledger to talk louder than the alibi. Northstar's board will spend months untangling Ridgeline Consulting — but the truth is on record now, Detective. That's grade ${ctx.gradeLabel} work.`;
  }
  if (ctx.correctSuspect) {
    return `You named the right person — ${ctx.accusedSuspectName} — but the case you built had gaps a good defense attorney will find. It's a conviction on shaky ground. Grade ${ctx.gradeLabel}.`;
  }
  return `${ctx.accusedSuspectName} walks, and somewhere in Northstar Systems, the real story stays buried in a ledger nobody reopened. The case file closes unsolved in every way that matters. Grade ${ctx.gradeLabel}.`;
}

export const mockProvider: AIProvider = {
  mode: "mock",
  interviewSuspect,
  orionSummary,
  orionHint,
  endingSummary,
};

export function applyDelta(current: number, delta: number): number {
  return clamp(current + delta, 0, 100);
}
