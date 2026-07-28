import { cn } from "@/lib/utils";

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  interactive?: boolean;
}

export function GameCard({ children, className, as = "div", interactive = false }: GameCardProps) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        "panel rounded-sm p-4",
        interactive && "transition-colors duration-150 hover:bg-case-file-hover",
        className
      )}
    >
      {children}
    </Comp>
  );
}
