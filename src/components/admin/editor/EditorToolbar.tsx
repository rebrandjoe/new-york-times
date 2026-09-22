"use client";

import type { Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
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
 * Change *only* the top-level block that contains the cursor.
 * Uses setNodeMarkup so multi-paragraph selections cannot turn the whole
 * article into gold H2/H3 headings.
 */
function setCurrentBlockType(
  editor: Editor,
  type: "paragraph" | "heading",
  headingLevel?: 2 | 3
) {
  editor
    .chain()
    .focus()
    .command(({ tr, state, dispatch }) => {
      const { $from } = state.selection;
      // Walk up to the top-level block inside the doc (depth 1).
      if ($from.depth < 1) return false;

      const pos = $from.before(1);
      const node: ProseMirrorNode = $from.node(1);
      if (!node) return false;

      // Only convert textblocks (paragraph / heading), not images/videos/hr.
      if (!node.isTextblock) return false;

      const schema = state.schema;
      if (type === "paragraph") {
        if (node.type === schema.nodes.paragraph) return true;
        if (!schema.nodes.paragraph) return false;
        if (dispatch) tr.setNodeMarkup(pos, schema.nodes.paragraph);
        return true;
      }

      // heading
      if (!schema.nodes.heading || headingLevel == null) return false;
      const already =
        node.type === schema.nodes.heading && node.attrs.level === headingLevel;
      if (already) {
        // Toggle off → back to normal paragraph
        if (dispatch) tr.setNodeMarkup(pos, schema.nodes.paragraph);
        return true;
      }
      if (dispatch) {
        tr.setNodeMarkup(pos, schema.nodes.heading, { level: headingLevel });
      }
      return true;
    })
    .run();
}

/** Emergency: turn every heading in the doc back into a normal paragraph. */
function convertAllHeadingsToParagraphs(editor: Editor) {
  editor
    .chain()
    .focus()
    .command(({ tr, state, dispatch }) => {
      const heading = state.schema.nodes.heading;
      const paragraph = state.schema.nodes.paragraph;
      if (!heading || !paragraph || !dispatch) return false;

      const positions: number[] = [];
      state.doc.forEach((node, offset) => {
        if (node.type === heading) positions.push(offset);
      });
      // Apply from the end so positions stay valid
      for (let i = positions.length - 1; i >= 0; i--) {
        tr.setNodeMarkup(positions[i], paragraph);
      }
      return positions.length > 0;
    })
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
        title="Subheading — current line only (not the whole article)"
      >
        H2
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setCurrentBlockType(editor, "heading", 3)}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        aria-label="Smaller subheading"
        title="Smaller subheading — current line only"
      >
        H3
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setCurrentBlockType(editor, "paragraph")}
        className={buttonClass(editor.isActive("paragraph"))}
        aria-label="Body text"
        title="Body text — turn this line back into normal paragraph"
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
        className={buttonClass(false)}
        aria-label="Reset all headings to body text"
        title="If everything turned gold by mistake, click this to restore normal body text"
      >
        Fix gold text
      </button>
    </div>
  );
}
