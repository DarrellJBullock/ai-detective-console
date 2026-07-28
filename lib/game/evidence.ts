import type { Evidence } from "./types";

export const EVIDENCE: Evidence[] = [
  {
    id: "security-badge-log",
    title: "Security Badge Log",
    description:
      "Executive floor badge scans for the night of the murder. Shows entry and exit timestamps for all three suspects, including a server room scan attributed to Lena Cross at 10:44 PM.",
    category: "access-record",
    discoveredAt: "12:52 AM — pulled by building security",
    relatedSuspects: ["lena-cross", "adrian-shaw", "maya-reed"],
    contradictionTags: ["lena-server-room-denial"],
    unlocked: true,
    importanceLevel: "high",
    sourceLocation: "Building security office",
  },
  {
    id: "broken-glass",
    title: "Broken Glass, CFO Office",
    description:
      "Shards from a shattered display case near the window. Consistent with a struggle. No usable fingerprints, but the spread pattern suggests the victim was pushed backward.",
    category: "physical",
    discoveredAt: "12:50 AM — crime scene",
    relatedSuspects: [],
    contradictionTags: [],
    unlocked: true,
    importanceLevel: "medium",
    sourceLocation: "Marcus Vale's office",
  },
  {
    id: "server-room-access-record",
    title: "Server Room Access Record",
    description:
      "Automated access log for the 41st-floor server room. Confirms Lena Cross's badge unlocked the door at 10:44 PM and again at 11:52 PM, both after standard hours.",
    category: "access-record",
    discoveredAt: "1:10 AM — IT operations",
    relatedSuspects: ["lena-cross"],
    contradictionTags: ["lena-server-room-denial"],
    unlocked: false,
    importanceLevel: "medium",
    sourceLocation: "IT operations center",
  },
  {
    id: "ai-project-access-logs",
    title: "AI Project Access Logs",
    description:
      "Internal logs showing Lena Cross created an unauthorized project workspace named 'Continuum' three weeks before the murder, hidden from the standard engineering audit trail.",
    category: "digital",
    discoveredAt: "1:15 AM — IT operations",
    relatedSuspects: ["lena-cross"],
    contradictionTags: [],
    unlocked: false,
    importanceLevel: "medium",
    sourceLocation: "Northstar internal servers",
  },
  {
    id: "encrypted-finance-ledger",
    title: "Encrypted Finance Ledger",
    description:
      "Marcus Vale's private ledger file, decrypted by forensic accounting. Shows a series of transfers routed through a shell vendor, 'Ridgeline Consulting,' approved under Adrian Shaw's signing authority.",
    category: "document",
    discoveredAt: "2:30 AM — forensic accounting",
    relatedSuspects: ["adrian-shaw"],
    contradictionTags: ["adrian-shell-vendor"],
    unlocked: false,
    importanceLevel: "critical",
    sourceLocation: "Marcus Vale's encrypted workstation",
  },
  {
    id: "deleted-email-thread",
    title: "Deleted Email Thread",
    description:
      "Recovered emails between Marcus Vale and Adrian Shaw. Marcus writes: 'The Ridgeline numbers don't reconcile. We need to talk tonight, before the board sees this.' Sent at 9:15 PM.",
    category: "digital",
    discoveredAt: "2:45 AM — email recovery",
    relatedSuspects: ["adrian-shaw"],
    contradictionTags: ["adrian-shell-vendor", "adrian-straight-home"],
    unlocked: false,
    importanceLevel: "critical",
    sourceLocation: "Northstar mail server backup",
  },
  {
    id: "parking-garage-still",
    title: "Parking Garage Camera Still",
    description:
      "A grainy still from the executive parking garage camera. Adrian Shaw's car is shown leaving the garage at 12:41 AM — not at 10:30 PM as he claims.",
    category: "physical",
    discoveredAt: "1:40 AM — garage security footage",
    relatedSuspects: ["adrian-shaw"],
    contradictionTags: ["adrian-straight-home"],
    unlocked: false,
    importanceLevel: "high",
    sourceLocation: "Parking garage, level B2",
  },
  {
    id: "coffee-cup-lipstick",
    title: "Coffee Cup with Lipstick",
    description:
      "A cup found on the credenza in Marcus's office, bearing a lipstick mark matching a shade worn by Maya Reed. Suggests she was in the office earlier that evening for a legitimate reason.",
    category: "physical",
    discoveredAt: "12:55 AM — crime scene",
    relatedSuspects: ["maya-reed"],
    contradictionTags: [],
    unlocked: false,
    importanceLevel: "low",
    sourceLocation: "Marcus Vale's office",
  },
  {
    id: "stairwell-audio-transcript",
    title: "Emergency Stairwell Audio Clip Transcript",
    description:
      "Emergency stairwell intercoms record ambient audio on trigger. Transcript captures raised voices at 12:03 AM: a man's voice saying 'You don't understand what's at stake,' and a second voice, muffled, replying 'Then explain it to the board.'",
    category: "audio",
    discoveredAt: "1:55 AM — building security",
    relatedSuspects: ["maya-reed", "adrian-shaw"],
    contradictionTags: ["maya-heard-nothing"],
    unlocked: false,
    importanceLevel: "critical",
    sourceLocation: "Stairwell B emergency intercom",
  },
  {
    id: "final-note",
    title: "Marcus Vale's Final Note",
    description:
      "A handwritten note found crumpled near the desk, timestamped by the moment it was reportedly written. Reads: 'Ridgeline is Adrian's. Confronting him tonight. If something happens, look at the vendor file.'",
    category: "document",
    discoveredAt: "12:58 AM — crime scene",
    relatedSuspects: ["adrian-shaw"],
    contradictionTags: ["adrian-shell-vendor"],
    unlocked: false,
    importanceLevel: "critical",
    sourceLocation: "Marcus Vale's office floor",
  },
];

export function getEvidenceById(id: string): Evidence | undefined {
  return EVIDENCE.find((e) => e.id === id);
}
