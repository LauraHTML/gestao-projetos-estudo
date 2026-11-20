# Nexo — Gerenciador de Projetos de Estudo

Aplicação web em **Next.js (App Router + TypeScript)** e **Tailwind CSS v4** para centralizar projetos de estudo de programação em um único ambiente escuro: roadmap de tarefas por fases, caderno de conceitos em Markdown e mapa automático de bloqueios de aprendizado.

## Funcionalidades

- **Roadmap por Fases (Milestones)**: organize tarefas por etapas, filtre por estado (*Todas, Bloqueadas, Em andamento, Prontas, Concluídas*), acompanhe o progresso por fase e adicione novas etapas e tarefas.
- **Caderno de Conceitos em Markdown**: escreva anotações técnicas com modos *Dividido*, *Escrever* e *Leitura*, controle o nível de domínio (*Não iniciado, Estudando, Dominado*) e salve referências externas (documentação, `roadmap.sh`, GitHub).
- **Vínculo bidirecional entre Conceitos e Tarefas**: associe conceitos às tarefas como **Pré-requisito bloqueante** ou **Referência de apoio**.
- **Detecção automática e Mapa de Bloqueios**: tarefas ligadas a conceitos pré-requisitos ainda não dominados são sinalizadas automaticamente como bloqueadas. Ao marcar o conceito como *Dominado*, as tarefas dependentes são desbloqueadas imediatamente.
- **Persistência local**: projetos, tarefas e anotações são salvos automaticamente no `localStorage` do navegador (com projetos de exemplo pré-carregados).

## Arquitetura

### Design Tokens (Tailwind CSS v4)
- **Cores** (`src/styles/tokens/colors.css` e `src/tokens/colors.ts`): paleta exclusiva para modo escuro (superfícies carvão profundo, destaque azul aço/ciano e estados semânticos).
- **Espaçamentos e Raios** (`src/styles/tokens/spacing.css` e `src/tokens/spacing.ts`): ritmo base de 4px e dimensões de layout.
- **Ícones** (`src/tokens/icons.ts`): registro centralizado de ícones, tamanhos e espessuras consumidos pelo átomo `Icon`.
- **Integração Tailwind v4** (`src/app/globals.css`): variáveis CSS conectadas via `@theme inline`.

### Atomic Design (`src/components/`)
- `atoms/`: `Icon`, `Button`, `Badge`, `ProgressBar`, `Input`, `Textarea`, `Select`, `Checkbox`, `Divider`
- `molecules/`: `MetricItem`, `SearchInput`, `SegmentedControl`, `ConceptChip`, `MilestoneHeader`, `TaskRow`, `ConceptListItem`, `MarkdownPreview`, `EmptyState`
- `organisms/`: `Sidebar`, `ProjectHeader`, `RoadmapSection`, `ConceptWorkspace`, `BlockerMatrix`, `TaskDetailDrawer`, `ProjectModal`, `TaskModal`, `ConceptModal`
- `templates/`: `WorkspaceTemplate`, `SplitPaneTemplate`

### Domínio e Estado
- `src/types/study.ts`: contratos TypeScript das entidades de estudo.
- `src/lib/studySelectors.ts`: seletores puros para cálculo de bloqueios, impacto de conceitos e métricas de progresso.
- `src/lib/storage.ts` e `src/hooks/useStudyStore.ts`: persistência local sincronizada via `useSyncExternalStore`.

## Como rodar na sua máquina

### Pré-requisitos
- **Node.js 20+** (recomendado Node.js 22 ou 24 LTS)
- **npm**

### Instalação e execução

```bash
git clone https://github.com/LauraHTML/gestao-projetos-estudo.git
cd gestao-projetos-estudo
npm install
npm run dev
```

Depois, abra `http://localhost:3000` no seu navegador.

### Scripts disponíveis
- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run lint`: executa o ESLint
- `npm run build`: gera a build de produção
- `npm start`: inicia a aplicação em modo de produção
