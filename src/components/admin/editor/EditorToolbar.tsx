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

function isWholeDocumentSelected(editor: Editor): boolean {
  const { from, to, empty } = editor.state.selection;
  if (empty) return false;
  const size = editor.state.doc.content.size;
  return from <= 1 && to >= size - 1;
}

function toggleMarkSafely(editor: Editor, mark: "bold" | "italic") {
  if (isWholeDocumentSelected(editor)) return;
  if (mark === "bold") editor.chain().focus().toggleBold().run();
  else editor.chain().focus().toggleItalic().run();
}

/**
 * Convert only the top-level block under the cursor between paragraph ↔ heading.
 * Never touches other blocks — this is what stops the whole article going gold.
 */
function setCurrentBlockType(
  editor: Editor,
  type: "paragraph" | "heading",
  headingLevel?: 2 | 3
) {
  const { state } = editor;
  const { $from } = state.selection;
  if ($from.depth < 1) return;

  const pos = $from.before(1);
  const node = $from.node(1);
  if (!node?.isTextblock) return;

  const paragraph = state.schema.nodes.paragraph;
  const heading = state.schema.nodes.heading;
  if (!paragraph || !heading) return;

  // Collapse selection to a caret inside this block so TipTap cannot
  // expand a multi-block selection into a multi-node transform.
  const caret = Math.min(Math.max($from.pos, pos + 1), pos + node.nodeSize - 2);

  if (type === "paragraph") {
    if (node.type.name === "paragraph") return;
    editor.chain().focus().setTextSelection(caret).setNode("paragraph").run();
    return;
  }

  if (headingLevel == null) return;

  // Toggle off if already this heading level
  if (node.type.name === "heading" && node.attrs.level === headingLevel) {
    editor.chain().focus().setTextSelection(caret).setNode("paragraph").run();
    return;
  }

  editor
    .chain()
    .focus()
    .setTextSelection(caret)
    .setNode("heading", { level: headingLevel })
    .run();
}

/**
 * Convert every heading in the document back to a normal paragraph.
 * Use when the article accidentally turned all gold.
 */
function convertAllHeadingsToParagraphs(editor: Editor) {
  const { state } = editor;
  const paragraph = state.schema.nodes.paragraph;
  if (!paragraph) return;

  // Collect positions from the end so earlier positions stay valid as we edit.
  const headingPositions: number[] = [];
  state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      headingPositions.push(pos);
    }
    // Only top-level blocks matter for our schema; skip descending into them.
    return false;
  });

  if (headingPositions.length === 0) return;

  let chain = editor.chain().focus();
  for (let i = headingPositions.length - 1; i >= 0; i--) {
    const pos = headingPositions[i];
    const node = state.doc.nodeAt(pos);
    if (!node) continue;
    // Place caret inside the heading, then setParagraph (TipTap built-in).
    const caret = pos + 1;
    chain = chain.setTextSelection(caret).setParagraph();
  }
  chain.run();
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
        title="Bold — selected text only"
      >
        B
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleMarkSafely(editor, "italic")}
        className={`${buttonClass(editor.isActive("italic"))} italic`}
        aria-label="Italic"
        title="Italic — selected text only"
      >
        I
      </button>
      <LinkButton editor={editor} articleId={articleId} />

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setCurrentBlockType(editor, "heading", 2)}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        aria-label="Subheading"
        title="Subheading — ONLY the line your cursor is on"
      >
        H2
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setCurrentBlockType(editor, "heading", 3)}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        aria-label="Smaller subheading"
        title="Smaller subheading — ONLY the line your cursor is on"
      >
        H3
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setCurrentBlockType(editor, "paragraph")}
        className={buttonClass(editor.isActive("paragraph"))}
        aria-label="Body text"
        title="Body text — turn THIS line back to normal (off-white)"
      >
        Body
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
          if (isWholeDocumentSelected(editor)) return;
          editor.chain().focus().unsetAllMarks().run();
        }}
        className={buttonClass(false)}
        aria-label="Clear marks on selection"
        title="Remove bold/italic/link from selected text only"
      >
        Clear
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => convertAllHeadingsToParagraphs(editor)}
        className="focus-ring border border-accent/60 bg-accent/10 px-2.5 py-1.5 text-sm font-semibold text-accent hover:bg-accent/20"
        aria-label="Reset all headings to body text"
        title="Click this if body text turned gold — restores all lines to normal body text"
      >
        Fix gold text
      </button>
    </div>
  );
}
