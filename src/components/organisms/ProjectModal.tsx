"use client";

import { useState } from "react";
import { Button, Icon, Input, Textarea } from "@/components/atoms";

export interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    area: string;
    theme: string;
    goal: string;
    repoUrl?: string;
    roadmapUrl?: string;
    initialMilestoneTitle?: string;
  }) => void;
}

const AREA_SUGGESTIONS = [
  "Banco de Dados",
  "Back-end",
  "Análise de Dados",
  "Sistemas Distribuídos",
  "Front-end",
  "DevOps",
];

export function ProjectModal({ open, onClose, onSubmit }: ProjectModalProps) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("Back-end");
  const [theme, setTheme] = useState("");
  const [goal, setGoal] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [roadmapUrl, setRoadmapUrl] = useState("");
  const [initialMilestoneTitle, setInitialMilestoneTitle] = useState(
    "Fase 1 — Arquitetura e Fundamentos"
  );

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name,
      area,
      theme: theme || `Projeto prático de ${area}`,
      goal,
      repoUrl,
      roadmapUrl,
      initialMilestoneTitle,
    });
    setName("");
    setTheme("");
    setGoal("");
    setRepoUrl("");
    setRoadmapUrl("");
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
        aria-label="Criar novo projeto de estudo"
        className="relative z-10 w-full max-w-lg surface-panel rounded-token-lg overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-space-xl py-space-lg border-b border-border-subtle">
          <div>
            <h2 className="text-base font-semibold text-text-primary">
              Novo projeto de estudo
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Centralize roadmap, tarefas e anotações de uma nova área.
            </p>
          </div>
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
            <label htmlFor="proj-name" className="text-xs font-medium text-text-secondary">
              Nome do projeto *
            </label>
            <Input
              id="proj-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Simulador de Filas Distribuídas"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-space-xs">
            <label htmlFor="proj-area" className="text-xs font-medium text-text-secondary">
              Área de estudo
            </label>
            <Input
              id="proj-area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Ex: Banco de Dados, Back-end, Análise de Dados"
            />
            <div className="flex flex-wrap gap-space-xs pt-space-2xs">
              {AREA_SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setArea(item)}
                  className={`px-space-sm py-0.5 rounded-token-sm text-[11px] transition-colors cursor-pointer ${
                    area === item
                      ? "bg-accent-primary-soft text-accent-primary"
                      : "bg-surface-hover text-text-muted hover:text-text-primary"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <label htmlFor="proj-theme" className="text-xs font-medium text-text-secondary">
              Tema específico
            </label>
            <Input
              id="proj-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: Protocolos TCP, serialização e backpressure"
            />
          </div>

          <div className="flex flex-col gap-space-xs">
            <label htmlFor="proj-goal" className="text-xs font-medium text-text-secondary">
              Objetivo de aprendizado
            </label>
            <Textarea
              id="proj-goal"
              rows={2}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="O que você quer ser capaz de explicar e implementar ao concluir este projeto?"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <label htmlFor="proj-repo" className="text-xs font-medium text-text-secondary">
                Repositório GitHub (opcional)
              </label>
              <Input
                id="proj-repo"
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="flex flex-col gap-space-xs">
              <label htmlFor="proj-roadmap" className="text-xs font-medium text-text-secondary">
                Link roadmap.sh (opcional)
              </label>
              <Input
                id="proj-roadmap"
                type="url"
                value={roadmapUrl}
                onChange={(e) => setRoadmapUrl(e.target.value)}
                placeholder="https://roadmap.sh/..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <label htmlFor="proj-ms" className="text-xs font-medium text-text-secondary">
              Primeira fase do roadmap
            </label>
            <Input
              id="proj-ms"
              value={initialMilestoneTitle}
              onChange={(e) => setInitialMilestoneTitle(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-space-sm pt-space-sm">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Criar projeto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
