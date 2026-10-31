import type { ReactNode } from "react";
import Link from "next/link";
import type { ArticleSource } from "./types";

/** Quiet in-body source link — readable, not loud. */
const SOURCE_LINK_CLASS =
  "text-accent/65 no-underline decoration-accent/40 underline-offset-[3px] transition-colors hover:text-accent hover:underline";

/** Manual markdown links stay slightly clearer than auto source links. */
const MARKUP_LINK_CLASS =
  "text-accent/75 no-underline decoration-accent/45 underline-offset-[3px] transition-colors hover:text-accent hover:underline";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Build case-insensitive matchers for source publication / author names that have URLs. */
function buildSourceMatchers(
  sources: ArticleSource[] | undefined
): { pattern: RegExp; url: string; label: string }[] {
  if (!sources?.length) return [];

  const seen = new Set<string>();
  const entries: { label: string; url: string }[] = [];

  for (const source of sources) {
    const url = source.url?.trim();
    if (!url || (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/"))) {
      continue;
    }

    for (const raw of [source.publication, source.author]) {
      const label = raw?.trim();
      if (!label || label.length < 3) continue;
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ label, url });
    }
  }

  // Longer names first so "World Health Organization" wins over shorter fragments.
  entries.sort((a, b) => b.label.length - a.label.length);

  return entries.map(({ label, url }) => ({
    label,
    url,
    pattern: new RegExp(`\\b${escapeRegExp(label)}\\b`, "gi"),
  }));
}

function linkSourceMentionsInPlainText(
  text: string,
  matchers: { pattern: RegExp; url: string; label: string }[],
  keyStart: number
): { nodes: ReactNode[]; nextKey: number } {
  if (!text || matchers.length === 0) {
    return { nodes: text ? [text] : [], nextKey: keyStart };
  }

  type Hit = { start: number; end: number; url: string; matched: string };
  const hits: Hit[] = [];

  for (const { pattern, url } of matchers) {
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      // Skip if this span overlaps an earlier (usually longer) match.
      if (hits.some((h) => start < h.end && end > h.start)) continue;
      hits.push({ start, end, url, matched: m[0] });
    }
  }

  if (hits.length === 0) {
    return { nodes: [text], nextKey: keyStart };
  }

  hits.sort((a, b) => a.start - b.start);

  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = keyStart;

  for (const hit of hits) {
    if (hit.start > cursor) {
      nodes.push(text.slice(cursor, hit.start));
    }
    const isInternal = hit.url.startsWith("/");
    nodes.push(
      isInternal ? (
        <Link key={key++} href={hit.url} className={SOURCE_LINK_CLASS}>
          {hit.matched}
        </Link>
      ) : (
        <a
          key={key++}
          href={hit.url}
          className={SOURCE_LINK_CLASS}
          target="_blank"
          rel="noopener noreferrer"
        >
          {hit.matched}
        </a>
      )
    );
    cursor = hit.end;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return { nodes, nextKey: key };
}

/**
 * Parses a tiny, safe inline markup subset — **bold**, *italic*, [text](url) —
 * into React nodes. Optionally auto-links source publication/author names from
 * the article's Sources list when they appear in plain text (faded gold).
 * Never touches innerHTML.
 */
export function renderInlineMarkup(
  text: string,
  sources?: ArticleSource[]
): ReactNode[] {
  const matchers = buildSourceMatchers(sources);
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  const pushPlain = (slice: string) => {
    const linked = linkSourceMentionsInPlainText(slice, matchers, key);
    nodes.push(...linked.nodes);
    key = linked.nextKey;
  };

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      pushPlain(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      // Bold content can still contain source names.
      const inner = linkSourceMentionsInPlainText(match[1], matchers, key);
      nodes.push(<strong key={key++}>{inner.nodes}</strong>);
      key = inner.nextKey;
    } else if (match[2] !== undefined) {
      const inner = linkSourceMentionsInPlainText(match[2], matchers, key);
      nodes.push(<em key={key++}>{inner.nodes}</em>);
      key = inner.nextKey;
    } else if (match[3] !== undefined && match[4] !== undefined) {
      const href = match[4];
      const isInternal = href.startsWith("/");
      nodes.push(
        isInternal ? (
          <Link key={key++} href={href} className={MARKUP_LINK_CLASS}>
            {match[3]}
          </Link>
        ) : (
          <a
            key={key++}
            href={href}
            className={MARKUP_LINK_CLASS}
            target="_blank"
            rel="noopener noreferrer"
          >
            {match[3]}
          </a>
        )
      );
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    pushPlain(text.slice(lastIndex));
  }

  return nodes;
}
