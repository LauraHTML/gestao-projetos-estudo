import { Badge, Button, Icon, ProgressBar } from "@/components/atoms";

export interface MilestoneHeaderProps {
  title: string;
  description: string;
  completed: number;
  total: number;
  blocked: number;
  percent: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onAddTask: () => void;
}

export function MilestoneHeader({
  title,
  description,
  completed,
  total,
  blocked,
  percent,
  collapsed,
  onToggleCollapse,
  onAddTask,
}: MilestoneHeaderProps) {
  return (
    <div className="flex flex-col gap-space-sm px-space-lg py-space-md bg-surface-elevated border-b border-border-subtle">
      <div className="flex items-start justify-between gap-space-md flex-wrap">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-start gap-space-sm text-left group cursor-pointer min-w-0 flex-1"
        >
          <span className="mt-0.5 text-text-muted group-hover:text-text-primary transition-colors">
            <Icon
              name={collapsed ? "chevronRight" : "chevronDown"}
              size="sm"
            />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-space-sm flex-wrap">
              <h2 className="text-sm font-semibold tracking-tight text-text-primary">
                {title}
              </h2>
              <span className="text-xs font-mono tabular-nums text-text-muted">
                {completed}/{total} concluídas
              </span>
              {blocked > 0 && (
                <Badge tone="blocked">
                  <Icon name="locked" size="xs" />
                  {blocked} {blocked === 1 ? "bloqueada" : "bloqueadas"}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </button>

        <div className="flex items-center gap-space-md shrink-0">
          <div className="hidden sm:flex items-center gap-space-sm w-28">
            <ProgressBar
              value={percent}
              tone={percent === 100 && total > 0 ? "done" : "accent"}
              size="xs"
              label={`Progresso de ${title}`}
            />
            <span className="text-xs font-mono tabular-nums text-text-secondary w-8 text-right">
              {percent}%
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onAddTask}>
            <Icon name="add" size="xs" />
            <span>Tarefa</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
