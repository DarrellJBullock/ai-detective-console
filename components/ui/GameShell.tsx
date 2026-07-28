import { cn } from "@/lib/utils";

interface GameShellProps {
  children: React.ReactNode;
  className?: string;
  scanlines?: boolean;
}

export function GameShell({ children, className, scanlines = true }: GameShellProps) {
  return (
    <main
      className={cn(
        "relative flex min-h-dvh w-full flex-col bg-ink text-paper",
        scanlines && "crt-scanlines",
        className
      )}
    >
      {children}
    </main>
  );
}
