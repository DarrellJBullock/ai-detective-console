import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

type MeterVariant = "red" | "amber" | "cyan" | "success" | "neutral";

const VARIANT_CLASSES: Record<MeterVariant, string> = {
  red: "bg-red-string",
  amber: "bg-amber",
  cyan: "bg-cyan-signal",
  success: "bg-success",
  neutral: "bg-fog",
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  variant?: MeterVariant;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  variant = "cyan",
  showValue = true,
  className,
}: ProgressBarProps) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-fog">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="meter-track h-2 w-full rounded-sm"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={cn("meter-fill", VARIANT_CLASSES[variant])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
