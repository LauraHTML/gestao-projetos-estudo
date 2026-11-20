import type { ReactNode } from "react";

export interface SplitPaneTemplateProps {
  listPane: ReactNode;
  detailPane: ReactNode;
}

export function SplitPaneTemplate({
  listPane,
  detailPane,
}: SplitPaneTemplateProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[var(--layout-concept-list-width)_minmax(0,1fr)] gap-space-xl items-start">
      <section aria-label="Lista de conceitos" className="min-w-0">
        {listPane}
      </section>
      <section aria-label="Espaço de anotações do conceito" className="min-w-0">
        {detailPane}
      </section>
    </div>
  );
}
