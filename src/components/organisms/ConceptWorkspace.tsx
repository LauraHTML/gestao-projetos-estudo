"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Divider,
  Icon,
  Input,
  Select,
  Textarea,
} from "@/components/atoms";
import {
  ConceptListItem,
  EmptyState,
  MarkdownPreview,
  SearchInput,
  SegmentedControl,
} from "@/components/molecules";
import { SplitPaneTemplate } from "@/components/templates";
import { TASK_STATE_LABELS } from "@/lib/studySelectors";
import type {
  ConceptImpact,
  ConceptLinkType,
  ConceptNote,
  EnrichedTask,
  MasteryStatus,
} from "@/types/study";

type MasteryFilter = "todos" | MasteryStatus;
type EditorMode = "split" | "edit" | "preview";

export interface ConceptWorkspaceProps {
  impacts: ConceptImpact[];
  tasks: EnrichedTask[];
  selectedConceptId: string | null;
  onSelectConcept: (conceptId: string) => void;
  onOpenNewConcept: () => void;
  onUpdateConcept: (
    conceptId: string,
    patch: Partial<Omit<ConceptNote, "id">>
  ) => void;
  onSetMastery: (conceptId: string, mastery: MasteryStatus) => void;
  onDeleteConcept: (conceptId: string) => void;
  onAddReference: (conceptId: string, label: string, url: string) => void;
  onRemoveReference: (conceptId: string, refId: string) => void;
  onLinkTask: (
    taskId: string,
    conceptId: string,
    type: ConceptLinkType
  ) => void;
  onUnlinkTask: (taskId: string, conceptId: string) => void;
  onSelectTask: (taskId: string) => void;
}

