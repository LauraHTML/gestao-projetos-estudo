import { Icon } from "@/components/atoms";
import type { ConceptNote } from "@/types/study";

export interface ConceptChipProps {
  concept: ConceptNote;
  isBlocking?: boolean;
  isResolvedPrerequisite?: boolean;
  onClick?: () => void;
}

export function ConceptChip({
  concept,
  isBlocking = false,
  isResolvedPrerequisite = false,
  onClick,
}: ConceptChipProps) {
  const styles = isBlocking
    ? "bg-status-blocked-soft text-status-blocked hover:bg-status-blocked/20"
    : isResolvedPrerequisite
      ? "bg-status-done-soft text-status-done hover:bg-status-done/20"
      : "bg-surface-hover text-text-secondary hover:text-text-primary hover:bg-border-default";

  return (
    <button
      type="button"
      onClick={onClick}
      title={
        isBlocking
          ? `Pré-requisito bloqueante (${concept.title}) — clique para estudar`
          : isResolvedPrerequisite
            ? `Pré-requisito dominado (${concept.title}) — clique para revisar`
            : `Conceito de referência (${concept.title}) — clique para abrir anotações`
      }
      className={`inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-token-sm text-xs transition-colors duration-150 cursor-pointer max-w-full ${styles}`}
    >
      <Icon
        name={
          isBlocking ? "locked" : isResolvedPrerequisite ? "unlocked" : "note"
        }
        size="xs"
      />
      <span className="truncate max-w-[200px]">{concept.title}</span>
    </button>
  );
}
