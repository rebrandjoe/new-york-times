"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Fragment, Slice } from "@tiptap/pm/model";
import type { ContentBlock } from "@/lib/cms/blocks";
import type { CmsMedia } from "@/lib/cms/types";
import { blocksToTiptapDoc, tiptapDocToBlocks, inlineFromText } from "@/lib/cms/tiptap-blocks";
import { ArticleImage } from "./ArticleImageExtension";
import { ArticleVideo } from "./ArticleVideoExtension";
import { PullQuote } from "./PullQuoteExtension";
import { EditorToolbar } from "./EditorToolbar";

/** One continuous writing canvas — write and press Enter for a new
 * paragraph, like Google Docs or Notion. Replaces the old per-block boxes;
 * on every change the doc is converted back to ContentBlock[] so storage,
 * the public BlockRenderer, and read-time estimation are untouched. */
export function TiptapEditor({
  blocks,
  onChange,
  media,
  onMediaUploaded,
  articleId,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  media: CmsMedia[];
  onMediaUploaded?: (media: CmsMedia) => void;
  /** Current article's own id, so the "link to another article" search
   * excludes this article from its own results. Undefined for a new,
   * unsaved draft — nothing to exclude yet. */
  articleId?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        HTMLAttributes: { class: "text-accent underline underline-offset-2" },
      }),
      ArticleImage.configure({ media, onUploaded: onMediaUploaded }),
      ArticleVideo,
      PullQuote,
    ],
    content: blocksToTiptapDoc(blocks),
    onUpdate: ({ editor }) => onChange(tiptapDocToBlocks(editor.getJSON())),
    editorProps: {
      attributes: {
        class: "px-5 py-6 sm:px-8 sm:py-8",
      },
      // Lets a plain-text draft that already contains **bold**, *italic*,
      // or [text](url) source links (e.g. a draft handed over from chat,
      // with the exact source URLs already written in) turn into real
      // formatting and working links the moment it's pasted — no manual
      // re-linking of every "according to CDC" needed. Only intercepts
      // when that markdown pattern is actually present; a normal paste of
      // plain prose (or an image, or anything else) is untouched and
      // falls through to Tiptap's default paste handling.
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain") ?? "";
        const looksLikeMarkdown = /\*\*.+?\*\*|\[.+?\]\((?:https?:\/\/|\/)[^\s)]+\)/.test(text);
        if (!text || !looksLikeMarkdown) return false;

        event.preventDefault();
        const paragraphs = text
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean);

        const { schema } = view.state;
        const nodes = paragraphs.map((p) =>
          schema.nodes.paragraph.create(
            null,
            inlineFromText(p).map((n) =>
              schema.text(
                n.text ?? "",
                (n.marks ?? []).map((m) => schema.marks[m.type].create(m.attrs))
              )
            )
          )
        );

        const fragment = Fragment.fromArray(nodes);
        const tr = view.state.tr.replaceSelection(new Slice(fragment, 0, 0));
        view.dispatch(tr);
        return true;
      },
    },
  });

  // Extension options are captured once at editor creation — keep them in
  // sync as new uploads extend the media list during the same session.
  useEffect(() => {
    if (!editor) return;
    const imageExtension = editor.extensionManager.extensions.find((e) => e.name === "articleImage");
    if (imageExtension) {
      imageExtension.options.media = media;
      imageExtension.options.onUploaded = onMediaUploaded;
    }
  }, [editor, media, onMediaUploaded]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor border border-charcoal bg-charcoal-deep">
      <EditorToolbar editor={editor} articleId={articleId} />
      <EditorContent editor={editor} />
    </div>
  );
}
