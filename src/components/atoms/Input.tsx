import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      className={`w-full h-9 px-space-md text-sm text-text-primary placeholder:text-text-muted bg-surface-recessed border border-border-default rounded-token-md transition-colors duration-150 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 disabled:opacity-50 ${className}`.trim()}
      {...rest}
    />
  );
}
