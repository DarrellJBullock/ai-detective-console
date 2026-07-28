import { ProgressBar } from "@/components/ui/ProgressBar";

export function TruthMeter({ value }: { value: number }) {
  return <ProgressBar label="Truth Consistency" value={value} variant="success" />;
}
