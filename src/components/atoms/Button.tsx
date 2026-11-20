import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-primary text-text-inverse font-medium hover:bg-accent-primary-hover active:translate-y-[0.5px]",
  secondary:
    "bg-surface-card text-text-primary border border-border-default hover:bg-surface-hover hover:border-border-strong",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary",
  danger:
    "bg-status-blocked-soft text-status-blocked border border-border-default hover:bg-status-blocked/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-space-md text-xs gap-space-xs rounded-token-sm",
  md: "h-9 px-space-lg text-sm gap-space-sm rounded-token-md",
  lg: "h-10 px-space-xl text-sm gap-space-sm rounded-token-md",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  type = "button",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60 disabled:opacity-45 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
