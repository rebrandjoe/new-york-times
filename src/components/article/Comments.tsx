"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { postComment, type CommentRow } from "@/lib/actions/comments";
import { initialCommentState } from "@/lib/actions/form-state";

function draftKey(articleId: string) {
  return `comment-draft:${articleId}`;
}

function formatCommentDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Comments({
  articleId,
  articlePath,
  initialComments,
}: {
  articleId: string;
  articlePath: string;
  initialComments: CommentRow[];
}) {
  const boundPostComment = postComment.bind(null, articleId, articlePath);
  const [state, formAction] = useActionState(boundPostComment, initialCommentState);
  const [body, setBody] = useState(() => {
    // Restore a draft left behind by a sign-in redirect.
    try {
      return sessionStorage.getItem(draftKey(articleId)) ?? "";
    } catch {
      return "";
    }
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      const timeout = setTimeout(() => setBody(""), 0);
      try {
        sessionStorage.removeItem(draftKey(articleId));
      } catch {}
      formRef.current?.reset();
      return () => clearTimeout(timeout);
    }
    if (state.status === "auth_required") {
      try {
        sessionStorage.setItem(draftKey(articleId), body);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="font-serif text-2xl font-extrabold text-white">
        Comments {initialComments.length > 0 && `(${initialComments.length})`}
      </h2>

      <form ref={formRef} action={formAction} className="mt-6">
        <label htmlFor="comment-body" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="comment-body"
          name="body"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts…"
          className="focus-ring w-full border border-white/10 bg-charcoal-deep px-4 py-3 text-sm text-offwhite placeholder:text-gray-muted transition-colors focus:border-accent"
        />

        {state.status === "auth_required" ? (
          <div className="mt-3 border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
            Only registered users can comment.{" "}
            <Link
              href={`/sign-in?redirectTo=${encodeURIComponent(articlePath)}`}
              className="font-semibold underline underline-offset-2"
            >
              Sign in to continue
            </Link>
          </div>
        ) : state.status === "error" && state.message ? (
          <p role="alert" className="mt-3 border border-live-red/40 bg-live-red/10 px-4 py-3 text-sm text-live-red">
            {state.message}
          </p>
        ) : null}

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="focus-ring bg-accent px-6 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Post
          </button>
        </div>
      </form>

      <div className="mt-10 divide-y divide-charcoal border-t border-charcoal">
        {initialComments.length === 0 ? (
          <p className="py-6 text-sm text-gray-muted">Be the first to comment.</p>
        ) : (
          initialComments.map((comment) => (
            <div key={comment.id} className="py-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-offwhite">{comment.authorName}</span>
                <span className="text-xs text-gray-muted">{formatCommentDate(comment.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-secondary-light">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
