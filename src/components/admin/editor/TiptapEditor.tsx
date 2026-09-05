"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import type { ContentBlock } from "@/lib/cms/blocks";
import type { CmsMedia } from "@/lib/cms/types";
import { blocksToTiptapDoc, tiptapDocToBlocks } from "@/lib/cms/tiptap-blocks";
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
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  media: CmsMedia[];
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      ArticleImage.configure({ media }),
      ArticleVideo,
      PullQuote,
    ],
    content: blocksToTiptapDoc(blocks),
    onUpdate: ({ editor }) => onChange(tiptapDocToBlocks(editor.getJSON())),
    editorProps: {
      attributes: {
        class: "px-5 py-6 sm:px-8 sm:py-8",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="tiptap-editor border border-charcoal bg-charcoal-deep">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
