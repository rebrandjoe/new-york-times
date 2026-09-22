"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import type { Node as PMNode } from "@tiptap/pm/model";
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

/** Copy inline content (text + marks) from a slice of a textblock. */
function sliceInline(parent: PMNode, from: number, to: number) {
  return parent.content.cut(from, to);
}

/**
 * Apply body / H2 / H3 to ONLY what the user selected (or the single line
 * under the cursor). Never converts the rest of the article.
 */
function applyLineStyle(editor: Editor, style: "body" | "h2" | "h3") {
  const { state } = editor;
  const { selection, schema, doc } = state;
  const { $from, $to, empty, from, to } = selection;
  const paragraph = schema.nodes.paragraph;
  const heading = schema.nodes.heading;
  if (!paragraph || !heading) return;

  const level = style === "h2" ? 2 : style === "h3" ? 3 : null;

  editor
    .chain()
    .focus()
    .command(({ tr, dispatch }) => {
      // ── Case A: non-empty selection inside ONE textblock ───────────
      // Split that block into: before | styled middle | after
      if (!empty && $from.sameParent($to) && $from.parent.isTextblock) {
        const parent = $from.parent;
        const parentPos = $from.before();
        const parentEnd = $from.after();
        const a = $from.parentOffset;
        const b = $to.parentOffset;
        if (a === b) return false;

        const before = sliceInline(parent, 0, a);
        const middle = sliceInline(parent, a, b);
        const after = sliceInline(parent, b, parent.content.size);

        const nodes: PMNode[] = [];
        if (before.size > 0) {
          nodes.push(paragraph.create(null, before));
        }
        if (middle.size > 0) {
          nodes.push(
            style === "body"
              ? paragraph.create(null, middle)
              : heading.create({ level }, middle)
          );
        }
        if (after.size > 0) {
          nodes.push(paragraph.create(null, after));
        }
        if (nodes.length === 0) {
          nodes.push(paragraph.create());
        }

        if (dispatch) {
          tr.replaceWith(parentPos, parentEnd, nodes);
        }
        return true;
      }

      // ── Case B: cursor only, or whole-block selection ───────────────
      // Change only the top-level block that contains the cursor.
      if ($from.depth < 1) return false;
      const pos = $from.before(1);
      const node = $from.node(1);
      if (!node?.isTextblock) return false;

      // Refuse if the selection spans multiple top-level blocks
      // (would have been handled above only for same parent).
      if (!empty) {
        let blockCount = 0;
        doc.nodesBetween(from, to, (n, p, parent) => {
          if (parent === doc && n.isTextblock) blockCount += 1;
        });
        if (blockCount > 1) {
          // Convert only the first selected block — never all of them
          // (user asked for one line). Find first block pos.
          let firstPos: number | null = null;
          doc.nodesBetween(from, to, (n, p, parent) => {
            if (parent === doc && n.isTextblock && firstPos === null) firstPos = p;
          });
          if (firstPos == null) return false;
          const firstNode = doc.nodeAt(firstPos);
          if (!firstNode) return false;
          if (dispatch) {
            tr.setNodeMarkup(
              firstPos,
              style === "body" ? paragraph : heading,
              style === "body" ? null : { level }
            );
          }
          return true;
        }
      }

      if (dispatch) {
        tr.setNodeMarkup(
          pos,
          style === "body" ? paragraph : heading,
          style === "body" ? null : { level }
        );
      }
      return true;
    })
    .run();
}

function toggleMark(editor: Editor, mark: "bold" | "italic") {
  const { from, to, empty } = editor.state.selection;
  const size = editor.state.doc.content.size;
  if (!empty && from <= 1 && to >= size - 1) return;
  if (mark === "bold") editor.chain().focus().toggleBold().run();
  else editor.chain().focus().toggleItalic().run();
}

/** Turn every heading in the doc back into a normal paragraph. */
function resetAllHeadings(editor: Editor) {
  const positions: number[] = [];
  editor.state.doc.forEach((node, offset) => {
    if (node.type.name === "heading") positions.push(offset);
  });
  if (positions.length === 0) return;

  editor
    .chain()
    .focus()
    .command(({ tr, state, dispatch }) => {
      const paragraph = state.schema.nodes.paragraph;
      if (!paragraph || !dispatch) return false;
      for (let i = positions.length - 1; i >= 0; i--) {
        tr.setNodeMarkup(positions[i], paragraph);
      }
      return true;
    })
    .run();
}

export function EditorToolbar({ editor, articleId }: { editor: Editor; articleId?: string }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: ed }) => {
      let headings = 0;
      ed.state.doc.forEach((node) => {
        if (node.type.name === "heading") headings += 1;
      });
      return {
        bold: ed.isActive("bold"),
        italic: ed.isActive("italic"),
        h2: ed.isActive("heading", { level: 2 }),
        h3: ed.isActive("heading", { level: 3 }),
        body: ed.isActive("paragraph"),
        bullet: ed.isActive("bulletList"),
        ordered: ed.isActive("orderedList"),
        quote: ed.isActive("blockquote"),
        pull: ed.isActive("pullQuote"),
        headings,
      };
    },
  });

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 border border-charcoal bg-charcoal-deep p-2">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleMark(editor, "bold")}
        className={btn(!!s?.bold)}
        aria-label="Bold"
        title="Bold selected words only"
      >
        B
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleMark(editor, "italic")}
        className={`${btn(!!s?.italic)} italic`}
        aria-label="Italic"
        title="Italic selected words only"
      >
        I
      </button>
      <LinkButton editor={editor} articleId={articleId} />

      <Divider />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyLineStyle(editor, "h2")}
        className={btn(!!s?.h2)}
        aria-label="Subheading large"
        title="Turn the selected line into a large subheading"
      >
        H2
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyLineStyle(editor, "h3")}
        className={btn(!!s?.h3)}
        aria-label="Subheading small"
        title="Turn the selected line into a small subheading"
      >
        H3
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyLineStyle(editor, "body")}
        className={btn(!!s?.body)}
        aria-label="Body text"
        title="Turn the selected line into normal body text"
      >
        Body
      </button>

      {(s?.headings ?? 0) > 1 && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => resetAllHeadings(editor)}
          className="focus-ring border border-accent/50 bg-accent/10 px-2.5 py-1.5 text-xs font-bold text-accent hover:bg-accent/20"
          title="Reset every gold subheading back to normal body text"
        >
          Reset headings
        </button>
      )}

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
