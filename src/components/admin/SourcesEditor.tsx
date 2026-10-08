"use client";

import type { ArticleSource } from "@/lib/cms/types";

function fieldClass() {
  return "focus-ring mt-1.5 w-full border border-white/10 bg-charcoal-deep px-3 py-2 text-sm text-offwhite placeholder:text-gray-muted focus:border-accent";
}

function labelClass() {
  return "text-xs font-bold uppercase tracking-wide text-gray-muted";
}

export function SourcesEditor({
  sources,
  onChange,
}: {
  sources: ArticleSource[];
  onChange: (sources: ArticleSource[]) => void;
}) {
  return (
    <div>
      <h2 className="border-b border-charcoal pb-2 font-serif text-lg font-bold text-white">
        Sources & attribution
      </h2>
      <p className="mt-2 text-xs text-gray-muted">
        Optional. Add one or more original sources for this article. They appear in a collapsed
        section on the published page.
      </p>
      <div className="mt-4 space-y-4">
        {sources.map((source, index) => (
          <div key={index} className="border border-charcoal bg-charcoal-deep p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-muted">
                Source {index + 1}
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => {
                    if (index === 0) return;
                    const next = [...sources];
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    onChange(next);
                  }}
                  className="focus-ring text-gray-muted hover:text-offwhite disabled:opacity-30"
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={index === sources.length - 1}
                  onClick={() => {
                    if (index >= sources.length - 1) return;
                    const next = [...sources];
                    [next[index], next[index + 1]] = [next[index + 1], next[index]];
                    onChange(next);
                  }}
                  className="focus-ring text-gray-muted hover:text-offwhite disabled:opacity-30"
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => onChange(sources.filter((_, i) => i !== index))}
                  className="focus-ring text-gray-muted hover:text-live-red"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelClass()}>Source name</label>
                <input
                  type="text"
                  value={source.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    onChange(
                      sources.map((s, i) => (i === index ? { ...s, name: value } : s))
                    );
                  }}
                  placeholder="e.g. World Health Organization"
                  className={fieldClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>Source title</label>
                <input
                  type="text"
                  value={source.title ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onChange(
                      sources.map((s, i) => (i === index ? { ...s, title: value } : s))
                    );
                  }}
                  placeholder="Optional title of the original material"
                  className={fieldClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>Source URL</label>
                <input
                  type="url"
                  value={source.url ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onChange(
                      sources.map((s, i) => (i === index ? { ...s, url: value } : s))
                    );
                  }}
                  placeholder="https://"
                  className={fieldClass()}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...sources, { name: "", title: null, url: null }])}
          className="focus-ring border border-dashed border-white/20 px-4 py-2.5 text-sm font-semibold text-offwhite transition-colors hover:border-accent hover:text-accent"
        >
          + Add source
        </button>
      </div>
    </div>
  );
}
