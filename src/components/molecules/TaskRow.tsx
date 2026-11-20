import { Badge, Checkbox, Icon } from "@/components/atoms";
import { TASK_STATE_LABELS } from "@/lib/studySelectors";
import type { EnrichedTask } from "@/types/study";
import { ConceptChip } from "./ConceptChip";

export interface TaskRowProps {
  task: EnrichedTask;
  onToggleComplete: (task: EnrichedTask) => void;
  onSelectTask: (taskId: string) => void;
  onOpenConcept: (conceptId: string) => void;
}

const stateBadgeTone = {
  bloqueada: "blocked",
  pendente: "idle",
  em_andamento: "progress",
  concluida: "done",
} as const;

export function TaskRow({
  task,
  onToggleComplete,
  onSelectTask,
  onOpenConcept,
}: TaskRowProps) {
  const isDone = task.status === "concluida";

  return (
    <div className="group flex items-start gap-space-md px-space-lg py-space-md border-b border-border-subtle last:border-b-0 hover:bg-surface-hover/50 transition-colors duration-150">
      <div className="pt-0.5">
        <Checkbox
          id={`task-check-${task.id}`}
          checked={isDone}
          blocked={task.isBlocked}
          onChange={() => onToggleComplete(task)}
          ariaLabel={
            isDone
              ? `Reabrir tarefa ${task.title}`
              : task.isBlocked
                ? `Tarefa ${task.title} bloqueada por conceito não dominado`
                : `Concluir tarefa ${task.title}`
          }
        />
      </div>

      <div className="min-w-0 flex-1 flex flex-col gap-space-xs">
        <div className="flex items-start justify-between gap-space-md">
          <button
            type="button"
            onClick={() => onSelectTask(task.id)}
            className="text-left group/title cursor-pointer min-w-0"
          >
            <span
              className={`text-sm font-medium leading-snug transition-colors ${
                isDone
                  ? "line-through text-text-muted"
                  : "text-text-primary group-hover/title:text-accent-primary"
              }`}
            >
              {task.title}
            </span>
          </button>

          <div className="flex items-center gap-space-sm shrink-0">
            <Badge tone={stateBadgeTone[task.effectiveState]}>
              {TASK_STATE_LABELS[task.effectiveState]}
            </Badge>
            <button
              type="button"
              onClick={() => onSelectTask(task.id)}
              aria-label={`Editar tarefa ${task.title}`}
              className="opacity-70 group-hover:opacity-100 p-1 rounded-token-sm text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Icon name="edit" size="xs" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Linked concepts & explicit blocker callout */}
        {(task.blockingConcepts.length > 0 ||
          task.resolvedPrerequisites.length > 0 ||
          task.referenceConcepts.length > 0) && (
          <div className="flex flex-wrap items-center gap-space-xs pt-space-2xs">
            {task.blockingConcepts.map((concept) => (
              <ConceptChip
                key={concept.id}
                concept={concept}
                isBlocking
                onClick={() => onOpenConcept(concept.id)}
              />
            ))}
            {task.resolvedPrerequisites.map((concept) => (
              <ConceptChip
                key={concept.id}
                concept={concept}
                isResolvedPrerequisite
                onClick={() => onOpenConcept(concept.id)}
              />
            ))}
            {task.referenceConcepts.map((concept) => (
              <ConceptChip
                key={concept.id}
                concept={concept}
                onClick={() => onOpenConcept(concept.id)}
              />
            ))}
          </div>
        )}

        {task.isBlocked && task.blockingConcepts[0] && (
          <div className="flex items-center justify-between gap-space-sm mt-space-2xs pt-space-xs border-t border-border-subtle/70 text-xs">
            <span className="text-status-blocked flex items-center gap-space-xs min-w-0">
              <Icon name="warning" size="xs" />
              <span className="truncate">
                Bloqueada até dominar{" "}
                <strong className="font-medium">
                  {task.blockingConcepts.map((c) => c.title).join(", ")}
                </strong>
              </span>
            </span>
            <button
              type="button"
              onClick={() => onOpenConcept(task.blockingConcepts[0].id)}
              className="inline-flex items-center gap-space-2xs text-accent-primary hover:text-accent-primary-hover font-medium shrink-0 cursor-pointer"
            >
              <span>Estudar agora</span>
              <Icon name="arrowRight" size="xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
