import { Icon } from "./Icon";

export interface CheckboxProps {
  checked: boolean;
  blocked?: boolean;
  onChange: () => void;
  ariaLabel: string;
  id?: string;
}

export function Checkbox({
  checked,
  blocked = false,
  onChange,
  ariaLabel,
  id,
}: CheckboxProps) {
  const baseStyle = checked
    ? "bg-status-done border-status-done text-text-inverse"
    : blocked
      ? "bg-status-blocked-soft border-border-strong text-status-blocked hover:bg-status-blocked/20"
      : "bg-surface-recessed border-border-strong text-transparent hover:border-accent-primary";

  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={`w-5 h-5 rounded-token-sm border flex items-center justify-center shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60 cursor-pointer ${baseStyle}`}
    >
      {checked ? (
        <Icon name="check" size="xs" stroke="bold" />
      ) : blocked ? (
        <Icon name="locked" size="xs" />
      ) : null}
    </button>
  );
}
