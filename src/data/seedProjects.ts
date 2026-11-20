import type { StudyProject } from "@/types/study";

export const SEED_PROJECTS: StudyProject[] = [
  {
    id: "proj-db-engine",
    name: "Motor de Índices SQL",
    area: "Banco de Dados",
    theme: "Armazenamento em disco, B+Trees e transações ACID",
    goal: "Construir um mini mecanismo de banco de dados chave-valor persistente com índice B+Tree e Write-Ahead Log para dominar como bancos relacionais funcionam por baixo dos panos.",
    repoUrl: "https://github.com/usuario/mini-btree-db",
    roadmapUrl: "https://roadmap.sh/postgresql-dba",
    createdAt: "2026-10-12",
    milestones: [
      {
        id: "ms-db-1",
        title: "Fase 1 — Camada de Paginação",
        description: "Leitura e escrita de páginas fixas de 4KB diretamente em arquivo.",
        order: 1,
      },
      {
        id: "ms-db-2",
        title: "Fase 2 — Estrutura de Índice B+Tree",
        description: "Inserção, busca binária por chave e divisão (split) de nós.",
        order: 2,
      },
      {
        id: "ms-db-3",
        title: "Fase 3 — Durabilidade e Concorrência",
        description: "Garantir recuperação após falhas com WAL e isolamento entre leituras.",
        order: 3,
      },
    ],
    concepts: [
      {
        id: "con-db-pages",
        title: "Páginas de Disco e Slotted Pages",
        category: "Armazenamento",
        mastery: "dominado",
        summary: "Como bancos organizam registros de tamanho variável dentro de blocos fixos de 4KB ou 8KB.",
        content: `## Por que páginas de tamanho fixo?

O sistema operacional e o disco (SSD/NVMe) operam em blocos fixos. Ler ou gravar **páginas de 4KB** reduz fragmentação e permite mapear páginas diretamente no Buffer Pool.

## Estrutura de uma Slotted Page

- **Header**: armazena \`page_id\`, \`lsn\`, número de slots e ponteiro para o espaço livre.
- **Slot Array**: cresce do início para o fim com offsets dos registros.
- **Tuple Data**: cresce do fim da página para o início.

\`\`\`ts
interface PageHeader {
  pageId: number;
  slotCount: number;
  freeSpaceOffset: number;
}
\`\`\`

> Insight chave: atualizar um registro sem mudar o \`slot_id\` evita reescrever ponteiros nos índices secundários.`,
        references: [
          {
            id: "ref-1",
            label: "CMU 15-445 — Database Storage",
            url: "https://15445.courses.cs.cmu.edu/",
          },
        ],
        updatedAt: "2026-11-10",
      },
      {
        id: "con-db-btree",
        title: "Balanceamento e Split em B+Tree",
        category: "Indexação",
        mastery: "estudando",
        summary: "Regras de divisão de nós folha e internos mantendo todas as folhas na mesma profundidade.",
        content: `## Diferença entre B-Tree e B+Tree

Na **B+Tree**, os valores (ou ponteiros para tuplas) vivem **apenas nos nós folha**. Nós internos carregam somente chaves separadoras, aumentando o *fan-out* e diminuindo a altura da árvore.

## Algoritmo de Split (nó folha cheio)

1. Inserir a nova chave em ordem no buffer temporário.
2. Dividir ao meio: metade esquerda fica no nó atual, metade direita vai para um novo nó folha.
3. Atualizar o ponteiro \`nextLeaf\` para manter varreduras por intervalo (*range scans*) em O(N).
4. Promover a **primeira chave do novo nó** para o nó pai.

\`\`\`text
Antes:  [10, 20, 30, 40] (capacidade 3 -> overflow)
Depois: Pai recebe [30]
        Folha A: [10, 20] -> Folha B: [30, 40]
\`\`\`

### Dúvida aberta para testar no código
- Como propagar o split recursivamente quando a própria raiz enche e a altura cresce em +1?`,
        references: [
          {
            id: "ref-2",
            label: "Use The Index, Luke — B-Tree Anatomy",
            url: "https://use-the-index-luke.com/sql/anatomy/the-tree",
          },
        ],
        updatedAt: "2026-11-17",
      },
      {
        id: "con-db-wal",
        title: "Write-Ahead Logging (WAL) e Crash Recovery",
        category: "Durabilidade",
        mastery: "nao_iniciado",
        summary: "Gravar mutações sequencialmente em log append-only antes de modificar as páginas de dados.",
        content: `## Ideia central do WAL

Antes de qualquer página suja (*dirty page*) ser gravada no arquivo principal, o registro da operação precisa estar persistido em disco com \`fsync\` no arquivo de log.

- Escrita sequencial no log é ordens de magnitude mais rápida que escrita aleatória em páginas da B+Tree.
- Na inicialização após queda, aplicamos *REDO* para transações confirmadas e *UNDO* para incompletas.

### Tópicos para estudar antes de implementar
- Formato binário do registro de log (LSN, TxID, tipo, payload, checksum CRC32)
- Checkpointing para evitar replay infinito no boot`,
        references: [
          {
            id: "ref-3",
            label: "PostgreSQL Docs — Reliability & WAL",
            url: "https://www.postgresql.org/docs/current/wal-intro.html",
          },
        ],
        updatedAt: "2026-11-14",
      },
      {
        id: "con-db-mvcc",
        title: "Isolamento MVCC e Snapshots",
        category: "Concorrência",
        mastery: "nao_iniciado",
        summary: "Permitir que leitores não bloqueiem escritores mantendo múltiplas versões de tuplas.",
        content: `## Conceito a explorar

Em vez de aplicar *locks* exclusivos em leitura, cada transação enxerga um **snapshot consistente** baseado em \`xmin\` e \`xmax\`.

- Estudar fenômenos: *Dirty Read*, *Non-Repeatable Read* e *Phantom Read*.
- Entender como o *Snapshot Isolation* evita bloqueios entre \`SELECT\` e \`UPDATE\`.`,
        references: [],
        updatedAt: "2026-11-12",
      },
    ],
    tasks: [
      {
        id: "task-db-1",
        milestoneId: "ms-db-1",
        title: "Implementar Pager com leitura/escrita de blocos de 4KB",
        description:
          "Criar abstração de arquivo paginado com alocação sequencial de pageId e alinhamento de 4096 bytes.",
        status: "concluida",
        conceptLinks: [{ conceptId: "con-db-pages", type: "bloqueante" }],
        createdAt: "2026-10-14",
      },
      {
        id: "task-db-2",
        milestoneId: "ms-db-1",
        title: "Construir Buffer Pool com política de despejo LRU",
        description:
          "Manter páginas quentes em memória com pin count e marcação de dirty pages.",
        status: "concluida",
        conceptLinks: [{ conceptId: "con-db-pages", type: "referencia" }],
        createdAt: "2026-10-20",
      },
      {
        id: "task-db-3",
        milestoneId: "ms-db-2",
        title: "Serializar nós folha e internos da B+Tree em páginas",
        description:
          "Definir layout binário para chaves ordenadas e ponteiros de filhos cabendo em 4KB.",
        status: "em_andamento",
        conceptLinks: [
          { conceptId: "con-db-pages", type: "bloqueante" },
          { conceptId: "con-db-btree", type: "referencia" },
        ],
        createdAt: "2026-11-02",
      },
      {
        id: "task-db-4",
        milestoneId: "ms-db-2",
        title: "Implementar algoritmo de Split recursivo na inserção",
        description:
          "Dividir folhas cheias, promover chave separadora ao nó pai e criar nova raiz quando necessário.",
        status: "pendente",
        conceptLinks: [{ conceptId: "con-db-btree", type: "bloqueante" }],
        createdAt: "2026-11-05",
      },
      {
        id: "task-db-5",
        milestoneId: "ms-db-2",
        title: "Adicionar suporte a Range Scan entre nós folha",
        description:
          "Percorrer ponteiros nextLeaf para retornar intervalos ordenados (ex: BETWEEN 100 AND 500).",
        status: "pendente",
        conceptLinks: [{ conceptId: "con-db-btree", type: "bloqueante" }],
        createdAt: "2026-11-07",
      },
      {
        id: "task-db-6",
        milestoneId: "ms-db-3",
        title: "Gravar log append-only (WAL) com checksum CRC32",
        description:
          "Registrar operações de inserção/remoção no log antes de aplicar nas páginas em memória.",
        status: "pendente",
        conceptLinks: [{ conceptId: "con-db-wal", type: "bloqueante" }],
        createdAt: "2026-11-11",
      },
      {
        id: "task-db-7",
        milestoneId: "ms-db-3",
        title: "Implementar rotina de Crash Recovery na inicialização",
        description:
          "Reexecutar registros válidos do WAL após fechamento abrupto e validar integridade dos índices.",
        status: "pendente",
        conceptLinks: [
          { conceptId: "con-db-wal", type: "bloqueante" },
          { conceptId: "con-db-mvcc", type: "referencia" },
        ],
        createdAt: "2026-11-12",
      },
    ],
  },
  {
    id: "proj-backend-queue",
    name: "API de Pagamentos Idempotente",
    area: "Back-end",
    theme: "Resiliência HTTP, filas assíncronas e idempotência",
    goal: "Projetar uma API back-end de cobranças capaz de lidar com retentativas de rede, webhooks duplicados e picos de tráfego sem cobrar o cliente duas vezes.",
    repoUrl: "https://github.com/usuario/idempotent-pay-api",
    roadmapUrl: "https://roadmap.sh/backend",
    createdAt: "2026-11-01",
    milestones: [
      {
        id: "ms-be-1",
        title: "Fase 1 — Contrato HTTP e Idempotência",
        description: "Chaves de idempotência, validação de payload e códigos de status precisos.",
        order: 1,
      },
      {
        id: "ms-be-2",
        title: "Fase 2 — Processamento Assíncrono e Webhooks",
        description: "Outbox pattern, workers com retry exponencial e verificação de assinatura HMAC.",
        order: 2,
      },
    ],
    concepts: [
      {
        id: "con-be-idemp",
        title: "Idempotency Keys e Concorrência de Requisições",
        category: "Arquitetura de APIs",
        mastery: "dominado",
        summary: "Como garantir que repetir o mesmo POST produza exatamente o mesmo efeito colateral.",
        content: `## Padrão Idempotency-Key

O cliente envia um UUID único no header \`Idempotency-Key\`. O servidor armazena o hash do corpo da requisição e o estado de processamento em uma tabela com índice único.

- Se a chave já completou: devolve a **mesma resposta salva**.
- Se ainda está em andamento: responde \`409 Conflict\` ou aguarda lock curto.
- Se o payload mudou com a mesma chave: rejeita com \`422 Unprocessable Entity\`.`,
        references: [
          {
            id: "ref-be-1",
            label: "Stripe Engineering — Designing robust APIs",
            url: "https://stripe.com/blog/idempotency",
          },
        ],
        updatedAt: "2026-11-15",
      },
      {
        id: "con-be-outbox",
        title: "Transactional Outbox Pattern",
        category: "Mensageria",
        mastery: "estudando",
        summary: "Evitar dual-write inconsistente entre banco relacional e broker de mensagens.",
        content: `## O problema do Dual Write

Salvar o pagamento no Postgres e publicar na fila RabbitMQ/Kafka em passos separados pode falhar no meio — deixando o banco atualizado sem evento publicado.

## Solução com Outbox

1. Dentro da **mesma transação SQL**, gravar o registro do pagamento e uma linha na tabela \`outbox_events\`.
2. Um processo *relay* lê eventos pendentes e publica no broker com garantia *at-least-once*.
3. Consumidores precisam ser idempotentes para descartar duplicatas.`,
        references: [],
        updatedAt: "2026-11-18",
      },
    ],
    tasks: [
      {
        id: "task-be-1",
        milestoneId: "ms-be-1",
        title: "Criar middleware de validação de Idempotency-Key",
        description:
          "Interceptar POST /charges, validar chave única e retornar resposta cacheada em retries.",
        status: "concluida",
        conceptLinks: [{ conceptId: "con-be-idemp", type: "bloqueante" }],
        createdAt: "2026-11-03",
      },
      {
        id: "task-be-2",
        milestoneId: "ms-be-1",
        title: "Escrever testes de carga para requisições concorrentes duplicadas",
        description:
          "Disparar 20 POSTs simultâneos com a mesma chave e confirmar apenas uma cobrança gravada.",
        status: "em_andamento",
        conceptLinks: [{ conceptId: "con-be-idemp", type: "referencia" }],
        createdAt: "2026-11-08",
      },
      {
        id: "task-be-3",
        milestoneId: "ms-be-2",
        title: "Implementar tabela outbox_events e worker relay",
        description:
          "Publicar eventos de pagamento confirmado de forma confiável sem perda em quedas.",
        status: "pendente",
        conceptLinks: [{ conceptId: "con-be-outbox", type: "bloqueante" }],
        createdAt: "2026-11-14",
      },
    ],
  },
  {
    id: "proj-data-etl",
    name: "Pipeline de Retenção SaaS",
    area: "Análise de Dados",
    theme: "Modelagem dimensional, cohort analysis e SQL analítico",
    goal: "Construir um pipeline analítico reproduzível para calcular retenção por safra (cohort), churn mensal e LTV usando SQL avançado e Python.",
    repoUrl: "https://github.com/usuario/saas-cohort-analytics",
    roadmapUrl: "https://roadmap.sh/data-analyst",
    createdAt: "2026-11-06",
    milestones: [
      {
        id: "ms-da-1",
        title: "Fase 1 — Modelagem Estrela e Limpeza",
        description: "Normalizar eventos brutos em tabelas fato e dimensão limpas.",
        order: 1,
      },
      {
        id: "ms-da-2",
        title: "Fase 2 — Métricas de Cohort e Retenção",
        description: "Calcular retenção M0..M6 via Window Functions e validar contra casos extremos.",
        order: 2,
      },
    ],
    concepts: [
      {
        id: "con-da-window",
        title: "SQL Window Functions (LAG, LEAD e PARTITION BY)",
        category: "SQL Analítico",
        mastery: "estudando",
        summary: "Computar métricas acumuladas e comparações entre períodos sem colapsar linhas.",
        content: `## Quando usar Window Functions

Diferente de \`GROUP BY\`, funções de janela mantêm a granularidade da linha enquanto agregam sobre uma partição ordenada.

\`\`\`sql
SELECT
  user_id,
  cohort_month,
  COUNT(*) OVER (PARTITION BY cohort_month) AS cohort_size
FROM monthly_activity;
\`\`\``,
        references: [],
        updatedAt: "2026-11-16",
      },
    ],
    tasks: [
      {
        id: "task-da-1",
        milestoneId: "ms-da-1",
        title: "Criar script de higienização de eventos duplicados",
        description:
          "Remover eventos de billing repetidos e padronizar fusos horários para UTC.",
        status: "concluida",
        conceptLinks: [],
        createdAt: "2026-11-07",
      },
      {
        id: "task-da-2",
        milestoneId: "ms-da-2",
        title: "Escrever consulta SQL de matriz de retenção por safra",
        description:
          "Gerar percentual de retenção mês a mês agrupado pelo mês de entrada do cliente.",
        status: "pendente",
        conceptLinks: [{ conceptId: "con-da-window", type: "bloqueante" }],
        createdAt: "2026-11-12",
      },
    ],
  },
];
