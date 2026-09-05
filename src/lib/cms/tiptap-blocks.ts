import type { JSONContent } from "@tiptap/react";
import type { ContentBlock } from "./blocks";

/**
 * Bridges the rich-text editor (Tiptap/ProseMirror JSON) and the storage/
 * render format (ContentBlock[]) so the public page's BlockRenderer, premium
 * truncation, word count, and the `body` column all stay exactly as they
 * are — only the admin authoring surface changes.
 */

const INLINE_PATTERN = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g;

/** "**bold** *italic* [text](url)" -> Tiptap inline text nodes with marks. */
function inlineFromText(text: string): JSONContent[] {
  if (!text) return [];
  const nodes: JSONContent[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", text: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      nodes.push({ type: "text", text: match[1], marks: [{ type: "bold" }] });
    } else if (match[2] !== undefined) {
      nodes.push({ type: "text", text: match[2], marks: [{ type: "italic" }] });
    } else if (match[3] !== undefined && match[4] !== undefined) {
      nodes.push({
        type: "text",
        text: match[3],
        marks: [{ type: "link", attrs: { href: match[4] } }],
      });
    }
    lastIndex = INLINE_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", text: text.slice(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [];
}

/** Tiptap inline text nodes -> "**bold** *italic* [text](url)" string. */
function textFromInline(content: JSONContent[] | undefined): string {
  if (!content) return "";
  return content
    .map((node) => {
      if (node.type !== "text") return "";
      const text = node.text ?? "";
      const link = node.marks?.find((m) => m.type === "link");
      if (link?.attrs?.href) return `[${text}](${link.attrs.href})`;
      if (node.marks?.some((m) => m.type === "bold")) return `**${text}**`;
      if (node.marks?.some((m) => m.type === "italic")) return `*${text}*`;
      return text;
    })
    .join("");
}

function paragraphNode(text: string): JSONContent {
  return { type: "paragraph", content: inlineFromText(text) };
}

export function blocksToTiptapDoc(blocks: ContentBlock[]): JSONContent {
  if (blocks.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  const content: JSONContent[] = blocks.map((block) => {
    switch (block.type) {
      case "paragraph":
        return paragraphNode(block.text);
      case "heading":
        return { type: "heading", attrs: { level: block.level }, content: inlineFromText(block.text) };
      case "list":
        return {
          type: block.style === "numbered" ? "orderedList" : "bulletList",
          content: block.items.map((item) => ({ type: "listItem", content: [paragraphNode(item)] })),
        };
      case "blockquote":
        return { type: "blockquote", content: [paragraphNode(block.text)] };
      case "pullquote":
        return {
          type: "pullQuote",
          attrs: { attribution: block.attribution ?? null },
          content: inlineFromText(block.text),
        };
      case "image":
        return {
          type: "articleImage",
          attrs: {
            mediaId: block.mediaId,
            url: block.url,
            alt: block.alt,
            caption: block.caption ?? null,
            credit: block.credit ?? null,
          },
        };
      case "video":
        return {
          type: "articleVideo",
          attrs: {
            url: block.url,
            caption: block.caption ?? null,
            credit: block.credit ?? null,
            description: block.description ?? null,
          },
        };
      case "divider":
        return { type: "horizontalRule" };
    }
  });

  return { type: "doc", content };
}

function listItemText(node: JSONContent): string {
  const firstChild = node.content?.[0];
  return firstChild ? textFromInline(firstChild.content) : "";
}

export function tiptapDocToBlocks(doc: JSONContent): ContentBlock[] {
  const nodes = doc.content ?? [];
  const blocks: ContentBlock[] = [];

  for (const node of nodes) {
    switch (node.type) {
      case "paragraph": {
        const text = textFromInline(node.content);
        if (text.trim()) blocks.push({ type: "paragraph", text });
        break;
      }
      case "heading": {
        const level = (node.attrs?.level as 1 | 2 | 3 | undefined) ?? 2;
        blocks.push({ type: "heading", level, text: textFromInline(node.content) });
        break;
      }
      case "bulletList":
      case "orderedList":
        blocks.push({
          type: "list",
          style: node.type === "orderedList" ? "numbered" : "bulleted",
          items: (node.content ?? []).map(listItemText),
        });
        break;
      case "blockquote":
        blocks.push({
          type: "blockquote",
          text: (node.content ?? []).map((p) => textFromInline(p.content)).join(" "),
        });
        break;
      case "pullQuote":
        blocks.push({
          type: "pullquote",
          text: textFromInline(node.content),
          attribution: (node.attrs?.attribution as string | null) || undefined,
        });
        break;
      case "articleImage":
        blocks.push({
          type: "image",
          mediaId: (node.attrs?.mediaId as string) ?? "",
          url: (node.attrs?.url as string) ?? "",
          alt: (node.attrs?.alt as string) ?? "",
          caption: (node.attrs?.caption as string | null) || undefined,
          credit: (node.attrs?.credit as string | null) || undefined,
        });
        break;
      case "articleVideo":
        blocks.push({
          type: "video",
          url: (node.attrs?.url as string) ?? "",
          caption: (node.attrs?.caption as string | null) || undefined,
          credit: (node.attrs?.credit as string | null) || undefined,
          description: (node.attrs?.description as string | null) || undefined,
        });
        break;
      case "horizontalRule":
        blocks.push({ type: "divider" });
        break;
    }
  }

  return blocks;
}
