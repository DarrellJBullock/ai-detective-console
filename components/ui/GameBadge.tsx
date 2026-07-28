import { cn } from "@/lib/utils";

type BadgeVariant = "neutral" | "red" | "amber" | "cyan" | "success";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "border-steel text-fog",
  red: "border-red-string text-red-string",
  amber: "border-amber text-amber",
  cyan: "border-cyan-signal text-cyan-signal",
  success: "border-success text-success",
};

export function GameBadge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[11px] uppercase tracking-wider",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
