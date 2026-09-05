import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { getArticleBySlug, getRelatedArticles } from "@/lib/cms/queries";
import { getComments } from "@/lib/actions/comments";
import { createClient } from "@/lib/supabase/server";
import { hasActivePremiumAccess } from "@/lib/premium/access";

const SITE_URL = "https://josephmmwa.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };

  const title = article.title;
  const description = article.excerpt || undefined;
  const canonical = `/article/${article.slug}`;
  const image = article.featuredImage?.url;

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [related, comments, premiumAccess] = await Promise.all([
    getRelatedArticles(article, 4),
    getComments(article.id),
    article.premium ? hasActivePremiumAccess(user?.id ?? null) : Promise.resolve(true),
  ]);

  const canonicalUrl = `${SITE_URL}${articlePath}`;

  return (
    <ArticleView
      article={article}
      related={related}
      comments={comments}
      articlePath={articlePath}
      canonicalUrl={canonicalUrl}
      premiumLocked={article.premium && !premiumAccess}
    />
  );
}
