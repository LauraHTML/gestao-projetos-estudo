"use client";

import { useState } from "react";
import { Button, Icon, Input, Select, Textarea } from "@/components/atoms";
import type { MasteryStatus } from "@/types/study";

export interface ConceptModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: string;
    summary: string;
    mastery: MasteryStatus;
  }) => void;
}

export function ConceptModal({ open, onClose, onSubmit }: ConceptModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Fundamentos");
  const [summary, setSummary] = useState("");
  const [mastery, setMastery] = useState<MasteryStatus>("estudando");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, category, summary, mastery });
    setTitle("");
    setCategory("Fundamentos");
    setSummary("");
    setMastery("estudando");
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
        aria-label="Criar novo conceito de estudo"
        className="relative z-10 w-full max-w-md surface-panel rounded-token-lg overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-space-xl py-space-lg border-b border-border-subtle">
          <h2 className="text-base font-semibold text-text-primary">
            Novo conceito de estudo
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
            <label htmlFor="new-concept-title" className="text-xs font-medium text-text-secondary">
              Nome do conceito / tema *
            </label>
            <Input
              id="new-concept-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Isolamento Serializable vs Snapshot"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <label htmlFor="new-concept-cat" className="text-xs font-medium text-text-secondary">
                Categoria
              </label>
              <Input
                id="new-concept-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Concorrência"
              />
            </div>

            <div className="flex flex-col gap-space-xs">
              <label htmlFor="new-concept-mastery" className="text-xs font-medium text-text-secondary">
                Domínio inicial
              </label>
              <Select
                id="new-concept-mastery"
                value={mastery}
                onChange={(e) => setMastery(e.target.value as MasteryStatus)}
              >
                <option value="nao_iniciado">Não iniciado</option>
                <option value="estudando">Estudando</option>
                <option value="dominado">Dominado</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <label htmlFor="new-concept-summary" className="text-xs font-medium text-text-secondary">
              Resumo curto
            </label>
            <Textarea
              id="new-concept-summary"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Por que esse conceito importa para o projeto?"
            />
          </div>

          <div className="flex justify-end gap-space-sm pt-space-sm">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Criar e abrir caderno
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
