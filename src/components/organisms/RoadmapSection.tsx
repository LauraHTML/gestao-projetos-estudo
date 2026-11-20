"use client";

import { useMemo, useState } from "react";
import { Button, Icon, Input } from "@/components/atoms";
import {
  EmptyState,
  MilestoneHeader,
  SearchInput,
  SegmentedControl,
  TaskRow,
} from "@/components/molecules";
import { getMilestoneProgress } from "@/lib/studySelectors";
import type { EnrichedTask, Milestone, TaskStatus } from "@/types/study";

type TaskFilter =
  | "todas"
  | "bloqueada"
  | "em_andamento"
  | "pendente"
  | "concluida";

export interface RoadmapSectionProps {
  milestones: Milestone[];
  tasks: EnrichedTask[];
  onSetTaskStatus: (taskId: string, status: TaskStatus) => void;
  onSelectTask: (taskId: string) => void;
  onOpenConcept: (conceptId: string) => void;
  onOpenNewTask: (milestoneId?: string) => void;
  onAddMilestone: (title: string, description: string) => void;
}

export function RoadmapSection({
  milestones,
  tasks,
  onSetTaskStatus,
  onSelectTask,
  onOpenConcept,
  onOpenNewTask,
  onAddMilestone,
}: RoadmapSectionProps) {
  const [filter, setFilter] = useState<TaskFilter>("todas");
  const [search, setSearch] = useState("");
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});
  const [blockerNoticeTask, setBlockerNoticeTask] =
    useState<EnrichedTask | null>(null);
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [msTitle, setMsTitle] = useState("");
  const [msDescription, setMsDescription] = useState("");

  const counts = useMemo(
    () => ({
      todas: tasks.length,
      bloqueada: tasks.filter((t) => t.effectiveState === "bloqueada").length,
      em_andamento: tasks.filter((t) => t.effectiveState === "em_andamento")
        .length,
      pendente: tasks.filter((t) => t.effectiveState === "pendente").length,
      concluida: tasks.filter((t) => t.effectiveState === "concluida").length,
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (filter !== "todas" && task.effectiveState !== filter) return false;
      if (!query) return true;
      const inTitle = task.title.toLowerCase().includes(query);
      const inDesc = task.description.toLowerCase().includes(query);
      const inConcepts = [
        ...task.blockingConcepts,
        ...task.resolvedPrerequisites,
        ...task.referenceConcepts,
      ].some((c) => c.title.toLowerCase().includes(query));
      return inTitle || inDesc || inConcepts;
    });
  }, [tasks, filter, search]);

  const handleToggleComplete = (task: EnrichedTask) => {
    if (task.status === "concluida") {
      onSetTaskStatus(task.id, "pendente");
      setBlockerNoticeTask(null);
      return;
    }

    if (task.isBlocked) {
      setBlockerNoticeTask(task);
      return;
    }

    onSetTaskStatus(task.id, "concluida");
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle.trim()) return;
    onAddMilestone(msTitle, msDescription);
    setMsTitle("");
    setMsDescription("");
    setAddingMilestone(false);
  };

  const sortedMilestones = useMemo(
    () => [...milestones].sort((a, b) => a.order - b.order),
    [milestones]
  );

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <SegmentedControl<TaskFilter>
          ariaLabel="Filtrar tarefas por estado"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "todas", label: "Todas", count: counts.todas },
            { value: "bloqueada", label: "Bloqueadas", count: counts.bloqueada },
            {
              value: "em_andamento",
              label: "Em andamento",
              count: counts.em_andamento,
            },
            { value: "pendente", label: "Prontas", count: counts.pendente },
            { value: "concluida", label: "Concluídas", count: counts.concluida },
          ]}
        />

        <div className="flex items-center gap-space-sm flex-wrap sm:flex-nowrap">
          <SearchInput
            id="roadmap-search"
            value={search}
            onChange={setSearch}
            placeholder="Filtrar tarefas ou conceitos..."
            className="w-full sm:w-64"
          />
          <Button
            variant="secondary"
            size="md"
            onClick={() => setAddingMilestone((prev) => !prev)}
          >
            <Icon name="milestone" size="sm" />
            <span>Nova fase</span>
          </Button>
        </div>
      </div>

      {/* Inline Blocker Guard Notice */}
      {blockerNoticeTask && (
        <div
          role="alert"
          className="surface-card rounded-token-lg px-space-lg py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-md"
        >
          <div className="flex items-start gap-space-sm min-w-0">
            <Icon name="locked" size="sm" tone="blocked" className="mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="text-text-primary font-medium">
                A tarefa &ldquo;{blockerNoticeTask.title}&rdquo; tem pré-requisitos
                ainda não dominados:
              </p>
              <p className="text-text-secondary mt-0.5">
                {blockerNoticeTask.blockingConcepts
                  .map((c) => c.title)
                  .join(", ")}
                . Marque o conceito como dominado após estudar para desbloquear
                automaticamente.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            {blockerNoticeTask.blockingConcepts[0] && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onOpenConcept(blockerNoticeTask.blockingConcepts[0].id);
                  setBlockerNoticeTask(null);
                }}
              >
                <Icon name="concepts" size="xs" />
                <span>Estudar conceito</span>
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                onSetTaskStatus(blockerNoticeTask.id, "concluida");
                setBlockerNoticeTask(null);
              }}
            >
              Concluir mesmo assim
            </Button>
            <button
              type="button"
              onClick={() => setBlockerNoticeTask(null)}
              aria-label="Dispensar aviso"
              className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
            >
              <Icon name="close" size="xs" />
            </button>
          </div>
        </div>
      )}

      {/* Inline New Milestone Form */}
      {addingMilestone && (
        <form
          onSubmit={handleCreateMilestone}
          className="surface-panel rounded-token-lg p-space-lg flex flex-col gap-space-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text-primary">
              Adicionar nova fase ao roadmap
            </span>
            <button
              type="button"
              onClick={() => setAddingMilestone(false)}
              className="text-text-muted hover:text-text-primary cursor-pointer"
            >
              <Icon name="close" size="sm" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <Input
              value={msTitle}
              onChange={(e) => setMsTitle(e.target.value)}
              placeholder="Ex: Fase 4 — Benchmarks e Profiling"
              required
              autoFocus
            />
            <Input
              value={msDescription}
              onChange={(e) => setMsDescription(e.target.value)}
              placeholder="Objetivo resumido desta fase..."
            />
          </div>
          <div className="flex justify-end gap-space-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAddingMilestone(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Criar fase
            </Button>
          </div>
        </form>
      )}

      {/* Milestones List */}
      {tasks.length === 0 ? (
        <EmptyState
          icon="roadmap"
          title="Nenhuma tarefa cadastrada neste projeto"
          description="Comece quebrando seu projeto de estudo em tarefas práticas e ligue cada uma aos conceitos que precisa aprender."
          actionLabel="Criar primeira tarefa"
          onAction={() => onOpenNewTask(sortedMilestones[0]?.id)}
        />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon="search"
          title="Nenhuma tarefa encontrada com esse filtro"
          description="Tente limpar a busca ou trocar o filtro de estado para visualizar o roadmap completo."
          actionLabel="Mostrar todas as tarefas"
          onAction={() => {
            setFilter("todas");
            setSearch("");
          }}
        />
      ) : (
        <div className="flex flex-col gap-space-lg">
          {sortedMilestones.map((milestone) => {
            const allMilestoneStats = getMilestoneProgress(milestone, tasks);
            const visibleTasks = filteredTasks.filter(
              (t) => t.milestoneId === milestone.id
            );
            const isFiltering = filter !== "todas" || search.trim().length > 0;
            if (isFiltering && visibleTasks.length === 0) return null;

            const collapsed = Boolean(collapsedIds[milestone.id]);

            return (
              <section
                key={milestone.id}
                aria-label={milestone.title}
                className="surface-card rounded-token-lg overflow-hidden"
              >
                <MilestoneHeader
                  title={milestone.title}
                  description={milestone.description}
                  completed={allMilestoneStats.completed}
                  total={allMilestoneStats.total}
                  blocked={allMilestoneStats.blocked}
                  percent={allMilestoneStats.percent}
                  collapsed={collapsed}
                  onToggleCollapse={() =>
                    setCollapsedIds((prev) => ({
                      ...prev,
                      [milestone.id]: !prev[milestone.id],
                    }))
                  }
                  onAddTask={() => onOpenNewTask(milestone.id)}
                />

                {!collapsed && (
                  <div>
                    {visibleTasks.length === 0 ? (
                      <div className="px-space-lg py-space-xl text-center text-xs text-text-muted">
                        Nenhuma tarefa nesta fase ainda.{" "}
                        <button
                          type="button"
                          onClick={() => onOpenNewTask(milestone.id)}
                          className="text-accent-primary hover:underline cursor-pointer"
                        >
                          Adicionar tarefa
                        </button>
                      </div>
                    ) : (
                      visibleTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onSelectTask={onSelectTask}
                          onOpenConcept={onOpenConcept}
                        />
                      ))
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
