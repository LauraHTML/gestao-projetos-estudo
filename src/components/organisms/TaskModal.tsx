"use client";

import { useState } from "react";
import { Button, Icon, Input, Select, Textarea } from "@/components/atoms";
import { MASTERY_LABELS } from "@/lib/studySelectors";
import type { ConceptLinkType, ConceptNote, Milestone } from "@/types/study";

export interface TaskModalProps {
  open: boolean;
  defaultMilestoneId?: string;
  milestones: Milestone[];
  concepts: ConceptNote[];
  onClose: () => void;
  onSubmit: (data: {
    milestoneId: string;
    title: string;
    description: string;
    conceptLinks: { conceptId: string; type: ConceptLinkType }[];
  }) => void;
}

function TaskModalForm({
  defaultMilestoneId,
  milestones,
  concepts,
  onClose,
  onSubmit,
}: Omit<TaskModalProps, "open">) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [milestoneId, setMilestoneId] = useState(
    defaultMilestoneId ?? milestones[0]?.id ?? ""
  );
  const [conceptLinks, setConceptLinks] = useState<
    { conceptId: string; type: ConceptLinkType }[]
  >([]);

  const toggleConcept = (conceptId: string) => {
    setConceptLinks((prev) => {
      const exists = prev.some((l) => l.conceptId === conceptId);
      if (exists) return prev.filter((l) => l.conceptId !== conceptId);
      return [...prev, { conceptId, type: "bloqueante" }];
    });
  };

  const toggleLinkType = (conceptId: string) => {
    setConceptLinks((prev) =>
      prev.map((l) =>
        l.conceptId === conceptId
          ? {
              ...l,
              type: l.type === "bloqueante" ? "referencia" : "bloqueante",
            }
          : l
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !milestoneId) return;
    onSubmit({ milestoneId, title, description, conceptLinks });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-space-lg">
      <div
        className="fixed inset-0 bg-surface-overlay backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Criar nova tarefa"
        className="relative z-10 w-full max-w-lg surface-panel rounded-token-lg overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-space-xl py-space-lg border-b border-border-subtle">
          <h2 className="text-base font-semibold text-text-primary">
            Nova tarefa no roadmap
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1 text-text-muted hover:text-text-primary cursor-pointer"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-space-xl flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <label htmlFor="new-task-title" className="text-xs font-medium text-text-secondary">
              Título da tarefa *
            </label>
            <Input
              id="new-task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Implementar compactação de segmentos do WAL"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-space-xs">
            <label htmlFor="new-task-ms" className="text-xs font-medium text-text-secondary">
              Fase / Milestone
            </label>
            <Select
              id="new-task-ms"
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
            >
              {milestones.map((ms) => (
                <option key={ms.id} value={ms.id}>
                  {ms.title}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-space-xs">
            <label htmlFor="new-task-desc" className="text-xs font-medium text-text-secondary">
              Descrição prática
            </label>
            <Textarea
              id="new-task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes de implementação, testes ou entregas..."
            />
          </div>

          {concepts.length > 0 && (
            <div className="flex flex-col gap-space-xs">
              <span className="text-xs font-medium text-text-secondary">
                Ligar conceitos do projeto (opcional)
              </span>
              <div className="max-h-40 overflow-y-auto flex flex-col gap-space-xs pr-0.5">
                {concepts.map((concept) => {
                  const link = conceptLinks.find(
                    (l) => l.conceptId === concept.id
                  );
                  const selected = Boolean(link);
                  return (
                    <div
                      key={concept.id}
                      className={`flex items-center justify-between gap-space-sm px-space-md py-space-sm rounded-token-md border text-xs transition-colors ${
                        selected
                          ? "bg-surface-card border-border-strong"
                          : "bg-surface-recessed border-border-subtle"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleConcept(concept.id)}
                        className="flex items-center gap-space-sm text-left min-w-0 flex-1 cursor-pointer"
                      >
                        <Icon
                          name={selected ? "done" : "idle"}
                          size="xs"
                          tone={selected ? "accent" : "muted"}
                        />
                        <span className="truncate text-text-primary">
                          {concept.title}
                        </span>
                        <span className="text-text-muted shrink-0">
                          ({MASTERY_LABELS[concept.mastery]})
                        </span>
                      </button>

                      {link && (
                        <button
                          type="button"
                          onClick={() => toggleLinkType(concept.id)}
                          className={`px-space-sm py-0.5 rounded-token-sm text-[11px] font-medium shrink-0 cursor-pointer ${
                            link.type === "bloqueante"
                              ? "bg-status-blocked-soft text-status-blocked"
                              : "bg-surface-hover text-text-secondary"
                          }`}
                        >
                          {link.type === "bloqueante"
                            ? "Bloqueante"
                            : "Referência"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-space-sm pt-space-sm">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Adicionar tarefa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TaskModal({ open, ...rest }: TaskModalProps) {
  if (!open) return null;
  return (
    <TaskModalForm
      key={rest.defaultMilestoneId ?? rest.milestones[0]?.id ?? "task-modal"}
      {...rest}
    />
  );
}
