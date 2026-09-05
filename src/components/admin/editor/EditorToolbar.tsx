"use client";

import type { Editor } from "@tiptap/react";

function buttonClass(active: boolean) {
  return `focus-ring border px-2.5 py-1.5 text-sm font-semibold ${
    active ? "border-accent text-accent" : "border-charcoal text-gray-secondary-light hover:border-accent hover:text-accent"
  }`;
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-charcoal" aria-hidden="true" />;
}

/** Sticky formatting toolbar above the writing canvas — one continuous
 * surface, no per-block controls. */
export function EditorToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 border border-charcoal bg-charcoal-deep p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        aria-label="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonClass(editor.isActive("italic"))} italic`}
        aria-label="Italic"
      >
        I
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        aria-label="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        aria-label="Heading 3"
      >
        H3
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        aria-label="Bulleted list"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        aria-label="Numbered list"
      >
        1. List
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive("blockquote"))}
        aria-label="Blockquote"
      >
        “ ”
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setPullQuote().run()}
        className={buttonClass(editor.isActive("pullQuote"))}
        aria-label="Pull quote"
      >
        Pull quote
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => editor.chain().focus().insertArticleImage().run()}
        className={buttonClass(false)}
        aria-label="Insert image"
      >
        Image
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().insertArticleVideo().run()}
        className={buttonClass(false)}
        aria-label="Insert video"
      >
        Video
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={buttonClass(false)}
        aria-label="Divider"
      >
        —
      </button>

      <Divider />

      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className={buttonClass(false)}
        aria-label="Clear formatting"
      >
        Clear
      </button>
    </div>
  );
}
