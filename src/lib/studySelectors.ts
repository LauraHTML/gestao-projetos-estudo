import type {
  ConceptImpact,
  ConceptNote,
  EnrichedTask,
  MasteryStatus,
  Milestone,
  ProjectMetrics,
  StudyProject,
  StudyTask,
} from "@/types/study";

export const MASTERY_LABELS: Record<MasteryStatus, string> = {
  nao_iniciado: "Não iniciado",
  estudando: "Estudando",
  dominado: "Dominado",
};

export const TASK_STATE_LABELS: Record<EnrichedTask["effectiveState"], string> =
  {
    bloqueada: "Bloqueada",
    pendente: "Pronta",
    em_andamento: "Em andamento",
    concluida: "Concluída",
  };

/**
 * Enriches a task with resolved concept links and automatic blocker detection.
 * A task is blocked whenever it is not completed and has at least one linked
 * prerequisite concept ("bloqueante") whose mastery is not "dominado".
 */
export function enrichTask(
  task: StudyTask,
  conceptMap: Map<string, ConceptNote>
): EnrichedTask {
  const blockingConcepts: ConceptNote[] = [];
  const resolvedPrerequisites: ConceptNote[] = [];
  const referenceConcepts: ConceptNote[] = [];

  for (const link of task.conceptLinks) {
    const concept = conceptMap.get(link.conceptId);
    if (!concept) continue;

    if (link.type === "bloqueante") {
      if (concept.mastery === "dominado") {
        resolvedPrerequisites.push(concept);
      } else {
        blockingConcepts.push(concept);
      }
    } else {
      referenceConcepts.push(concept);
    }
  }

  const isBlocked = task.status !== "concluida" && blockingConcepts.length > 0;
  const effectiveState: EnrichedTask["effectiveState"] =
    task.status === "concluida"
      ? "concluida"
      : isBlocked
        ? "bloqueada"
        : task.status;

  return {
    ...task,
    blockingConcepts,
    resolvedPrerequisites,
    referenceConcepts,
    isBlocked,
    effectiveState,
  };
}

export function getEnrichedTasks(project: StudyProject): EnrichedTask[] {
  const conceptMap = new Map(project.concepts.map((c) => [c.id, c]));
  return project.tasks.map((task) => enrichTask(task, conceptMap));
}

export function getMilestoneProgress(
  milestone: Milestone,
  enrichedTasks: EnrichedTask[]
) {
  const tasks = enrichedTasks.filter((t) => t.milestoneId === milestone.id);
  const completed = tasks.filter((t) => t.status === "concluida").length;
  const blocked = tasks.filter((t) => t.isBlocked).length;
  const total = tasks.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { tasks, completed, blocked, total, percent };
}

export function getConceptImpacts(project: StudyProject): ConceptImpact[] {
  const enrichedTasks = getEnrichedTasks(project);

  return project.concepts.map((concept) => {
    const blockedTasks: EnrichedTask[] = [];
    const unlockedTasks: EnrichedTask[] = [];
    const referenceTasks: EnrichedTask[] = [];

    for (const task of enrichedTasks) {
      const link = task.conceptLinks.find((l) => l.conceptId === concept.id);
      if (!link) continue;

      if (link.type === "bloqueante") {
        if (task.status !== "concluida" && concept.mastery !== "dominado") {
          blockedTasks.push(task);
        } else {
          unlockedTasks.push(task);
        }
      } else {
        referenceTasks.push(task);
      }
    }

    return {
      concept,
      blockedTasks,
      unlockedTasks,
      referenceTasks,
    };
  });
}

export function getProjectMetrics(project: StudyProject): ProjectMetrics {
  const enrichedTasks = getEnrichedTasks(project);
  const totalTasks = enrichedTasks.length;
  const completedTasks = enrichedTasks.filter(
    (t) => t.status === "concluida"
  ).length;
  const blockedTasks = enrichedTasks.filter((t) => t.isBlocked).length;
  const inProgressTasks = enrichedTasks.filter(
    (t) => t.effectiveState === "em_andamento"
  ).length;
  const readyTasks = enrichedTasks.filter(
    (t) => t.effectiveState === "pendente"
  ).length;

  const totalConcepts = project.concepts.length;
  const masteredConcepts = project.concepts.filter(
    (c) => c.mastery === "dominado"
  ).length;
  const studyingConcepts = project.concepts.filter(
    (c) => c.mastery === "estudando"
  ).length;

  const activeBlockingConcepts = getConceptImpacts(project).filter(
    (impact) => impact.blockedTasks.length > 0
  ).length;

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    blockedTasks,
    readyTasks,
    taskProgressPercent:
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    totalConcepts,
    masteredConcepts,
    studyingConcepts,
    conceptProgressPercent:
      totalConcepts === 0
        ? 0
        : Math.round((masteredConcepts / totalConcepts) * 100),
    activeBlockingConcepts,
  };
}
