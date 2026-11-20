import { Icon, Input } from "@/components/atoms";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  id,
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`.trim()}>
      <Icon
        name="search"
        size="sm"
        tone="muted"
        className="absolute left-3 pointer-events-none"
      />
      <Input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="absolute right-2.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <Icon name="close" size="xs" />
        </button>
      )}
    </div>
  );
}
