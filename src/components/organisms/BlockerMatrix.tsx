import { Badge, Button, Icon } from "@/components/atoms";
import { EmptyState } from "@/components/molecules";
import { MASTERY_LABELS } from "@/lib/studySelectors";
import type { ConceptImpact, MasteryStatus } from "@/types/study";

export interface BlockerMatrixProps {
  impacts: ConceptImpact[];
  onOpenConcept: (conceptId: string) => void;
  onSelectTask: (taskId: string) => void;
  onSetConceptMastery: (conceptId: string, mastery: MasteryStatus) => void;
}

export function BlockerMatrix({
  impacts,
  onOpenConcept,
  onSelectTask,
  onSetConceptMastery,
}: BlockerMatrixProps) {
  const activeBlockers = impacts
    .filter((i) => i.blockedTasks.length > 0)
    .sort((a, b) => b.blockedTasks.length - a.blockedTasks.length);

  const resolvedPrerequisites = impacts.filter(
    (i) => i.blockedTasks.length === 0 && i.unlockedTasks.length > 0
  );

  return (
    <div className="flex flex-col gap-space-2xl">
      {/* Section 1: Active Blockers */}
      <section className="flex flex-col gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <h2 className="text-base font-semibold tracking-tight text-text-primary">
            Conceitos bloqueando tarefas do projeto
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Ordenados pelo maior impacto de desbloqueio. Ao estudar e marcar um
            conceito como <strong className="text-text-primary font-medium">Dominado</strong>,
            todas as tarefas dependentes são liberadas automaticamente.
          </p>
        </div>

        {activeBlockers.length === 0 ? (
          <EmptyState
            icon="unlocked"
            title="Nenhum bloqueio ativo neste projeto"
            description="Todos os conceitos pré-requisitos das suas tarefas já foram dominados ou ainda não há tarefas bloqueadas."
          />
        ) : (
          <div className="flex flex-col gap-space-md">
            {activeBlockers.map((impact) => (
              <div
                key={impact.concept.id}
                className="surface-card rounded-token-lg p-space-lg flex flex-col lg:flex-row lg:items-center gap-space-lg"
              >
                {/* Blocking Concept Node */}
                <div className="lg:w-[40%] flex flex-col gap-space-sm min-w-0">
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <Badge tone="blocked">
                      <Icon name="locked" size="xs" />
                      Bloqueia {impact.blockedTasks.length}{" "}
                      {impact.blockedTasks.length === 1 ? "tarefa" : "tarefas"}
                    </Badge>
                    <Badge
                      tone={
                        impact.concept.mastery === "estudando"
                          ? "progress"
                          : "idle"
                      }
                    >
                      {MASTERY_LABELS[impact.concept.mastery]}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenConcept(impact.concept.id)}
                    className="text-left group cursor-pointer"
                  >
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                      {impact.concept.title}
                    </h3>
                    {impact.concept.summary && (
                      <p className="text-xs text-text-secondary mt-space-2xs line-clamp-2 leading-relaxed">
                        {impact.concept.summary}
                      </p>
                    )}
                  </button>

                  <div className="flex items-center gap-space-sm flex-wrap pt-space-2xs">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenConcept(impact.concept.id)}
                    >
                      <Icon name="concepts" size="xs" />
                      <span>Estudar anotações</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        onSetConceptMastery(impact.concept.id, "dominado")
                      }
                    >
                      <Icon name="done" size="xs" tone="done" />
                      <span>Marcar dominado</span>
                    </Button>
                  </div>
                </div>

                {/* Directional Connector */}
                <div className="hidden lg:flex items-center justify-center text-text-muted shrink-0">
                  <Icon name="arrowRight" size="md" />
                </div>

                {/* Blocked Tasks List */}
                <div className="flex-1 min-w-0 flex flex-col gap-space-xs lg:pl-space-md lg:border-l lg:border-border-subtle">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                    Atividades aguardando este conceito
                  </span>
                  <div className="flex flex-col gap-space-xs">
                    {impact.blockedTasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => onSelectTask(task.id)}
                        className="w-full text-left flex items-center justify-between gap-space-sm px-space-md py-space-sm rounded-token-md bg-surface-recessed border border-border-subtle hover:border-border-strong transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-medium text-text-primary truncate">
                          {task.title}
                        </span>
                        <Icon
                          name="chevronRight"
                          size="xs"
                          tone="muted"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Resolved Prerequisites */}
      {resolvedPrerequisites.length > 0 && (
        <section className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-2xs">
            <h2 className="text-sm font-semibold tracking-tight text-text-secondary">
              Pré-requisitos já desbloqueados
            </h2>
            <p className="text-xs text-text-muted">
              Conceitos dominados que liberaram atividades do seu roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {resolvedPrerequisites.map((impact) => (
              <div
                key={impact.concept.id}
                className="surface-panel rounded-token-lg p-space-md flex items-start justify-between gap-space-md"
              >
                <div className="min-w-0 flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <Icon name="unlocked" size="xs" tone="done" />
                    <button
                      type="button"
                      onClick={() => onOpenConcept(impact.concept.id)}
                      className="text-sm font-medium text-text-primary hover:text-accent-primary transition-colors truncate cursor-pointer"
                    >
                      {impact.concept.title}
                    </button>
                  </div>
                  <span className="text-xs text-text-muted">
                    Desbloqueou {impact.unlockedTasks.length}{" "}
                    {impact.unlockedTasks.length === 1 ? "tarefa" : "tarefas"}:{" "}
                    {impact.unlockedTasks.map((t) => t.title).join(", ")}
                  </span>
                </div>
                <Badge tone="done">Dominado</Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
