import type { CmsArticle } from "@/lib/cms/types";

export function SourceAttribution({ source }: { source: CmsArticle["source"] }) {
  const hasSource = source.name || source.author || source.institution || source.url;
  if (!hasSource) return null;

  return (
    <div className="border-t border-charcoal py-4 text-sm text-gray-muted">
      <p>
        {source.name && <>Originally reported by {source.name}</>}
        {source.author && <>{source.name ? " — " : ""}{source.author}</>}
        {source.institution && <> ({source.institution})</>}
        {source.url && (
          <>
            .{" "}
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              View original source
            </a>
          </>
        )}
      </p>
      {source.additional && <p className="mt-1">{source.additional}</p>}
    </div>
  );
}
