"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import { LinkButton } from "./LinkButton";

function btn(active: boolean) {
  return `focus-ring border px-2.5 py-1.5 text-sm font-semibold ${
    active
      ? "border-accent text-accent"
      : "border-charcoal text-gray-secondary-light hover:border-accent hover:text-accent"
  }`;
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-charcoal" aria-hidden="true" />;
}

/**
 * Change only the single top-level block under the cursor.
 * Uses setNodeMarkup so other lines are never touched.
 */
function setLineStyle(editor: Editor, style: "body" | "h2" | "h3") {
  const { state } = editor;
  const { $from } = state.selection;
  if ($from.depth < 1) return;

  const pos = $from.before(1);
  const node = $from.node(1);
  if (!node?.isTextblock) return;

  const paragraph = state.schema.nodes.paragraph;
  const heading = state.schema.nodes.heading;
  if (!paragraph || !heading) return;

  editor
    .chain()
    .focus()
    .command(({ tr, dispatch }) => {
      if (style === "body") {
        if (node.type.name === "paragraph") return true;
        if (dispatch) tr.setNodeMarkup(pos, paragraph);
        return true;
      }
      const level = style === "h2" ? 2 : 3;
      if (node.type.name === "heading" && node.attrs.level === level) {
        // Already this style → toggle back to body
        if (dispatch) tr.setNodeMarkup(pos, paragraph);
        return true;
      }
      if (dispatch) tr.setNodeMarkup(pos, heading, { level });
      return true;
    })
    .run();
}

/** Bold/italic only on the current selection — never the whole article. */
function toggleMark(editor: Editor, mark: "bold" | "italic") {
  const { from, to, empty } = editor.state.selection;
  const size = editor.state.doc.content.size;
  // Refuse accidental select-all
  if (!empty && from <= 1 && to >= size - 1) return;

  if (mark === "bold") editor.chain().focus().toggleBold().run();
  else editor.chain().focus().toggleItalic().run();
}

export function EditorToolbar({ editor, articleId }: { editor: Editor; articleId?: string }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      bold: ed.isActive("bold"),
      italic: ed.isActive("italic"),
      h2: ed.isActive("heading", { level: 2 }),
      h3: ed.isActive("heading", { level: 3 }),
      body: ed.isActive("paragraph"),
      bullet: ed.isActive("bulletList"),
      ordered: ed.isActive("orderedList"),
      quote: ed.isActive("blockquote"),
      pull: ed.isActive("pullQuote"),
    }),
  });

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 border border-charcoal bg-charcoal-deep p-2">
      {/* Word formatting — selected text only */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleMark(editor, "bold")}
        className={btn(!!s?.bold)}
        aria-label="Bold"
        title="Bold selected text only"
      >
        B
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleMark(editor, "italic")}
        className={`${btn(!!s?.italic)} italic`}
        aria-label="Italic"
        title="Italic selected text only"
      >
        I
      </button>
      <LinkButton editor={editor} articleId={articleId} />

      <Divider />

      {/* Line style — current line only */}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setLineStyle(editor, "h2")}
        className={btn(!!s?.h2)}
        aria-label="Subheading large"
        title="Make this line a large subheading"
      >
        H2
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setLineStyle(editor, "h3")}
        className={btn(!!s?.h3)}
        aria-label="Subheading small"
        title="Make this line a small subheading"
      >
        H3
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setLineStyle(editor, "body")}
        className={btn(!!s?.body)}
        aria-label="Body text"
        title="Make this line normal body text"
      >
        Body
      </button>

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btn(!!s?.bullet)}
        aria-label="Bullet list"
      >
        • List
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btn(!!s?.ordered)}
        aria-label="Numbered list"
      >
        1. List
      </button>

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btn(!!s?.quote)}
        aria-label="Quote"
      >
        “ ”
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setPullQuote().run()}
        className={btn(!!s?.pull)}
        aria-label="Pull quote"
      >
        Pull quote
      </button>

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().insertArticleImage().run()}
        className={btn(false)}
        aria-label="Image"
      >
        Image
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().insertArticleVideo().run()}
        className={btn(false)}
        aria-label="Video"
      >
        Video
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={btn(false)}
        aria-label="Divider"
      >
        —
      </button>

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className={btn(false)}
        aria-label="Clear marks"
        title="Remove bold/italic/link from selection"
      >
        Clear
      </button>
    </div>
  );
}
