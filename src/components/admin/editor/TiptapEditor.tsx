"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Fragment, Slice, type Node as PMNode } from "@tiptap/pm/model";
import type { ContentBlock } from "@/lib/cms/blocks";
import type { CmsMedia } from "@/lib/cms/types";
import { blocksToTiptapDoc, tiptapDocToBlocks, inlineFromText } from "@/lib/cms/tiptap-blocks";
import { ArticleImage } from "./ArticleImageExtension";
import { ArticleVideo } from "./ArticleVideoExtension";
import { PullQuote } from "./PullQuoteExtension";
import { EditorToolbar } from "./EditorToolbar";

/** Build ProseMirror inline nodes from a single paragraph string. */
function buildInline(
  schema: ReturnType<typeof useEditor> extends infer E
    ? E extends { state: { schema: infer S } }
      ? S
      : never
    : never,
  text: string
): PMNode[] {
  // schema is ProseMirror Schema — keep typing practical for the editor
  const s = schema as {
    text: (t: string, marks?: unknown[]) => PMNode;
    nodes: Record<string, { create: (attrs?: unknown, content?: unknown) => PMNode }>;
    marks: Record<string, { create: (attrs?: unknown) => unknown }>;
  };

  const json = inlineFromText(text);
  const out: PMNode[] = [];

  for (const n of json) {
    if (n.type === "hardBreak") {
      if (s.nodes.hardBreak) out.push(s.nodes.hardBreak.create());
      continue;
    }
    if (n.type !== "text" || !n.text) continue;

    const marks = (n.marks ?? [])
      .map((m) => {
        const markType = s.marks[m.type];
        if (!markType) return null;
        try {
          return markType.create(m.attrs);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    out.push(s.text(n.text, marks as never[]));
  }

  return out;
}

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
      /**
       * Paste handling:
       * - Prefer text/plain so Word / Docs / Notes / chat drafts always insert.
       * - Split into paragraphs on blank lines (or single newlines if no blank lines).
       * - Support **bold**, *italic*, [links](url) when present.
       * - Never call preventDefault until nodes are built successfully (avoids silent paste loss).
       * - If anything fails, return false so TipTap’s default paste can try.
       */
      handlePaste: (view, event) => {
        const raw = event.clipboardData?.getData("text/plain") ?? "";
        if (!raw.trim()) return false;

        try {
          const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

          let parts = normalized.split(/\n{2,}/).map((p) => p.trim());
          // Drafts often use a single newline between paragraphs
          if (parts.length === 1 && normalized.includes("\n")) {
            parts = normalized.split("\n").map((p) => p.trim());
          }
          parts = parts.filter((p) => p.length > 0);
          if (parts.length === 0) return false;

          const { schema } = view.state;
          if (!schema.nodes.paragraph) return false;

          const nodes: PMNode[] = parts.map((p) => {
            const inline = buildInline(schema as never, p);
            return schema.nodes.paragraph.create(
              null,
              inline.length > 0 ? inline : undefined
            );
          });

          if (nodes.length === 0) return false;

          event.preventDefault();
          const fragment = Fragment.fromArray(nodes);
          const tr = view.state.tr.replaceSelection(new Slice(fragment, 0, 0));
          view.dispatch(tr);
          return true;
        } catch (err) {
          console.error("[editor] paste failed, falling back to default", err);
          return false;
        }
      },
    },
  });

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
