import { ProgressBar } from "@/components/ui/ProgressBar";

export function TrustMeter({ value }: { value: number }) {
  return <ProgressBar label="Trust" value={value} variant="cyan" />;
}
