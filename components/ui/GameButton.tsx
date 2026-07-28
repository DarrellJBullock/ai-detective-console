"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface GameButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-red-string text-ink border-red-string hover:bg-red-string-dim hover:border-red-string-dim",
  secondary:
    "bg-transparent text-paper border-steel hover:border-cyan-signal hover:text-cyan-signal",
  ghost: "bg-transparent text-fog border-transparent hover:text-paper hover:border-steel",
  danger: "bg-transparent text-red-string border-red-string hover:bg-red-string hover:text-ink",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function GameButton({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: GameButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={disabled || reducedMotion ? undefined : { y: -2 }}
      whileTap={disabled || reducedMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
      disabled={disabled}
      className={cn(
        "console-focus font-display inline-flex items-center justify-center gap-2 border tracking-wide transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-40",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
