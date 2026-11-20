"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { SEED_PROJECTS } from "@/data/seedProjects";
import {
  clearProjectsStorage,
  loadProjectsFromStorage,
  saveProjectsToStorage,
} from "@/lib/storage";
import type {
  ConceptLinkType,
  ConceptNote,
  MasteryStatus,
  StudyProject,
  StudyTask,
  TaskStatus,
} from "@/types/study";

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * External store backed by localStorage for SSR-safe hydration via useSyncExternalStore.
 */
let cachedProjects: StudyProject[] | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getClientSnapshot(): StudyProject[] {
  if (cachedProjects === null) {
    cachedProjects = loadProjectsFromStorage() ?? SEED_PROJECTS;
  }
  return cachedProjects;
}

function getServerSnapshot(): StudyProject[] {
  return SEED_PROJECTS;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setStoredProjects(
  updater: (prev: StudyProject[]) => StudyProject[]
) {
  const current = getClientSnapshot();
  const next = updater(current);
  cachedProjects = next;
  saveProjectsToStorage(next);
  emitChange();
}

export function useStudyStore() {
  const projects = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) ?? projects[0];
  const activeProjectId = activeProject.id;

  const setActiveProjectId = useCallback((id: string) => {
    setSelectedProjectId(id);
  }, []);

  const updateActiveProject = useCallback(
    (updater: (project: StudyProject) => StudyProject) => {
      setStoredProjects((prev) =>
        prev.map((proj) =>
          proj.id === activeProjectId ? updater(proj) : proj
        )
      );
    },
    [activeProjectId]
  );

  // Project CRUD
  const createProject = useCallback(
    (input: {
      name: string;
      area: string;
      theme: string;
      goal: string;
      repoUrl?: string;
      roadmapUrl?: string;
      initialMilestoneTitle?: string;
    }) => {
      const milestoneId = makeId("ms");
      const newProject: StudyProject = {
        id: makeId("proj"),
        name: input.name.trim(),
        area: input.area.trim() || "Geral",
        theme: input.theme.trim(),
        goal: input.goal.trim(),
        repoUrl: input.repoUrl?.trim() || undefined,
        roadmapUrl: input.roadmapUrl?.trim() || undefined,
        createdAt: todayIso(),
        milestones: [
          {
            id: milestoneId,
            title:
              input.initialMilestoneTitle?.trim() || "Fase 1 — Fundamentos",
            description: "Primeiros passos práticos do projeto de estudo.",
            order: 1,
          },
        ],
        tasks: [],
        concepts: [],
      };
      setStoredProjects((prev) => [...prev, newProject]);
      setSelectedProjectId(newProject.id);
      return newProject;
    },
    []
  );

  const deleteProject = useCallback(
    (projectId: string) => {
      setStoredProjects((prev) => {
        if (prev.length <= 1) return prev;
        return prev.filter((p) => p.id !== projectId);
      });
      if (activeProjectId === projectId) {
        setSelectedProjectId(null);
      }
    },
    [activeProjectId]
  );

  // Milestone CRUD
  const addMilestone = useCallback(
    (title: string, description: string) => {
      updateActiveProject((proj) => ({
        ...proj,
        milestones: [
          ...proj.milestones,
          {
            id: makeId("ms"),
            title: title.trim(),
            description: description.trim(),
            order: proj.milestones.length + 1,
          },
        ],
      }));
    },
    [updateActiveProject]
  );

  // Task CRUD
  const addTask = useCallback(
    (input: {
      milestoneId: string;
      title: string;
      description: string;
      conceptLinks: { conceptId: string; type: ConceptLinkType }[];
    }) => {
      const task: StudyTask = {
        id: makeId("task"),
        milestoneId: input.milestoneId,
        title: input.title.trim(),
        description: input.description.trim(),
        status: "pendente",
        conceptLinks: input.conceptLinks,
        createdAt: todayIso(),
      };
      updateActiveProject((proj) => ({
        ...proj,
        tasks: [...proj.tasks, task],
      }));
      return task;
    },
    [updateActiveProject]
  );

  const updateTask = useCallback(
    (taskId: string, patch: Partial<Omit<StudyTask, "id" | "createdAt">>) => {
      updateActiveProject((proj) => ({
        ...proj,
        tasks: proj.tasks.map((t) =>
          t.id === taskId ? { ...t, ...patch } : t
        ),
      }));
    },
    [updateActiveProject]
  );

  const setTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      updateTask(taskId, { status });
    },
    [updateTask]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      updateActiveProject((proj) => ({
        ...proj,
        tasks: proj.tasks.filter((t) => t.id !== taskId),
      }));
    },
    [updateActiveProject]
  );

  const linkConceptToTask = useCallback(
    (taskId: string, conceptId: string, type: ConceptLinkType) => {
      updateActiveProject((proj) => ({
        ...proj,
        tasks: proj.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const exists = t.conceptLinks.some((l) => l.conceptId === conceptId);
          if (exists) {
            return {
              ...t,
              conceptLinks: t.conceptLinks.map((l) =>
                l.conceptId === conceptId ? { ...l, type } : l
              ),
            };
          }
          return {
            ...t,
            conceptLinks: [...t.conceptLinks, { conceptId, type }],
          };
        }),
      }));
    },
    [updateActiveProject]
  );

  const unlinkConceptFromTask = useCallback(
    (taskId: string, conceptId: string) => {
      updateActiveProject((proj) => ({
        ...proj,
        tasks: proj.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                conceptLinks: t.conceptLinks.filter(
                  (l) => l.conceptId !== conceptId
                ),
              }
            : t
        ),
      }));
    },
    [updateActiveProject]
  );

  // Concept CRUD
  const addConcept = useCallback(
    (input: {
      title: string;
      category: string;
      summary: string;
      mastery?: MasteryStatus;
      content?: string;
    }) => {
      const concept: ConceptNote = {
        id: makeId("con"),
        title: input.title.trim(),
        category: input.category.trim() || "Fundamentos",
        mastery: input.mastery ?? "nao_iniciado",
        summary: input.summary.trim(),
        content:
          input.content?.trim() ||
          `## ${input.title.trim()}\n\nEscreva aqui o que você descobriu ao estudar este conceito, exemplos de código e dúvidas abertas.`,
        references: [],
        updatedAt: todayIso(),
      };
      updateActiveProject((proj) => ({
        ...proj,
        concepts: [concept, ...proj.concepts],
      }));
      return concept;
    },
    [updateActiveProject]
  );

  const updateConcept = useCallback(
    (conceptId: string, patch: Partial<Omit<ConceptNote, "id">>) => {
      updateActiveProject((proj) => ({
        ...proj,
        concepts: proj.concepts.map((c) =>
          c.id === conceptId ? { ...c, ...patch, updatedAt: todayIso() } : c
        ),
      }));
    },
    [updateActiveProject]
  );

  const setConceptMastery = useCallback(
    (conceptId: string, mastery: MasteryStatus) => {
      updateConcept(conceptId, { mastery });
    },
    [updateConcept]
  );

  const deleteConcept = useCallback(
    (conceptId: string) => {
      updateActiveProject((proj) => ({
        ...proj,
        concepts: proj.concepts.filter((c) => c.id !== conceptId),
        tasks: proj.tasks.map((t) => ({
          ...t,
          conceptLinks: t.conceptLinks.filter((l) => l.conceptId !== conceptId),
        })),
      }));
    },
    [updateActiveProject]
  );

  const addConceptReference = useCallback(
    (conceptId: string, label: string, url: string) => {
      updateActiveProject((proj) => ({
        ...proj,
        concepts: proj.concepts.map((c) =>
          c.id === conceptId
            ? {
                ...c,
                references: [
                  ...c.references,
                  { id: makeId("ref"), label: label.trim(), url: url.trim() },
                ],
                updatedAt: todayIso(),
              }
            : c
        ),
      }));
    },
    [updateActiveProject]
  );

  const removeConceptReference = useCallback(
    (conceptId: string, refId: string) => {
      updateActiveProject((proj) => ({
        ...proj,
        concepts: proj.concepts.map((c) =>
          c.id === conceptId
            ? {
                ...c,
                references: c.references.filter((r) => r.id !== refId),
                updatedAt: todayIso(),
              }
            : c
        ),
      }));
    },
    [updateActiveProject]
  );

  const resetDemoData = useCallback(() => {
    clearProjectsStorage();
    cachedProjects = SEED_PROJECTS;
    setSelectedProjectId(SEED_PROJECTS[0].id);
    emitChange();
  }, []);

  return {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    createProject,
    deleteProject,
    addMilestone,
    addTask,
    updateTask,
    setTaskStatus,
    deleteTask,
    linkConceptToTask,
    unlinkConceptFromTask,
    addConcept,
    updateConcept,
    setConceptMastery,
    deleteConcept,
    addConceptReference,
    removeConceptReference,
    resetDemoData,
  };
}
