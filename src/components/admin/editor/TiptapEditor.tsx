"use client";

import { useEffect } from "react";
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
  onMediaUploaded,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  media: CmsMedia[];
  onMediaUploaded?: (media: CmsMedia) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder: "Start writing…" }),
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
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
