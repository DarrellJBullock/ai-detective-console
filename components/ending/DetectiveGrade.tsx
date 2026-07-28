import { cn } from "@/lib/utils";

const GRADE_COLOR: Record<string, string> = {
  S: "text-amber border-amber",
  A: "text-success border-success",
  B: "text-cyan-signal border-cyan-signal",
  C: "text-fog border-fog",
  D: "text-red-string border-red-string",
};

export function DetectiveGrade({ grade, score }: { grade: string; score: number }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "font-display flex h-32 w-32 items-center justify-center rounded-full border-4 text-6xl",
          GRADE_COLOR[grade] ?? "text-fog border-fog"
        )}
      >
        {grade}
      </div>
      <p className="font-mono mt-3 text-xs uppercase tracking-widest text-fog">Detective Score: {score}/100</p>
    </div>
  );
}
