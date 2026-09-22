"use client";

import type { Editor } from "@tiptap/react";
import { LinkButton } from "./LinkButton";

function buttonClass(active: boolean) {
  return `focus-ring border px-2.5 py-1.5 text-sm font-semibold ${
    active ? "border-accent text-accent" : "border-charcoal text-gray-secondary-light hover:border-accent hover:text-accent"
  }`;
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-charcoal" aria-hidden="true" />;
}

/** True when the user has selected essentially the entire document (e.g. Ctrl+A). */
function isWholeDocumentSelected(editor: Editor): boolean {
  const { from, to, empty } = editor.state.selection;
  if (empty) return false;
  const size = editor.state.doc.content.size;
  // ProseMirror doc positions: content runs roughly 1 .. size-1
  return from <= 1 && to >= size - 1;
}

/** Apply a mark only to the current selection — refuse whole-document selects. */
function toggleMarkSafely(editor: Editor, mark: "bold" | "italic") {
  if (isWholeDocumentSelected(editor)) return;
  if (mark === "bold") editor.chain().focus().toggleBold().run();
  else editor.chain().focus().toggleItalic().run();
}

/**
 * Headings apply only to the *current block* (paragraph under the cursor),
 * never to a multi-block selection. That stops the common bug where selecting
 * a subheading (or a range) and clicking H2 turns the whole article into
 * accent-coloured headings.
 */
function toggleHeadingOnCurrentBlock(editor: Editor, level: 2 | 3) {
  if (isWholeDocumentSelected(editor)) return;

  const { $from } = editor.state.selection;
  // Depth 1 = top-level block inside the doc
  const blockStart = $from.start(1);
  const blockEnd = $from.end(1);

  editor
    .chain()
    .focus()
    .setTextSelection({ from: blockStart, to: blockEnd })
    .toggleHeading({ level })
    .run();
}

export function EditorToolbar({ editor, articleId }: { editor: Editor; articleId?: string }) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 border border-charcoal bg-charcoal-deep p-2">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleMarkSafely(editor, "bold")}
        className={buttonClass(editor.isActive("bold"))}
        aria-label="Bold"
        title="Bold (selection only)"
      >
        B
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleMarkSafely(editor, "italic")}
        className={`${buttonClass(editor.isActive("italic"))} italic`}
        aria-label="Italic"
        title="Italic (selection only)"
      >
        I
      </button>
      <LinkButton editor={editor} articleId={articleId} />

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleHeadingOnCurrentBlock(editor, 2)}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        aria-label="Subheading (H2)"
        title="Subheading — applies to current paragraph only"
      >
        H2
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleHeadingOnCurrentBlock(editor, 3)}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        aria-label="Smaller subheading (H3)"
        title="Smaller subheading — applies to current paragraph only"
      >
        H3
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (isWholeDocumentSelected(editor)) return;
          const { $from } = editor.state.selection;
          editor
            .chain()
            .focus()
            .setTextSelection({ from: $from.start(1), to: $from.end(1) })
            .setParagraph()
            .run();
        }}
        className={buttonClass(editor.isActive("paragraph"))}
        aria-label="Normal paragraph"
        title="Normal text — current paragraph only"
      >
        ¶
      </button>

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (isWholeDocumentSelected(editor)) return;
          editor.chain().focus().toggleBulletList().run();
        }}
        className={buttonClass(editor.isActive("bulletList"))}
        aria-label="Bulleted list"
      >
        • List
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (isWholeDocumentSelected(editor)) return;
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={buttonClass(editor.isActive("orderedList"))}
        aria-label="Numbered list"
      >
        1. List
      </button>

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (isWholeDocumentSelected(editor)) return;
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={buttonClass(editor.isActive("blockquote"))}
        aria-label="Blockquote"
      >
        “ ”
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setPullQuote().run()}
        className={buttonClass(editor.isActive("pullQuote"))}
        aria-label="Pull quote"
      >
        Pull quote
      </button>

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().insertArticleImage().run()}
        className={buttonClass(false)}
        aria-label="Insert image"
      >
        Image
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().insertArticleVideo().run()}
        className={buttonClass(false)}
        aria-label="Insert video"
      >
        Video
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
        aria-label="Divider"
      >
        —
      </button>

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          // Clear marks on selection only — not the entire document
          if (isWholeDocumentSelected(editor)) return;
          editor.chain().focus().unsetAllMarks().run();
        }}
        className={buttonClass(false)}
        aria-label="Clear marks on selection"
        title="Remove bold/italic/link from selection"
      >
        Clear
      </button>
    </div>
  );
}
