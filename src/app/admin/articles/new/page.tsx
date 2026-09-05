import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { getCategories, getAuthors, getTopics } from "@/lib/cms/queries";
import { listMedia } from "@/lib/actions/admin-media";

export default async function NewArticlePage() {
  await requireAdmin();

  const [categories, topics, authors, media] = await Promise.all([
    getCategories(),
    getTopics(),
    getAuthors(),
    listMedia(),
  ]);

  return (
    <ArticleEditor
      categories={categories}
      topics={topics}
      authors={authors}
      media={media}
    />
  );
}
