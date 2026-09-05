import type { ReactNode } from "react";

/**
 * Parses a tiny, safe inline markup subset — **bold**, *italic*, [text](url) —
 * into React nodes. Never touches innerHTML, so there's no injection surface;
 * anything that isn't matched renders as plain text.
 */
export function renderInlineMarkup(text: string): ReactNode[] {
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key++}>{match[2]}</em>);
    } else if (match[3] !== undefined && match[4] !== undefined) {
      nodes.push(
        <a
          key={key++}
          href={match[4]}
          className="text-accent underline underline-offset-2 hover:opacity-80"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[3]}
        </a>
      );
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
