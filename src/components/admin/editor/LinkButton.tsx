"use client";

import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { searchArticlesForLinking } from "@/lib/actions/admin-articles";

function buttonClass(active: boolean) {
  return `focus-ring border px-2.5 py-1.5 text-sm font-semibold ${
    active
      ? "border-accent text-accent"
      : "border-charcoal text-gray-secondary-light hover:border-accent hover:text-accent"
  }`;
}

/** "Link" toolbar button. Opens a small popover to either search this
 * writer's own published articles by title (the common case — linking a
 * related story) or paste any external URL. Applies the link to the
 * current text selection, or inserts the article's title as new linked
 * text if nothing is selected. */
export function LinkButton({ editor, articleId }: { editor: Editor; articleId?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [results, setResults] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open || !query.trim()) return;
    const handle = setTimeout(async () => {
      setLoading(true);
      const rows = await searchArticlesForLinking(query, articleId);
      setResults(rows);
      setLoading(false);
    }, 250);
    return () => clearTimeout(handle);
  }, [query, open, articleId]);

  function applyLink(href: string, linkText?: string) {
    const chain = editor.chain().focus();
    if (editor.state.selection.empty && linkText) {
      chain.insertContent({ type: "text", text: linkText, marks: [{ type: "link", attrs: { href } }] }).run();
    } else {
      chain.extendMarkRange("link").setLink({ href }).run();
    }
    setOpen(false);
    setQuery("");
    setExternalUrl("");
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setOpen((v) => !v);
          setQuery("");
          setResults([]);
        }}
        className={buttonClass(editor.isActive("link") || open)}
        aria-label="Link"
      >
        Link
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-80 border border-white/10 bg-charcoal-deep p-3 text-sm shadow-lg">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-muted">
            Link to one of your articles
          </p>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value.trim()) setResults([]);
            }}
            placeholder="Search by title..."
            autoFocus
            className="focus-ring w-full border border-white/10 bg-black px-3 py-1.5 text-offwhite focus:border-accent"
          />
          {loading && <p className="mt-2 text-gray-muted">Searching...</p>}
          {!loading && results.length > 0 && (
            <ul className="mt-2 max-h-48 overflow-y-auto">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => applyLink(`/article/${r.slug}`, r.title)}
                    className="block w-full px-2 py-1.5 text-left text-offwhite hover:bg-white/10"
                  >
                    {r.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!loading && query.trim() && results.length === 0 && (
            <p className="mt-2 text-gray-muted">No matching published articles.</p>
          )}

          <div className="my-3 h-px bg-charcoal" />

          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-muted">
            Or paste an external URL
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://..."
              className="focus-ring w-full border border-white/10 bg-black px-3 py-1.5 text-offwhite focus:border-accent"
            />
            <button
              type="button"
              disabled={!externalUrl.trim()}
              onClick={() => applyLink(externalUrl.trim())}
              className="shrink-0 border border-charcoal px-3 py-1.5 font-semibold text-offwhite hover:border-accent hover:text-accent disabled:opacity-40"
            >
              Add
            </button>
          </div>

          {editor.isActive("link") && (
            <button
              type="button"
              onClick={removeLink}
              className="mt-3 text-xs font-semibold text-gray-muted underline hover:text-accent"
            >
              Remove existing link
            </button>
          )}
        </div>
      )}
    </div>
  );
}
