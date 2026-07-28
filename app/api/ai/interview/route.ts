import { NextResponse } from "next/server";
import { getAIProvider, type AIMode, type InterviewContext } from "@/lib/ai/aiProvider";

export async function POST(request: Request) {
  const body = (await request.json()) as { mode?: AIMode } & InterviewContext;
  const { mode, ...ctx } = body;

  const provider = await getAIProvider(mode ?? "mock");
  const result = await provider.interviewSuspect(ctx);

  return NextResponse.json(result);
}
