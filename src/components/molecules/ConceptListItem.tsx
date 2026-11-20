import { Badge, Icon } from "@/components/atoms";
import { MASTERY_LABELS } from "@/lib/studySelectors";
import type { ConceptImpact, MasteryStatus } from "@/types/study";

export interface ConceptListItemProps {
  impact: ConceptImpact;
  selected: boolean;
  onSelect: () => void;
}

const masteryTone: Record<MasteryStatus, "idle" | "progress" | "done"> = {
  nao_iniciado: "idle",
  estudando: "progress",
  dominado: "done",
};

export function ConceptListItem({
  impact,
  selected,
  onSelect,
}: ConceptListItemProps) {
  const { concept, blockedTasks } = impact;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-space-md py-space-md rounded-token-md border transition-colors duration-150 cursor-pointer flex flex-col gap-space-xs ${
        selected
          ? "bg-surface-card border-border-strong"
          : "bg-transparent border-transparent hover:bg-surface-hover/60"
      }`}
    >
      <div className="flex items-start justify-between gap-space-sm">
        <span
          className={`text-sm font-medium leading-snug ${
            selected ? "text-text-primary" : "text-text-primary/90"
          }`}
        >
          {concept.title}
        </span>
        {blockedTasks.length > 0 && (
          <span
            title={`Bloqueia ${blockedTasks.length} ${blockedTasks.length === 1 ? "tarefa" : "tarefas"}`}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-token-sm bg-status-blocked-soft text-status-blocked text-[11px] font-mono tabular-nums shrink-0"
          >
            <Icon name="locked" size="xs" />
            {blockedTasks.length}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-space-sm">
        <span className="text-xs text-text-muted truncate">
          {concept.category}
        </span>
        <Badge tone={masteryTone[concept.mastery]}>
          {MASTERY_LABELS[concept.mastery]}
        </Badge>
      </div>
    </button>
  );
}
