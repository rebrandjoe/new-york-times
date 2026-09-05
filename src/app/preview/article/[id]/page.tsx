import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article/ArticleView";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { getArticleForEdit } from "@/lib/cms/admin-queries";
import { getRelatedArticles } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const article = await getArticleForEdit(supabase, id);
  if (!article) notFound();

  const related = await getRelatedArticles(article, 4);

  return (
    <div>
      <div className="border-b border-charcoal bg-charcoal-deep px-4 py-3 text-center text-sm text-accent sm:px-6 lg:px-8">
        Preview — {article.status === "published" ? "this is live" : `not published (${article.status})`}
      </div>
      <ArticleView
        article={article}
        related={related}
        comments={[]}
        articlePath={`/article/${article.slug}`}
        canonicalUrl={`https://josephmmwa.com/article/${article.slug}`}
        interactive={false}
      />
    </div>
  );
}
