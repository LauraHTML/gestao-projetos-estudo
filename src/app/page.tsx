"use client";

import { useMemo, useState } from "react";
import {
  BlockerMatrix,
  ConceptModal,
  ConceptWorkspace,
  ProjectHeader,
  ProjectModal,
  RoadmapSection,
  Sidebar,
  TaskDetailDrawer,
  TaskModal,
} from "@/components/organisms";
import { WorkspaceTemplate } from "@/components/templates";
import { useStudyStore } from "@/hooks/useStudyStore";
import {
  getConceptImpacts,
  getEnrichedTasks,
  getProjectMetrics,
} from "@/lib/studySelectors";
import type { WorkspaceView } from "@/types/study";

export default function StudyWorkspacePage() {
  const store = useStudyStore();
  const [activeView, setActiveView] = useState<WorkspaceView>("roadmap");
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalMilestoneId, setTaskModalMilestoneId] = useState<
    string | undefined
  >(undefined);
  const [conceptModalOpen, setConceptModalOpen] = useState(false);

  const project = store.activeProject;

  const enrichedTasks = useMemo(() => getEnrichedTasks(project), [project]);
  const conceptImpacts = useMemo(() => getConceptImpacts(project), [project]);
  const metrics = useMemo(() => getProjectMetrics(project), [project]);

  const selectedTask = useMemo(
    () => enrichedTasks.find((t) => t.id === selectedTaskId) ?? null,
    [enrichedTasks, selectedTaskId]
  );

  const handleOpenConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setActiveView("concepts");
  };

  const handleSelectProject = (projectId: string) => {
    store.setActiveProjectId(projectId);
    setSelectedTaskId(null);
    setSelectedConceptId(null);
  };

  const handleOpenNewTask = (milestoneId?: string) => {
    setTaskModalMilestoneId(milestoneId);
    setTaskModalOpen(true);
  };

  return (
    <>
      <WorkspaceTemplate
        projectTitle={project.name}
        mobileNavOpen={mobileNavOpen}
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
        onCloseMobileNav={() => setMobileNavOpen(false)}
        sidebar={
          <Sidebar
            projects={store.projects}
            activeProjectId={project.id}
            activeView={activeView}
            blockedTasksCount={metrics.blockedTasks}
            totalTasksCount={metrics.totalTasks}
            totalConceptsCount={metrics.totalConcepts}
            onSelectProject={handleSelectProject}
            onSelectView={setActiveView}
            onOpenNewProject={() => setProjectModalOpen(true)}
            onResetDemo={() => {
              store.resetDemoData();
              setSelectedTaskId(null);
              setSelectedConceptId(null);
            }}
            onCloseMobile={() => setMobileNavOpen(false)}
          />
        }
        header={
          <ProjectHeader
            project={project}
            metrics={metrics}
            onOpenNewTask={() => handleOpenNewTask(project.milestones[0]?.id)}
            onOpenNewConcept={() => setConceptModalOpen(true)}
            onJumpToBlockers={() => setActiveView("blockers")}
          />
        }
        drawer={
          <TaskDetailDrawer
            task={selectedTask}
            milestones={project.milestones}
            concepts={project.concepts}
            onClose={() => setSelectedTaskId(null)}
            onUpdateTask={store.updateTask}
            onDeleteTask={store.deleteTask}
            onLinkConcept={store.linkConceptToTask}
            onUnlinkConcept={store.unlinkConceptFromTask}
            onQuickCreateConcept={(title, type, taskId) => {
              const created = store.addConcept({
                title,
                category: project.area,
                summary: "",
                mastery: "nao_iniciado",
              });
              store.linkConceptToTask(taskId, created.id, type);
            }}
            onOpenConcept={handleOpenConcept}
          />
        }
      >
        {activeView === "roadmap" && (
          <RoadmapSection
            milestones={project.milestones}
            tasks={enrichedTasks}
            onSetTaskStatus={store.setTaskStatus}
            onSelectTask={setSelectedTaskId}
            onOpenConcept={handleOpenConcept}
            onOpenNewTask={handleOpenNewTask}
            onAddMilestone={store.addMilestone}
          />
        )}

        {activeView === "concepts" && (
          <ConceptWorkspace
            impacts={conceptImpacts}
            tasks={enrichedTasks}
            selectedConceptId={selectedConceptId}
            onSelectConcept={setSelectedConceptId}
            onOpenNewConcept={() => setConceptModalOpen(true)}
            onUpdateConcept={store.updateConcept}
            onSetMastery={store.setConceptMastery}
            onDeleteConcept={(id) => {
              store.deleteConcept(id);
              if (selectedConceptId === id) {
                setSelectedConceptId(null);
              }
            }}
            onAddReference={store.addConceptReference}
            onRemoveReference={store.removeConceptReference}
            onLinkTask={store.linkConceptToTask}
            onUnlinkTask={store.unlinkConceptFromTask}
            onSelectTask={setSelectedTaskId}
          />
        )}

        {activeView === "blockers" && (
          <BlockerMatrix
            impacts={conceptImpacts}
            onOpenConcept={handleOpenConcept}
            onSelectTask={setSelectedTaskId}
            onSetConceptMastery={store.setConceptMastery}
          />
        )}
      </WorkspaceTemplate>

      {/* Modals */}
      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={(data) => {
          store.createProject(data);
          setActiveView("roadmap");
          setSelectedConceptId(null);
          setSelectedTaskId(null);
        }}
      />

      <TaskModal
        open={taskModalOpen}
        defaultMilestoneId={taskModalMilestoneId}
        milestones={project.milestones}
        concepts={project.concepts}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={(data) => {
          store.addTask(data);
        }}
      />

      <ConceptModal
        open={conceptModalOpen}
        onClose={() => setConceptModalOpen(false)}
        onSubmit={(data) => {
          const created = store.addConcept(data);
          setSelectedConceptId(created.id);
          setActiveView("concepts");
        }}
      />
    </>
  );
}
