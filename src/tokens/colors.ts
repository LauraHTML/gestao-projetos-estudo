/**
 * Color Design Tokens (TypeScript representation)
 * Mirrors src/styles/tokens/colors.css for programmatic use and strict typing.
 */
export const colorTokens = {
  surface: {
    canvas: "var(--color-surface-canvas)",
    sidebar: "var(--color-surface-sidebar)",
    elevated: "var(--color-surface-elevated)",
    card: "var(--color-surface-card)",
    hover: "var(--color-surface-hover)",
    recessed: "var(--color-surface-recessed)",
    overlay: "var(--color-surface-overlay)",
  },
  border: {
    subtle: "var(--color-border-subtle)",
    default: "var(--color-border-default)",
    strong: "var(--color-border-strong)",
  },
  text: {
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    muted: "var(--color-text-muted)",
    inverse: "var(--color-text-inverse)",
  },
  accent: {
    primary: "var(--color-accent-primary)",
    primaryHover: "var(--color-accent-primary-hover)",
    primarySoft: "var(--color-accent-primary-soft)",
    primaryMuted: "var(--color-accent-primary-muted)",
    steel: "var(--color-accent-steel)",
  },
  status: {
    done: "var(--color-status-done)",
    doneSoft: "var(--color-status-done-soft)",
    progress: "var(--color-status-progress)",
    progressSoft: "var(--color-status-progress-soft)",
    blocked: "var(--color-status-blocked)",
    blockedSoft: "var(--color-status-blocked-soft)",
    idle: "var(--color-status-idle)",
    idleSoft: "var(--color-status-idle-soft)",
  },
} as const;

export type ColorTone =
  | "default"
  | "secondary"
  | "muted"
  | "accent"
  | "done"
  | "progress"
  | "blocked"
  | "idle";

export const colorToneTextClass: Record<ColorTone, string> = {
  default: "text-text-primary",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  accent: "text-accent-primary",
  done: "text-status-done",
  progress: "text-status-progress",
  blocked: "text-status-blocked",
  idle: "text-status-idle",
};
