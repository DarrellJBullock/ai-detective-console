import { NextResponse } from "next/server";
import { getAIProvider, type AIMode } from "@/lib/ai/aiProvider";
import type { EndingSummaryContext, OrionHintContext, OrionSummaryContext } from "@/lib/ai/aiProvider";

type OrionRequestBody =
  | ({ type: "summary"; mode?: AIMode } & OrionSummaryContext)
  | ({ type: "hint"; mode?: AIMode } & OrionHintContext)
  | ({ type: "ending"; mode?: AIMode } & EndingSummaryContext);

export async function POST(request: Request) {
  const body = (await request.json()) as OrionRequestBody;
  const provider = await getAIProvider(body.mode ?? "mock");

  if (body.type === "summary") {
    const text = await provider.orionSummary(body);
    return NextResponse.json({ text });
  }
  if (body.type === "hint") {
    const text = await provider.orionHint(body);
    return NextResponse.json({ text });
  }
  const text = await provider.endingSummary(body);
  return NextResponse.json({ text });
}
