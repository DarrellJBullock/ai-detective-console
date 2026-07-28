import { GameBadge } from "@/components/ui/GameBadge";

export function ContradictionBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <GameBadge variant="red">
      {count} Contradiction{count === 1 ? "" : "s"}
    </GameBadge>
  );
}
