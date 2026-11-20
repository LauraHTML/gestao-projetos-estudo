"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Divider,
  Icon,
  Input,
  Select,
  Textarea,
} from "@/components/atoms";
import { MASTERY_LABELS } from "@/lib/studySelectors";
import type {
  ConceptLinkType,
  ConceptNote,
  EnrichedTask,
  Milestone,
  StudyTask,
  TaskStatus,
} from "@/types/study";

export interface TaskDetailDrawerProps {
  task: EnrichedTask | null;
  milestones: Milestone[];
  concepts: ConceptNote[];
  onClose: () => void;
  onUpdateTask: (
    taskId: string,
    patch: Partial<Omit<StudyTask, "id" | "createdAt">>
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onLinkConcept: (
    taskId: string,
    conceptId: string,
    type: ConceptLinkType
  ) => void;
  onUnlinkConcept: (taskId: string, conceptId: string) => void;
  onQuickCreateConcept: (
    title: string,
    type: ConceptLinkType,
    taskId: string
  ) => void;
  onOpenConcept: (conceptId: string) => void;
}

export function TaskDetailDrawer({
  task,
  milestones,
  concepts,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onLinkConcept,
  onUnlinkConcept,
  onQuickCreateConcept,
  onOpenConcept,
}: TaskDetailDrawerProps) {
  const [selectedConceptId, setSelectedConceptId] = useState("");
  const [selectedLinkType, setSelectedLinkType] =
    useState<ConceptLinkType>("bloqueante");
  const [newConceptTitle, setNewConceptTitle] = useState("");

  useEffect(() => {
    if (!task) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [task, onClose]);

  if (!task) return null;

  const linkedConceptIds = new Set(task.conceptLinks.map((l) => l.conceptId));
  const availableConcepts = concepts.filter(
    (c) => !linkedConceptIds.has(c.id)
  );
  const conceptMap = new Map(concepts.map((c) => [c.id, c]));

  const handleAttachExisting = () => {
    if (!selectedConceptId) return;
    onLinkConcept(task.id, selectedConceptId, selectedLinkType);
    setSelectedConceptId("");
  };

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConceptTitle.trim()) return;
    onQuickCreateConcept(newConceptTitle.trim(), selectedLinkType, task.id);
    setNewConceptTitle("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-surface-overlay backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes da tarefa ${task.title}`}
        className="relative z-10 w-full max-w-[var(--layout-drawer-width)] h-full bg-surface-sidebar border-l border-border-default flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-space-md px-space-lg h-14 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-space-sm">
            <Icon
              name={task.isBlocked ? "locked" : "roadmap"}
              size="sm"
              tone={task.isBlocked ? "blocked" : "accent"}
            />
            <span className="text-sm font-semibold text-text-primary">
              Detalhes da tarefa
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel"
            className="p-1.5 rounded-token-sm text-text-muted hover:text-text-primary hover:bg-surface-hover cursor-pointer"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-lg">
          {task.isBlocked && (
            <div className="rounded-token-md bg-status-blocked-soft p-space-md flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-xs font-medium text-status-blocked">
                <Icon name="warning" size="xs" />
                <span>Tarefa bloqueada por pré-requisito de estudo</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Domine{" "}
                <strong className="text-text-primary font-medium">
                  {task.blockingConcepts.map((c) => c.title).join(", ")}
                </strong>{" "}
                para desbloquear esta atividade no roadmap.
              </p>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-space-xs">
            <label
              htmlFor="drawer-task-title"
              className="text-xs font-medium text-text-secondary"
            >
              Título
            </label>
            <Input
              id="drawer-task-title"
              value={task.title}
              onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
            />
          </div>

          {/* Milestone + Status */}
          <div className="grid grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <label
                htmlFor="drawer-task-milestone"
                className="text-xs font-medium text-text-secondary"
              >
                Fase / Milestone
              </label>
              <Select
                id="drawer-task-milestone"
                value={task.milestoneId}
                onChange={(e) =>
                  onUpdateTask(task.id, { milestoneId: e.target.value })
                }
              >
                {milestones.map((ms) => (
                  <option key={ms.id} value={ms.id}>
                    {ms.title}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-space-xs">
              <label
                htmlFor="drawer-task-status"
                className="text-xs font-medium text-text-secondary"
              >
                Estado
              </label>
              <Select
                id="drawer-task-status"
                value={task.status}
                onChange={(e) =>
                  onUpdateTask(task.id, {
                    status: e.target.value as TaskStatus,
                  })
                }
              >
                <option value="pendente">Pronta / Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-space-xs">
            <label
              htmlFor="drawer-task-desc"
              className="text-xs font-medium text-text-secondary"
            >
              Escopo técnico e critérios de pronto
            </label>
            <Textarea
              id="drawer-task-desc"
              rows={4}
              value={task.description}
              onChange={(e) =>
                onUpdateTask(task.id, { description: e.target.value })
              }
              placeholder="Descreva o que precisa ser construído ou testado..."
            />
          </div>

          <Divider />

          {/* Linked Concepts */}
          <div className="flex flex-col gap-space-md">
            <div className="flex flex-col gap-space-2xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Conceitos ligados ({task.conceptLinks.length})
              </h3>
              <p className="text-xs text-text-secondary">
                Marque como <strong className="text-text-primary">Bloqueante</strong>{" "}
                quando você precisa estudar o tema antes de executar esta tarefa.
              </p>
            </div>

            {task.conceptLinks.length > 0 && (
              <div className="flex flex-col gap-space-xs">
                {task.conceptLinks.map((link) => {
                  const concept = conceptMap.get(link.conceptId);
                  if (!concept) return null;
                  const blockingNow =
                    link.type === "bloqueante" &&
                    concept.mastery !== "dominado";

                  return (
                    <div
                      key={link.conceptId}
                      className="p-space-sm rounded-token-md bg-surface-card border border-border-subtle flex flex-col gap-space-xs"
                    >
                      <div className="flex items-start justify-between gap-space-sm">
                        <button
                          type="button"
                          onClick={() => {
                            onOpenConcept(concept.id);
                            onClose();
                          }}
                          className="text-left group cursor-pointer min-w-0"
                        >
                          <p className="text-xs font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                            {concept.title}
                          </p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            Domínio: {MASTERY_LABELS[concept.mastery]}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onUnlinkConcept(task.id, link.conceptId)
                          }
                          aria-label={`Remover vínculo com ${concept.title}`}
                          className="p-1 text-text-muted hover:text-status-blocked cursor-pointer"
                        >
                          <Icon name="close" size="xs" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-space-sm">
                        <Badge
                          tone={
                            blockingNow
                              ? "blocked"
                              : link.type === "bloqueante"
                                ? "done"
                                : "neutral"
                          }
                        >
                          {blockingNow
                            ? "Bloqueando agora"
                            : link.type === "bloqueante"
                              ? "Pré-requisito dominado"
                              : "Referência de apoio"}
                        </Badge>
                        <button
                          type="button"
                          onClick={() =>
                            onLinkConcept(
                              task.id,
                              link.conceptId,
                              link.type === "bloqueante"
                                ? "referencia"
                                : "bloqueante"
                            )
                          }
                          className="text-[11px] text-accent-primary hover:underline cursor-pointer"
                        >
                          Mudar para{" "}
                          {link.type === "bloqueante"
                            ? "Referência"
                            : "Bloqueante"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Attach existing concept */}
            {availableConcepts.length > 0 && (
              <div className="flex flex-col gap-space-xs">
                <span className="text-xs text-text-secondary">
                  Ligar conceito existente
                </span>
                <div className="flex gap-space-xs">
                  <Select
                    aria-label="Escolher conceito existente"
                    value={selectedConceptId}
                    onChange={(e) => setSelectedConceptId(e.target.value)}
                    className="flex-1"
                  >
                    <option value="">Selecionar conceito...</option>
                    {availableConcepts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({MASTERY_LABELS[c.mastery]})
                      </option>
                    ))}
                  </Select>
                  <Select
                    aria-label="Tipo de dependência"
                    value={selectedLinkType}
                    onChange={(e) =>
                      setSelectedLinkType(e.target.value as ConceptLinkType)
                    }
                    className="w-32"
                  >
                    <option value="bloqueante">Bloqueante</option>
                    <option value="referencia">Referência</option>
                  </Select>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAttachExisting}
                  disabled={!selectedConceptId}
                >
                  <Icon name="link" size="xs" />
                  <span>Vincular conceito</span>
                </Button>
              </div>
            )}

            {/* Quick-create new concept and link immediately */}
            <form
              onSubmit={handleQuickCreate}
              className="flex flex-col gap-space-xs pt-space-xs border-t border-border-subtle"
            >
              <span className="text-xs text-text-secondary">
                Ou criar novo conceito já ligado a esta tarefa
              </span>
              <div className="flex gap-space-xs">
                <Input
                  value={newConceptTitle}
                  onChange={(e) => setNewConceptTitle(e.target.value)}
                  placeholder="Ex: Checksum CRC32"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  disabled={!newConceptTitle.trim()}
                >
                  Criar
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-space-lg py-space-md border-t border-border-subtle flex items-center justify-between gap-space-sm shrink-0">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onDeleteTask(task.id);
              onClose();
            }}
          >
            <Icon name="delete" size="xs" />
            <span>Excluir tarefa</span>
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Concluir edição
          </Button>
        </div>
      </aside>
    </div>
  );
}
