import type { TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      className={`w-full px-space-md py-space-sm text-sm leading-relaxed text-text-primary placeholder:text-text-muted bg-surface-recessed border border-border-default rounded-token-md transition-colors duration-150 focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 resize-y ${className}`.trim()}
      {...rest}
    />
  );
}
