import type { SelectHTMLAttributes } from "react";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...rest }: SelectProps) {
  return (
    <select
      className={`w-full h-9 px-space-md text-sm text-text-primary bg-surface-recessed border border-border-default rounded-token-md transition-colors duration-150 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 cursor-pointer ${className}`.trim()}
      {...rest}
    >
      {children}
    </select>
  );
}
