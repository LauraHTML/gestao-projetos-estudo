export type MasteryStatus = "nao_iniciado" | "estudando" | "dominado";

export type TaskStatus = "pendente" | "em_andamento" | "concluida";

export type ConceptLinkType = "bloqueante" | "referencia";

export type WorkspaceView = "roadmap" | "concepts" | "blockers";

export interface ConceptReference {
  id: string;
  label: string;
  url: string;
}

export interface ConceptNote {
  id: string;
  title: string;
  category: string;
  mastery: MasteryStatus;
  summary: string;
  content: string;
  references: ConceptReference[];
  updatedAt: string;
}

export interface TaskConceptLink {
  conceptId: string;
  type: ConceptLinkType;
}

export interface StudyTask {
  id: string;
  milestoneId: string;
  title: string;
  description: string;
  status: TaskStatus;
  conceptLinks: TaskConceptLink[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface StudyProject {
  id: string;
  name: string;
  area: string;
  theme: string;
  goal: string;
  repoUrl?: string;
  roadmapUrl?: string;
  milestones: Milestone[];
  tasks: StudyTask[];
  concepts: ConceptNote[];
  createdAt: string;
}

export interface EnrichedTask extends StudyTask {
  blockingConcepts: ConceptNote[];
  resolvedPrerequisites: ConceptNote[];
  referenceConcepts: ConceptNote[];
  isBlocked: boolean;
  effectiveState: "bloqueada" | "pendente" | "em_andamento" | "concluida";
}

export interface ConceptImpact {
  concept: ConceptNote;
  blockedTasks: EnrichedTask[];
  unlockedTasks: EnrichedTask[];
  referenceTasks: EnrichedTask[];
}

export interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  readyTasks: number;
  taskProgressPercent: number;
  totalConcepts: number;
  masteredConcepts: number;
  studyingConcepts: number;
  conceptProgressPercent: number;
  activeBlockingConcepts: number;
}
