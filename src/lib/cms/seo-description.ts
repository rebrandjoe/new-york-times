import type { ContentBlock } from "./blocks";
import type { CmsArticle } from "./types";

/** Prefer editor meta description, then excerpt, then a plain-text body snippet. */
export function resolveArticleMetaDescription(article: {
  seoDescription?: string | null;
  excerpt?: string | null;
  body?: ContentBlock[];
}): string | undefined {
  const custom = article.seoDescription?.trim();
  if (custom) return custom;

  const excerpt = article.excerpt?.trim();
  if (excerpt) return excerpt;

  const firstParagraph = article.body?.find(
    (b): b is Extract<ContentBlock, { type: "paragraph" }> =>
      b.type === "paragraph" && Boolean(b.text?.trim())
  );
  if (firstParagraph?.text) {
    const plain = firstParagraph.text.replace(/\s+/g, " ").trim();
    if (plain.length <= 160) return plain;
    return `${plain.slice(0, 157).trimEnd()}…`;
  }

  return undefined;
}

export function resolveCmsArticleMetaDescription(article: CmsArticle): string | undefined {
  return resolveArticleMetaDescription(article);
}
