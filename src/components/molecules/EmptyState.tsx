import { Button, Icon } from "@/components/atoms";
import type { IconName } from "@/tokens";

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-space-3xl px-space-xl surface-panel rounded-token-lg">
      <div className="w-10 h-10 rounded-token-md bg-surface-card border border-border-default flex items-center justify-center mb-space-md">
        <Icon name={icon} size="md" tone="muted" />
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <p className="text-xs text-text-secondary mt-space-xs max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="mt-space-lg">
          <Icon name="add" size="xs" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}
