import { ChevronDownIcon } from "@/components/icons";
import type { ArticleSource } from "@/lib/cms/types";

export function SourceAttribution({ sources }: { sources: ArticleSource[] }) {
  const entries = (sources ?? []).filter(
    (s) => s.author?.trim() || s.publication?.trim() || s.url?.trim()
  );
  if (entries.length === 0) return null;

  return (
    <details className="group border-t border-charcoal py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 text-sm font-semibold tracking-wide text-gray-secondary-light transition-colors hover:text-offwhite [&::-webkit-details-marker]:hidden">
        <span>Sources & attribution</span>
        <ChevronDownIcon
          className="h-4 w-4 shrink-0 text-gray-muted transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <ul className="mt-4 space-y-5 pb-1">
        {entries.map((entry, index) => {
          const author = entry.author?.trim() || null;
          const publication = entry.publication?.trim() || null;
          const url = entry.url?.trim() || null;

          return (
            <li key={`${author ?? ""}-${publication ?? ""}-${url ?? index}`} className="text-sm">
              {author && <p className="font-semibold text-offwhite">{author}</p>}
              {publication && (
                <p
                  className={
                    author
                      ? "mt-1 leading-relaxed text-gray-secondary-light"
                      : "font-semibold text-offwhite"
                  }
                >
                  {publication}
                </p>
              )}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-accent transition-opacity hover:underline hover:opacity-90"
                >
                  View original source →
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
