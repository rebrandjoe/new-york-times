import { requireAdmin } from "@/lib/cms/admin-guard";
import { getAllCommentsForAdmin } from "@/lib/actions/comments";
import { CommentModerationList } from "@/components/admin/CommentModerationList";

export default async function AdminCommentsPage() {
  await requireAdmin();
  const comments = await getAllCommentsForAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl font-extrabold text-white">Comments</h1>
      <CommentModerationList comments={comments} />
    </div>
  );
}
