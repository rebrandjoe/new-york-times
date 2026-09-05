"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  deleteArticle,
  duplicateArticle,
  setArticleStatus,
} from "@/lib/actions/admin-articles";

export function ArticleRowActions({
  articleId,
  status,
}: {
  articleId: string;
  status: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onUnpublish() {
    startTransition(async () => {
      await setArticleStatus(articleId, "unpublished");
      router.refresh();
    });
  }

  function onDuplicate() {
    startTransition(async () => {
      const result = await duplicateArticle(articleId);
      if ("id" in result) router.push(`/admin/articles/${result.id}`);
    });
  }

  function onDelete() {
    if (!confirm("Delete this article permanently? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteArticle(articleId);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-3 text-xs font-semibold">
      <Link href={`/admin/articles/${articleId}`} className="focus-ring text-accent hover:underline">
        Edit
      </Link>
      <Link
        href={`/preview/article/${articleId}`}
        target="_blank"
        className="focus-ring text-gray-secondary-light hover:text-accent"
      >
        Preview
      </Link>
      <button
        type="button"
        disabled={isPending}
        onClick={onDuplicate}
        className="focus-ring text-gray-secondary-light hover:text-accent disabled:opacity-50"
      >
        Duplicate
      </button>
      {status === "published" && (
        <button
          type="button"
          disabled={isPending}
          onClick={onUnpublish}
          className="focus-ring text-gray-secondary-light hover:text-accent disabled:opacity-50"
        >
          Unpublish
        </button>
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={onDelete}
        className="focus-ring text-live-red hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
