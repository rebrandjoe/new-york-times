"use client";

import { useEditorState, type Editor } from "@tiptap/react";
import { LinkButton } from "./LinkButton";

function ToolBtn({
  active,
  onClick,
  label,
  title,
  children,
  className = "",
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
      className={`focus-ring inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2.5 text-sm font-semibold transition ${
        active
          ? "bg-accent text-black"
          : "bg-black/40 text-gray-secondary-light hover:bg-charcoal hover:text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-gray-muted">
      {children}
    </span>
  );
}

function isWholeDocumentSelected(editor: Editor): boolean {
  const { from, to, empty } = editor.state.selection;
  if (empty) return false;
  const size = editor.state.doc.content.size;
  return from <= 1 && to >= size - 1;
}

/** Apply only to the single top-level block under the cursor. */
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
  if (!state.schema.nodes.paragraph || !state.schema.nodes.heading) return;

  const caret = Math.min(Math.max($from.pos, pos + 1), pos + node.nodeSize - 2);

  if (type === "paragraph") {
    editor.chain().focus().setTextSelection(caret).setNode("paragraph").run();
    return;
  }

  if (headingLevel == null) return;
  editor
    .chain()
    .focus()
    .setTextSelection(caret)
    .setNode("heading", { level: headingLevel })
    .run();
}

function convertAllHeadingsToParagraphs(editor: Editor) {
  const headingPositions: number[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") headingPositions.push(pos);
    return false;
  });
  if (headingPositions.length === 0) return;

  let chain = editor.chain().focus();
  for (let i = headingPositions.length - 1; i >= 0; i--) {
    chain = chain.setTextSelection(headingPositions[i] + 1).setParagraph();
  }
  chain.run();
}

function currentBlockValue(editor: Editor): "body" | "h2" | "h3" | "other" {
  if (editor.isActive("heading", { level: 2 })) return "h2";
  if (editor.isActive("heading", { level: 3 })) return "h3";
  if (editor.isActive("paragraph")) return "body";
  return "other";
}

function countHeadings(editor: Editor): number {
  let n = 0;
  editor.state.doc.descendants((node) => {
    if (node.type.name === "heading") n += 1;
    return false;
  });
  return n;
}

export function EditorToolbar({ editor, articleId }: { editor: Editor; articleId?: string }) {
  // Re-render toolbar when selection / doc changes so active states stay accurate
  const editorState = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      block: currentBlockValue(ed),
      bold: ed.isActive("bold"),
      italic: ed.isActive("italic"),
      bullet: ed.isActive("bulletList"),
      ordered: ed.isActive("orderedList"),
      quote: ed.isActive("blockquote"),
      pull: ed.isActive("pullQuote"),
      headings: countHeadings(ed),
    }),
  });

  const block = editorState?.block ?? "body";
  const headingCount = editorState?.headings ?? 0;

  return (
    <div className="sticky top-0 z-10 space-y-3 border-b border-charcoal bg-[#0c0c0c] px-3 py-3 sm:px-4">
      {/* Row 1 — paragraph type (the thing that was confusing) */}
      <div>
        <GroupLabel>Line style (this line only)</GroupLabel>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={block === "other" ? "body" : block}
            onMouseDown={(e) => e.preventDefault()}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "body") setCurrentBlockType(editor, "paragraph");
              else if (v === "h2") setCurrentBlockType(editor, "heading", 2);
              else if (v === "h3") setCurrentBlockType(editor, "heading", 3);
            }}
            onClick={() => editor.chain().focus().run()}
            className="focus-ring h-9 max-w-full rounded-md border border-charcoal bg-black px-3 text-sm text-offwhite"
            title="Changes only the line where your cursor is"
          >
            <option value="body">Body text (normal)</option>
            <option value="h2">Subheading (large)</option>
            <option value="h3">Subheading (small)</option>
          </select>

          {headingCount > 0 && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => convertAllHeadingsToParagraphs(editor)}
              className="focus-ring h-9 rounded-md border border-accent/50 bg-accent/10 px-3 text-xs font-bold text-accent hover:bg-accent/20"
              title="Turn every subheading back into normal body text"
            >
              Reset all subheadings ({headingCount})
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-gray-muted">
          Put the cursor on one line, then choose Body or Subheading. Does not change the rest of the article.
        </p>
      </div>

      {/* Row 2 — text marks + structure + insert */}
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <div>
          <GroupLabel>Selected words</GroupLabel>
          <div className="flex items-center gap-1">
            <ToolBtn
              active={!!editorState?.bold}
              onClick={() => {
                if (isWholeDocumentSelected(editor)) return;
                editor.chain().focus().toggleBold().run();
              }}
              label="Bold"
              title="Bold selected words only"
              className="font-extrabold"
            >
              B
            </ToolBtn>
            <ToolBtn
              active={!!editorState?.italic}
              onClick={() => {
                if (isWholeDocumentSelected(editor)) return;
                editor.chain().focus().toggleItalic().run();
              }}
              label="Italic"
              title="Italic selected words only"
              className="italic"
            >
              I
            </ToolBtn>
            <LinkButton editor={editor} articleId={articleId} />
            <ToolBtn
              onClick={() => {
                if (isWholeDocumentSelected(editor)) return;
                editor.chain().focus().unsetAllMarks().run();
              }}
              label="Clear formatting"
              title="Remove bold/italic/link from selection"
            >
              Clear
            </ToolBtn>
          </div>
        </div>

        <div>
          <GroupLabel>Lists</GroupLabel>
          <div className="flex items-center gap-1">
            <ToolBtn
              active={!!editorState?.bullet}
              onClick={() => {
                if (isWholeDocumentSelected(editor)) return;
                editor.chain().focus().toggleBulletList().run();
              }}
              label="Bullet list"
            >
              • List
            </ToolBtn>
            <ToolBtn
              active={!!editorState?.ordered}
              onClick={() => {
                if (isWholeDocumentSelected(editor)) return;
                editor.chain().focus().toggleOrderedList().run();
              }}
              label="Numbered list"
            >
              1. List
            </ToolBtn>
          </div>
        </div>

        <div>
          <GroupLabel>Insert</GroupLabel>
          <div className="flex flex-wrap items-center gap-1">
            <ToolBtn
              active={!!editorState?.quote}
              onClick={() => {
                if (isWholeDocumentSelected(editor)) return;
                editor.chain().focus().toggleBlockquote().run();
              }}
              label="Quote"
            >
              Quote
            </ToolBtn>
            <ToolBtn
              active={!!editorState?.pull}
              onClick={() => editor.chain().focus().setPullQuote().run()}
              label="Pull quote"
            >
              Pull quote
            </ToolBtn>
            <ToolBtn
              onClick={() => editor.chain().focus().insertArticleImage().run()}
              label="Image"
            >
              Image
            </ToolBtn>
            <ToolBtn
              onClick={() => editor.chain().focus().insertArticleVideo().run()}
              label="Video"
            >
              Video
            </ToolBtn>
            <ToolBtn
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              label="Divider"
            >
              —
            </ToolBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
