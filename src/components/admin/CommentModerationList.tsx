"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteComment, hideComment, unhideComment, type AdminCommentRow } from "@/lib/actions/comments";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function CommentModerationList({ comments }: { comments: AdminCommentRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function articlePath(comment: AdminCommentRow) {
    return `/article/${comment.articleSlug}`;
  }

  function onHide(comment: AdminCommentRow) {
    startTransition(async () => {
      await hideComment(comment.id, articlePath(comment));
      router.refresh();
    });
  }

  function onUnhide(comment: AdminCommentRow) {
    startTransition(async () => {
      await unhideComment(comment.id, articlePath(comment));
      router.refresh();
    });
  }

  function onDelete(comment: AdminCommentRow) {
    if (!confirm("Delete this comment permanently?")) return;
    startTransition(async () => {
      await deleteComment(comment.id, articlePath(comment));
      router.refresh();
    });
  }

  if (comments.length === 0) {
    return <p className="mt-8 text-gray-muted">No comments yet.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border border-charcoal bg-charcoal-deep p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm">
              <span className="font-semibold text-white">{comment.authorName}</span>
              <span className="ml-2 text-gray-muted">on</span>{" "}
              <Link href={articlePath(comment)} target="_blank" className="focus-ring text-accent hover:underline">
                {comment.articleTitle}
              </Link>
            </div>
            <span
              className={`border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
                comment.status === "visible" ? "border-charcoal text-gray-muted" : "border-live-red/40 text-live-red"
              }`}
            >
              {comment.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-secondary-light">{comment.body}</p>
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="text-gray-muted">{formatDate(comment.createdAt)}</span>
            {comment.status === "visible" ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => onHide(comment)}
                className="focus-ring font-semibold text-gray-secondary-light hover:text-accent disabled:opacity-50"
              >
                Hide
              </button>
            ) : (
              <button
                type="button"
                disabled={isPending}
                onClick={() => onUnhide(comment)}
                className="focus-ring font-semibold text-gray-secondary-light hover:text-accent disabled:opacity-50"
              >
                Unhide
              </button>
            )}
            <button
              type="button"
              disabled={isPending}
              onClick={() => onDelete(comment)}
              className="focus-ring font-semibold text-live-red hover:underline disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
