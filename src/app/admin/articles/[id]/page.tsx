import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { getArticleForEdit, getArticleTopicIds } from "@/lib/cms/admin-queries";
import { getCategories, getAuthors, getTopics } from "@/lib/cms/queries";
import { listMedia } from "@/lib/actions/admin-media";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const article = await getArticleForEdit(supabase, id);
  if (!article) notFound();

  const [categories, topics, authors, media, initialTopicIds] = await Promise.all([
    getCategories(),
    getTopics(),
    getAuthors(),
    listMedia(),
    getArticleTopicIds(supabase, id),
  ]);

  return (
    <ArticleEditor
      articleId={article.id}
      initial={article}
      initialTopicIds={initialTopicIds}
      categories={categories}
      topics={topics}
      authors={authors}
      media={media}
    />
  );
}
