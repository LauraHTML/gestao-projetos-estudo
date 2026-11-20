import type { ReactNode } from "react";

export interface MarkdownPreviewProps {
  content: string;
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-token-sm bg-surface-recessed border border-border-subtle font-mono text-[0.84em] text-accent-steel"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-text-primary/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  if (!content.trim()) {
    return (
      <p className="text-sm text-text-muted italic">
        Nenhuma anotação escrita ainda. Clique em Editar para registrar o que
        você está aprendendo.
      </p>
    );
  }

  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <div
          key={`code-${i}`}
          className="my-space-md rounded-token-md bg-surface-recessed border border-border-subtle overflow-hidden"
        >
          {lang && (
            <div className="px-space-md py-1 border-b border-border-subtle text-[11px] font-mono text-text-muted uppercase tracking-wider">
              {lang}
            </div>
          )}
          <pre className="p-space-md overflow-x-auto text-xs font-mono leading-relaxed text-text-primary/95">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push(
        <h4
          key={`h3-${i}`}
          className="text-sm font-semibold text-text-primary mt-space-lg mb-space-xs tracking-tight"
        >
          {renderInline(line.slice(4))}
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h3
          key={`h2-${i}`}
          className="text-base font-semibold text-text-primary mt-space-xl first:mt-0 mb-space-sm tracking-tight pb-space-xs border-b border-border-subtle"
        >
          {renderInline(line.slice(3))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(
        <h2
          key={`h1-${i}`}
          className="text-lg font-semibold text-text-primary mt-space-xl first:mt-0 mb-space-sm tracking-tight"
        >
          {renderInline(line.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={`quote-${i}`}
          className="my-space-md pl-space-md border-l-2 border-accent-primary text-sm text-text-secondary italic leading-relaxed"
        >
          {renderInline(line.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul
          key={`ul-${i}`}
          className="my-space-sm space-y-1.5 pl-space-lg list-disc text-sm text-text-secondary leading-relaxed marker:text-text-muted"
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol
          key={`ol-${i}`}
          className="my-space-sm space-y-1.5 pl-space-lg list-decimal text-sm text-text-secondary leading-relaxed marker:text-text-muted"
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph
    blocks.push(
      <p
        key={`p-${i}`}
        className="my-space-sm text-sm text-text-secondary leading-relaxed"
      >
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="max-w-none">{blocks}</div>;
}