export function ConceptWorkspace({
  impacts,
  tasks,
  selectedConceptId,
  onSelectConcept,
  onOpenNewConcept,
  onUpdateConcept,
  onSetMastery,
  onDeleteConcept,
  onAddReference,
  onRemoveReference,
  onLinkTask,
  onUnlinkTask,
  onSelectTask,
}: ConceptWorkspaceProps) {
  const [search, setSearch] = useState("");
  const [masteryFilter, setMasteryFilter] = useState<MasteryFilter>("todos");
  const [editorMode, setEditorMode] = useState<EditorMode>("split");
  const [linkTaskId, setLinkTaskId] = useState("");
  const [linkType, setLinkType] = useState<ConceptLinkType>("bloqueante");
  const [refLabel, setRefLabel] = useState("");
  const [refUrl, setRefUrl] = useState("");

  const filteredImpacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return impacts.filter(({ concept }) => {
      if (masteryFilter !== "todos" && concept.mastery !== masteryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        concept.title.toLowerCase().includes(q) ||
        concept.category.toLowerCase().includes(q) ||
        concept.summary.toLowerCase().includes(q)
      );
    });
  }, [impacts, search, masteryFilter]);

  const activeImpact =
    impacts.find((i) => i.concept.id === selectedConceptId) ??
    filteredImpacts[0] ??
    impacts[0] ??
    null;

  const activeConcept = activeImpact?.concept ?? null;

  const linkedTaskEntries = useMemo(() => {
    if (!activeConcept) return [];
    return tasks
      .map((task) => {
        const link = task.conceptLinks.find(
          (l) => l.conceptId === activeConcept.id
        );
        return link ? { task, type: link.type } : null;
      })
      .filter(
        (
          entry
        ): entry is { task: EnrichedTask; type: ConceptLinkType } =>
          entry !== null
      );
  }, [tasks, activeConcept]);

  const unlinkedTasks = useMemo(() => {
    if (!activeConcept) return [];
    const linkedIds = new Set(linkedTaskEntries.map((e) => e.task.id));
    return tasks.filter((t) => !linkedIds.has(t.id));
  }, [tasks, linkedTaskEntries, activeConcept]);

  if (impacts.length === 0) {
    return (
      <EmptyState
        icon="concepts"
        title="Seu caderno de conceitos está vazio"
        description="Registre os temas que está estudando (ex: B+Tree, Índices, Outbox Pattern) e conecte-os às tarefas do roadmap."
        actionLabel="Criar primeiro conceito"
        onAction={onOpenNewConcept}
      />
    );
  }

  const handleLinkTask = () => {
    if (!activeConcept || !linkTaskId) return;
    onLinkTask(linkTaskId, activeConcept.id, linkType);
    setLinkTaskId("");
  };

  const handleAddRef = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConcept || !refLabel.trim() || !refUrl.trim()) return;
    onAddReference(activeConcept.id, refLabel, refUrl);
    setRefLabel("");
    setRefUrl("");
  };

  const listPane = (
    <div className="surface-panel rounded-token-lg p-space-md flex flex-col gap-space-md">
      <div className="flex items-center justify-between gap-space-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Temas de estudo ({impacts.length})
        </span>
        <Button variant="ghost" size="sm" onClick={onOpenNewConcept}>
          <Icon name="add" size="xs" />
          <span>Novo</span>
        </Button>
      </div>

      <SearchInput
        id="concept-search"
        value={search}
        onChange={setSearch}
        placeholder="Buscar conceito..."
      />

      <Select
        aria-label="Filtrar conceitos por domínio"
        value={masteryFilter}
        onChange={(e) => setMasteryFilter(e.target.value as MasteryFilter)}
      >
        <option value="todos">Todos os níveis</option>
        <option value="estudando">Estudando</option>
        <option value="nao_iniciado">Não iniciado</option>
        <option value="dominado">Dominado</option>
      </Select>

      <div className="flex flex-col gap-space-xs max-h-[560px] overflow-y-auto pr-0.5">
        {filteredImpacts.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-space-xl">
            Nenhum conceito encontrado.
          </p>
        ) : (
          filteredImpacts.map((impact) => (
            <ConceptListItem
              key={impact.concept.id}
              impact={impact}
              selected={activeConcept?.id === impact.concept.id}
              onSelect={() => onSelectConcept(impact.concept.id)}
            />
          ))
        )}
      </div>
    </div>
  );

  const detailPane = activeConcept && activeImpact ? (
    <div className="surface-panel rounded-token-lg overflow-hidden flex flex-col">
      {/* Concept Top Bar */}
      <div className="p-space-lg sm:p-space-xl border-b border-border-subtle flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
          <div className="flex-1 min-w-0 flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm flex-wrap">
              <Input
                aria-label="Categoria do conceito"
                value={activeConcept.category}
                onChange={(e) =>
                  onUpdateConcept(activeConcept.id, {
                    category: e.target.value,
                  })
                }
                placeholder="Categoria"
                className="w-44 h-7 text-xs"
              />
              <span className="text-xs text-text-muted font-mono">
                Atualizado em {activeConcept.updatedAt}
              </span>
            </div>

            <input
              aria-label="Título do conceito"
              value={activeConcept.title}
              onChange={(e) =>
                onUpdateConcept(activeConcept.id, { title: e.target.value })
              }
              className="text-xl font-semibold tracking-tight text-text-primary bg-transparent border-0 focus:outline-none focus:ring-0 p-0 w-full"
            />

            <input
              aria-label="Resumo do conceito"
              value={activeConcept.summary}
              onChange={(e) =>
                onUpdateConcept(activeConcept.id, { summary: e.target.value })
              }
              placeholder="Resumo curto do conceito..."
              className="text-sm text-text-secondary placeholder:text-text-muted bg-transparent border-0 focus:outline-none focus:ring-0 p-0 w-full"
            />
          </div>

          <div className="flex items-center gap-space-sm shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteConcept(activeConcept.id)}
              aria-label="Excluir conceito"
              title="Excluir conceito"
            >
              <Icon name="delete" size="sm" tone="muted" />
            </Button>
          </div>
        </div>

        {/* Mastery Control & Live Blocker Impact Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pt-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="text-xs text-text-muted">Domínio atual:</span>
            <SegmentedControl<MasteryStatus>
              ariaLabel="Nível de domínio do conceito"
              value={activeConcept.mastery}
              onChange={(val) => onSetMastery(activeConcept.id, val)}
              options={[
                { value: "nao_iniciado", label: "Não iniciado" },
                { value: "estudando", label: "Estudando" },
                { value: "dominado", label: "Dominado" },
              ]}
            />
          </div>

          <SegmentedControl<EditorMode>
            ariaLabel="Modo de exibição das anotações"
            value={editorMode}
            onChange={setEditorMode}
            options={[
              { value: "split", label: "Dividido" },
              { value: "edit", label: "Escrever" },
              { value: "preview", label: "Leitura" },
            ]}
          />
        </div>

        {activeImpact.blockedTasks.length > 0 && (
          <div className="rounded-token-md bg-status-blocked-soft px-space-md py-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm text-xs text-status-blocked">
              <Icon name="locked" size="sm" />
              <span>
                Este conceito está bloqueando{" "}
                <strong className="font-semibold">
                  {activeImpact.blockedTasks.length}{" "}
                  {activeImpact.blockedTasks.length === 1
                    ? "tarefa"
                    : "tarefas"}
                </strong>{" "}
                no roadmap.
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSetMastery(activeConcept.id, "dominado")}
            >
              <Icon name="unlocked" size="xs" tone="done" />
              <span>Dominar e desbloquear</span>
            </Button>
          </div>
        )}
      </div>

      {/* Markdown Study Editor / Preview */}
      <div className="p-space-lg sm:p-space-xl border-b border-border-subtle">
        <div
          className={`grid gap-space-lg ${
            editorMode === "split"
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {(editorMode === "edit" || editorMode === "split") && (
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Anotações em Markdown</span>
                <span className="font-mono text-[11px]">
                  ## título · `código` · - lista
                </span>
              </div>
              <Textarea
                id="concept-markdown-editor"
                value={activeConcept.content}
                onChange={(e) =>
                  onUpdateConcept(activeConcept.id, { content: e.target.value })
                }
                rows={16}
                placeholder="Anote aqui o que você aprendeu, exemplos de código, trade-offs e dúvidas abertas..."
                className="font-mono text-[13px] min-h-[340px]"
              />
            </div>
          )}

          {(editorMode === "preview" || editorMode === "split") && (
            <div className="flex flex-col gap-space-xs">
              <span className="text-xs text-text-muted">
                Pré-visualização do caderno
              </span>
              <div className="surface-recessed rounded-token-md p-space-lg min-h-[340px] max-h-[520px] overflow-y-auto">
                <MarkdownPreview content={activeConcept.content} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Linked Tasks + External References */}
      <div className="p-space-lg sm:p-space-xl grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
        {/* Bidirectional Task Linking */}
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-space-xs">
              <Icon name="link" size="sm" tone="accent" />
              <span>Tarefas ligadas ({linkedTaskEntries.length})</span>
            </h3>
          </div>

          {linkedTaskEntries.length === 0 ? (
            <p className="text-xs text-text-muted">
              Nenhuma tarefa ligada a este conceito ainda. Vincule abaixo para
              rastrear dependências.
            </p>
          ) : (
            <div className="flex flex-col gap-space-xs">
              {linkedTaskEntries.map(({ task, type }) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-space-sm px-space-md py-space-sm rounded-token-md bg-surface-recessed border border-border-subtle"
                >
                  <button
                    type="button"
                    onClick={() => onSelectTask(task.id)}
                    className="text-left min-w-0 flex-1 cursor-pointer group"
                  >
                    <p className="text-xs font-medium text-text-primary group-hover:text-accent-primary transition-colors truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-space-xs mt-1">
                      <Badge
                        tone={
                          type === "bloqueante"
                            ? activeConcept.mastery === "dominado"
                              ? "done"
                              : "blocked"
                            : "neutral"
                        }
                      >
                        {type === "bloqueante"
                          ? activeConcept.mastery === "dominado"
                            ? "Pré-requisito cumprido"
                            : "Pré-requisito bloqueante"
                          : "Referência"}
                      </Badge>
                      <span className="text-[11px] text-text-muted">
                        {TASK_STATE_LABELS[task.effectiveState]}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUnlinkTask(task.id, activeConcept.id)}
                    aria-label={`Desvincular tarefa ${task.title}`}
                    className="p-1 rounded-token-sm text-text-muted hover:text-status-blocked hover:bg-surface-hover cursor-pointer"
                  >
                    <Icon name="close" size="xs" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {unlinkedTasks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-space-xs pt-space-xs">
              <Select
                aria-label="Selecionar tarefa para ligar"
                value={linkTaskId}
                onChange={(e) => setLinkTaskId(e.target.value)}
                className="flex-1"
              >
                <option value="">Ligar a uma tarefa...</option>
                {unlinkedTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </Select>
              <Select
                aria-label="Tipo de vínculo"
                value={linkType}
                onChange={(e) =>
                  setLinkType(e.target.value as ConceptLinkType)
                }
                className="sm:w-40"
              >
                <option value="bloqueante">Bloqueante</option>
                <option value="referencia">Referência</option>
              </Select>
              <Button
                variant="secondary"
                size="md"
                onClick={handleLinkTask}
                disabled={!linkTaskId}
              >
                Ligar
              </Button>
            </div>
          )}
        </div>

        {/* External References */}
        <div className="flex flex-col gap-space-md lg:border-l lg:border-border-subtle lg:pl-space-xl">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-space-xs">
            <Icon name="external" size="sm" tone="accent" />
            <span>Referências externas ({activeConcept.references.length})</span>
          </h3>

          {activeConcept.references.length === 0 ? (
            <p className="text-xs text-text-muted">
              Adicione links para documentação, artigos, roadmap.sh ou commits
              no GitHub.
            </p>
          ) : (
            <div className="flex flex-col gap-space-xs">
              {activeConcept.references.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between gap-space-sm px-space-md py-space-sm rounded-token-md bg-surface-recessed border border-border-subtle"
                >
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-accent-primary hover:underline truncate flex items-center gap-space-xs"
                  >
                    <span className="truncate">{ref.label}</span>
                    <Icon name="external" size="xs" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onRemoveReference(activeConcept.id, ref.id)}
                    aria-label={`Remover referência ${ref.label}`}
                    className="p-1 text-text-muted hover:text-status-blocked cursor-pointer"
                  >
                    <Icon name="close" size="xs" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Divider />

          <form onSubmit={handleAddRef} className="flex flex-col gap-space-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
              <Input
                value={refLabel}
                onChange={(e) => setRefLabel(e.target.value)}
                placeholder="Título (ex: Docs PostgreSQL)"
              />
              <Input
                type="url"
                value={refUrl}
                onChange={(e) => setRefUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={!refLabel.trim() || !refUrl.trim()}
              >
                <Icon name="add" size="xs" />
                <span>Adicionar link</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;

  return <SplitPaneTemplate listPane={listPane} detailPane={detailPane} />;
}
