import { ProgressBar } from "@/components/atoms";

export interface MetricItemProps {
  label: string;
  value: string;
  detail?: string;
  progress?: number;
  tone?: "accent" | "done" | "progress" | "blocked";
}

const valueColorClass: Record<NonNullable<MetricItemProps["tone"]>, string> = {
  accent: "text-text-primary",
  done: "text-status-done",
  progress: "text-status-progress",
  blocked: "text-status-blocked",
};

export function MetricItem({
  label,
  value,
  detail,
  progress,
  tone = "accent",
}: MetricItemProps) {
  return (
    <div className="flex flex-col gap-space-xs min-w-0">
      <div className="flex items-baseline justify-between gap-space-md">
        <span className="text-xs text-text-muted truncate">{label}</span>
        {detail && (
          <span className="text-xs font-mono tabular-nums text-text-secondary shrink-0">
            {detail}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-space-sm">
        <span
          className={`text-lg font-semibold tracking-tight font-mono tabular-nums ${valueColorClass[tone]}`}
        >
          {value}
        </span>
      </div>
      {typeof progress === "number" && (
        <ProgressBar
          value={progress}
          tone={tone === "done" ? "done" : tone === "progress" ? "progress" : "accent"}
          size="xs"
          label={label}
        />
      )}
    </div>
  );
}
