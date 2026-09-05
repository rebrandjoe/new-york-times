import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ArticleVideoView } from "./ArticleVideoView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    articleVideo: {
      insertArticleVideo: () => ReturnType;
    };
  }
}

export const ArticleVideo = Node.create({
  name: "articleVideo",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: { default: "" },
      caption: { default: null },
      credit: { default: null },
      description: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="article-video"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "article-video" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ArticleVideoView);
  },

  addCommands() {
    return {
      insertArticleVideo:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { url: "" } }),
    };
  },
});
