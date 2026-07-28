import { cn } from "@/lib/utils";

interface FocusRingProps {
  children: React.ReactNode;
  className?: string;
  gamepadFocused?: boolean;
}

/** Wraps custom interactive elements (board nodes, cards) with the console focus bracket. */
export function FocusRing({ children, className, gamepadFocused = false }: FocusRingProps) {
  return (
    <div
      tabIndex={0}
      data-gamepad-focused={gamepadFocused}
      className={cn("console-focus rounded-sm", className)}
    >
      {children}
    </div>
  );
}
