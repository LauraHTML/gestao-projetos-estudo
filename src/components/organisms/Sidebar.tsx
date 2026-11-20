import { Button, Divider, Icon } from "@/components/atoms";
import { getProjectMetrics } from "@/lib/studySelectors";
import type { StudyProject, WorkspaceView } from "@/types/study";

export interface SidebarProps {
  projects: StudyProject[];
  activeProjectId: string;
  activeView: WorkspaceView;
  blockedTasksCount: number;
  totalTasksCount: number;
  totalConceptsCount: number;
  onSelectProject: (projectId: string) => void;
  onSelectView: (view: WorkspaceView) => void;
  onOpenNewProject: () => void;
  onResetDemo: () => void;
  onCloseMobile?: () => void;
}

export function Sidebar({
  projects,
  activeProjectId,
  activeView,
  blockedTasksCount,
  totalTasksCount,
  totalConceptsCount,
  onSelectProject,
  onSelectView,
  onOpenNewProject,
  onResetDemo,
  onCloseMobile,
}: SidebarProps) {
  const navItems: {
    id: WorkspaceView;
    label: string;
    icon: "roadmap" | "concepts" | "blockers";
    count: number;
    alert?: boolean;
  }[] = [
    {
      id: "roadmap",
      label: "Roadmap de Tarefas",
      icon: "roadmap",
      count: totalTasksCount,
    },
    {
      id: "concepts",
      label: "Caderno de Conceitos",
      icon: "concepts",
      count: totalConceptsCount,
    },
    {
      id: "blockers",
      label: "Mapa de Bloqueios",
      icon: "blockers",
      count: blockedTasksCount,
      alert: blockedTasksCount > 0,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between gap-space-sm px-space-lg h-14 border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="w-7 h-7 rounded-token-md bg-accent-primary-soft border border-border-default flex items-center justify-center shrink-0">
            <Icon name="layers" size="sm" tone="accent" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-text-primary leading-none">
              Nexo
            </p>
            <p className="text-[11px] text-text-muted mt-0.5 truncate">
              Projetos de Estudo
            </p>
          </div>
        </div>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Fechar menu"
            className="lg:hidden p-1 rounded-token-sm text-text-muted hover:text-text-primary hover:bg-surface-hover cursor-pointer"
          >
            <Icon name="close" size="sm" />
          </button>
        )}
      </div>

      {/* Navigation & Projects */}
      <div className="flex-1 overflow-y-auto px-space-md py-space-lg flex flex-col gap-space-xl">
        {/* Workspace Views */}
        <nav aria-label="Visões do projeto" className="flex flex-col gap-space-xs">
          <span className="px-space-sm text-[11px] font-medium uppercase tracking-wider text-text-muted mb-space-2xs">
            Espaço de trabalho
          </span>
          {navItems.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-view-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile?.();
                }}
                className={`flex items-center justify-between gap-space-sm px-space-sm py-space-sm rounded-token-md text-sm transition-colors duration-150 cursor-pointer ${
                  active
                    ? "bg-surface-card text-text-primary font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/60"
                }`}
              >
                <span className="flex items-center gap-space-sm min-w-0">
                  <Icon
                    name={item.icon}
                    size="sm"
                    tone={
                      active
                        ? "accent"
                        : item.alert
                          ? "blocked"
                          : "muted"
                    }
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                <span
                  className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded-token-sm ${
                    item.alert
                      ? "bg-status-blocked-soft text-status-blocked"
                      : active
                        ? "bg-surface-hover text-text-primary"
                        : "text-text-muted"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>

        <Divider />

        {/* Study Projects Switcher */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between px-space-sm mb-space-2xs">
            <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              Meus projetos
            </span>
            <button
              id="btn-sidebar-new-project"
              type="button"
              onClick={() => {
                onOpenNewProject();
                onCloseMobile?.();
              }}
              title="Criar novo projeto de estudo"
              className="p-1 rounded-token-sm text-text-muted hover:text-accent-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Icon name="add" size="xs" />
            </button>
          </div>

          <div className="flex flex-col gap-space-2xs">
            {projects.map((project) => {
              const metrics = getProjectMetrics(project);
              const active = project.id === activeProjectId;
              return (
                <button
                  key={project.id}
                  id={`select-project-${project.id}`}
                  type="button"
                  onClick={() => {
                    onSelectProject(project.id);
                    onCloseMobile?.();
                  }}
                  className={`w-full text-left px-space-sm py-space-sm rounded-token-md border transition-colors duration-150 cursor-pointer flex flex-col gap-space-2xs ${
                    active
                      ? "bg-surface-card border-border-default"
                      : "bg-transparent border-transparent hover:bg-surface-hover/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-space-sm">
                    <span
                      className={`text-sm truncate ${
                        active
                          ? "font-medium text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {project.name}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-text-muted shrink-0">
                      {metrics.taskProgressPercent}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-space-sm text-[11px] text-text-muted">
                    <span className="truncate">{project.area}</span>
                    {metrics.blockedTasks > 0 && (
                      <span className="text-status-blocked flex items-center gap-0.5 shrink-0 font-mono tabular-nums">
                        <Icon name="locked" size="xs" />
                        {metrics.blockedTasks}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onOpenNewProject();
              onCloseMobile?.();
            }}
            className="mt-space-sm w-full"
          >
            <Icon name="add" size="xs" />
            <span>Novo projeto de estudo</span>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-space-md py-space-md border-t border-border-subtle flex items-center justify-between gap-space-sm shrink-0">
        <span className="text-[11px] text-text-muted">
          Salvo localmente
        </span>
        <button
          type="button"
          onClick={onResetDemo}
          title="Restaurar projetos de exemplo"
          className="inline-flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <Icon name="reset" size="xs" />
          <span>Restaurar</span>
        </button>
      </div>
    </div>
  );
}
