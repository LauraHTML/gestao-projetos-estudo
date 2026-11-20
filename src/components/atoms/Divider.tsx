export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({
  orientation = "horizontal",
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px self-stretch bg-border-subtle shrink-0 ${className}`.trim()}
      />
    );
  }

  return (
    <hr
      className={`border-0 h-px w-full bg-border-subtle ${className}`.trim()}
    />
  );
}
