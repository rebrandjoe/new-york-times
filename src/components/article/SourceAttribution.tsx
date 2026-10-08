import { ChevronDownIcon } from "@/components/icons";
import type { CmsArticle } from "@/lib/cms/types";

type SourceEntry = {
  name: string;
  title: string | null;
  url: string | null;
};

/**
 * Build the display list from existing CMS source fields only.
 * Primary fields form the first entry. Optional extra sources can be stored as
 * JSON in `source.additional`: [{ "name", "title", "url" }, ...]
 * Plain-text additional stays a note under the primary source (no invented data).
 */
function buildSourceEntries(source: CmsArticle["source"]): SourceEntry[] {
  const entries: SourceEntry[] = [];

  let extraFromJson: SourceEntry[] = [];
  let plainAdditional: string | null = source.additional?.trim() || null;

  if (plainAdditional?.startsWith("[")) {
    try {
      const parsed = JSON.parse(plainAdditional) as unknown;
      if (Array.isArray(parsed)) {
        extraFromJson = parsed
          .filter(
            (item): item is { name?: unknown; title?: unknown; url?: unknown } =>
              item !== null && typeof item === "object"
          )
          .map((item) => ({
            name: typeof item.name === "string" ? item.name.trim() : "",
            title: typeof item.title === "string" ? item.title.trim() : null,
            url: typeof item.url === "string" ? item.url.trim() : null,
          }))
          .filter((item) => item.name || item.url || item.title);
        if (extraFromJson.length > 0) {
          plainAdditional = null;
        }
      }
    } catch {
      // Keep plainAdditional as free-text attribution note
    }
  }

  const hasPrimary =
    source.name || source.author || source.institution || source.url || plainAdditional;

  if (hasPrimary) {
    const name =
      (source.name && source.name.trim()) ||
      (source.institution && source.institution.trim()) ||
      (source.author && source.author.trim()) ||
      "Source";

    const titleParts: string[] = [];
    if (source.author?.trim() && source.author.trim() !== name) {
      titleParts.push(source.author.trim());
    }
    if (source.institution?.trim() && source.institution.trim() !== name) {
      titleParts.push(source.institution.trim());
    }
    if (plainAdditional) {
      titleParts.push(plainAdditional);
    }

    entries.push({
      name,
      title: titleParts.length > 0 ? titleParts.join(" · ") : null,
      url: source.url?.trim() || null,
    });
  }

  for (const extra of extraFromJson) {
    entries.push({
      name: extra.name || "Source",
      title: extra.title,
      url: extra.url,
    });
  }

  return entries;
}

export function SourceAttribution({ source }: { source: CmsArticle["source"] }) {
  const entries = buildSourceEntries(source);
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
        {entries.map((entry, index) => (
          <li key={`${entry.name}-${entry.url ?? index}`} className="text-sm">
            <p className="font-semibold text-offwhite">{entry.name}</p>
            {entry.title && (
              <p className="mt-1 leading-relaxed text-gray-secondary-light">{entry.title}</p>
            )}
            {entry.url && (
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-accent transition-opacity hover:underline hover:opacity-90"
              >
                View original source →
              </a>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
