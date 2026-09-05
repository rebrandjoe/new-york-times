import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { getArticleBySlug, getRelatedArticles } from "@/lib/cms/queries";
import { getComments } from "@/lib/actions/comments";

const SITE_URL = "https://josephmmwa.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || undefined;
  const canonical = article.canonicalUrl || `/article/${article.slug}`;
  const image = article.socialImage?.url || article.featuredImage?.url;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
      publishedTime: article.publicationDate,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const articlePath = `/article/${article.slug}`;
  const [related, comments] = await Promise.all([
    getRelatedArticles(article, 4),
    getComments(article.id),
  ]);

  const canonicalUrl = article.canonicalUrl || `${SITE_URL}${articlePath}`;

  return (
    <ArticleView
      article={article}
      related={related}
      comments={comments}
      articlePath={articlePath}
      canonicalUrl={canonicalUrl}
    />
  );
}
