import { ProgressBar } from "@/components/ui/ProgressBar";

export function StressMeter({ value }: { value: number }) {
  return <ProgressBar label="Stress" value={value} variant="red" />;
}
