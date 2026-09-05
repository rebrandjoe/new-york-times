import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { CmsMedia } from "@/lib/cms/types";
import { ArticleImageView } from "./ArticleImageView";

export interface ArticleImageOptions {
  media: CmsMedia[];
  onUploaded?: (media: CmsMedia) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    articleImage: {
      insertArticleImage: () => ReturnType;
    };
  }
}

export const ArticleImage = Node.create<ArticleImageOptions>({
  name: "articleImage",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return { media: [], onUploaded: undefined };
  },

  addAttributes() {
    return {
      mediaId: { default: "" },
      url: { default: "" },
      alt: { default: "" },
      caption: { default: null },
      credit: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="article-image"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "article-image" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ArticleImageView);
  },

  addCommands() {
    return {
      insertArticleImage:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { mediaId: "", url: "", alt: "" } }),
    };
  },
});
