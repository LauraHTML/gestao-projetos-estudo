export interface ProgressBarProps {
  value: number;
  tone?: "accent" | "done" | "progress";
  size?: "xs" | "sm" | "md";
  label?: string;
  className?: string;
}

const fillToneClasses: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  accent: "bg-accent-primary",
  done: "bg-status-done",
  progress: "bg-status-progress",
};

const heightClasses: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
};

export function ProgressBar({
  value,
  tone = "accent",
  size = "sm",
  label,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progresso"}
      className={`w-full overflow-hidden rounded-token-full bg-surface-hover ${heightClasses[size]} ${className}`.trim()}
    >
      <div
        className={`h-full rounded-token-full transition-all duration-300 ease-out ${fillToneClasses[tone]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
