import { ProgressBar } from "@/components/ui/ProgressBar";

export function PressureMeter({ value }: { value: number }) {
  return <ProgressBar label="Pressure" value={value} variant="amber" />;
}
