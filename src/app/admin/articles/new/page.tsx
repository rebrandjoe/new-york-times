import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { requireAdmin } from "@/lib/cms/admin-guard";
import { getAuthors, getTopics } from "@/lib/cms/queries";
import { listMedia } from "@/lib/actions/admin-media";

export default async function NewArticlePage() {
  await requireAdmin();

  const [topics, authors, media] = await Promise.all([
    getTopics(),
    getAuthors(),
    listMedia(),
  ]);

  return (
    <ArticleEditor
      topics={topics}
      authors={authors}
      media={media}
    />
  );
}
