import { Badge, Button, Divider, Icon } from "@/components/atoms";
import { MetricItem } from "@/components/molecules";
import type { ProjectMetrics, StudyProject } from "@/types/study";

export interface ProjectHeaderProps {
  project: StudyProject;
  metrics: ProjectMetrics;
  onOpenNewTask: () => void;
  onOpenNewConcept: () => void;
  onJumpToBlockers: () => void;
}

export function ProjectHeader({
  project,
  metrics,
  onOpenNewTask,
  onOpenNewConcept,
  onJumpToBlockers,
}: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-space-xl">
      {/* Top Row: Identity + Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-lg">
        <div className="min-w-0 flex-1 flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <Badge tone="accent">{project.area}</Badge>
            <span className="text-xs text-text-muted">{project.theme}</span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-text-primary leading-tight">
            {project.name}
          </h1>

          {project.goal && (
            <p className="text-sm text-text-secondary max-w-3xl leading-relaxed mt-space-2xs">
              {project.goal}
            </p>
          )}

          {(project.repoUrl || project.roadmapUrl) && (
            <div className="flex items-center gap-space-lg flex-wrap pt-space-xs">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-space-xs text-xs text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <Icon name="project" size="xs" />
                  <span>Repositório GitHub</span>
                  <Icon name="external" size="xs" />
                </a>
              )}
              {project.roadmapUrl && (
                <a
                  href={project.roadmapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-space-xs text-xs text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <Icon name="roadmap" size="xs" />
                  <span>Trilha roadmap.sh</span>
                  <Icon name="external" size="xs" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
          <Button
            id="btn-header-new-concept"
            variant="secondary"
            size="md"
            onClick={onOpenNewConcept}
          >
            <Icon name="concepts" size="sm" />
            <span>Novo conceito</span>
          </Button>
          <Button
            id="btn-header-new-task"
            variant="primary"
            size="md"
            onClick={onOpenNewTask}
          >
            <Icon name="add" size="sm" />
            <span>Nova tarefa</span>
          </Button>
        </div>
      </div>

      {/* Unified Progress Strip (clean surface panel, zero over-nested cards) */}
      <div className="surface-panel rounded-token-lg px-space-lg py-space-md grid grid-cols-2 lg:grid-cols-4 gap-space-lg items-center">
        <MetricItem
          label="Progresso do roadmap"
          value={`${metrics.taskProgressPercent}%`}
          detail={`${metrics.completedTasks}/${metrics.totalTasks} tarefas`}
          progress={metrics.taskProgressPercent}
          tone={metrics.taskProgressPercent === 100 && metrics.totalTasks > 0 ? "done" : "accent"}
        />

        <MetricItem
          label="Conceitos dominados"
          value={`${metrics.conceptProgressPercent}%`}
          detail={`${metrics.masteredConcepts}/${metrics.totalConcepts} temas`}
          progress={metrics.conceptProgressPercent}
          tone="done"
        />

        <div className="flex flex-col gap-space-xs min-w-0">
          <div className="flex items-baseline justify-between gap-space-sm">
            <span className="text-xs text-text-muted truncate">
              Bloqueios por conceito
            </span>
            {metrics.blockedTasks > 0 && (
              <button
                type="button"
                onClick={onJumpToBlockers}
                className="text-xs text-accent-primary hover:text-accent-primary-hover font-medium shrink-0 cursor-pointer"
              >
                Ver mapa
              </button>
            )}
          </div>
          <div className="flex items-baseline gap-space-sm">
            <span
              className={`text-lg font-semibold tracking-tight font-mono tabular-nums ${
                metrics.blockedTasks > 0
                  ? "text-status-blocked"
                  : "text-status-done"
              }`}
            >
              {metrics.blockedTasks}
            </span>
            <span className="text-xs text-text-secondary truncate">
              {metrics.blockedTasks === 0
                ? "nenhuma tarefa travada"
                : `${metrics.activeBlockingConcepts} ${
                    metrics.activeBlockingConcepts === 1
                      ? "conceito pendente"
                      : "conceitos pendentes"
                  }`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-lg min-w-0">
          <Divider orientation="vertical" className="hidden lg:block h-10" />
          <div className="flex flex-col gap-space-xs min-w-0">
            <span className="text-xs text-text-muted truncate">
              Prontas para executar
            </span>
            <div className="flex items-baseline gap-space-sm">
              <span className="text-lg font-semibold tracking-tight font-mono tabular-nums text-text-primary">
                {metrics.readyTasks + metrics.inProgressTasks}
              </span>
              <span className="text-xs text-text-secondary truncate">
                {metrics.inProgressTasks} em andamento
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
