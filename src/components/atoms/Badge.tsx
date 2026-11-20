import type { ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "accent"
  | "done"
  | "progress"
  | "blocked"
  | "idle";

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-hover text-text-secondary border-border-subtle",
  accent: "bg-accent-primary-soft text-accent-primary border-transparent",
  done: "bg-status-done-soft text-status-done border-transparent",
  progress: "bg-status-progress-soft text-status-progress border-transparent",
  blocked: "bg-status-blocked-soft text-status-blocked border-transparent",
  idle: "bg-status-idle-soft text-text-secondary border-transparent",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-space-xs px-space-sm py-space-2xs text-xs font-medium rounded-token-sm border whitespace-nowrap ${toneClasses[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
