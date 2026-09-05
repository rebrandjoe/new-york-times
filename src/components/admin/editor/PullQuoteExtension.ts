import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { PullQuoteView } from "./PullQuoteView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pullQuote: {
      setPullQuote: () => ReturnType;
    };
  }
}

export const PullQuote = Node.create({
  name: "pullQuote",
  group: "block",
  content: "inline*",
  marks: "bold italic link",
  defining: true,

  addAttributes() {
    return {
      attribution: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'blockquote[data-type="pull-quote"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["blockquote", mergeAttributes(HTMLAttributes, { "data-type": "pull-quote" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PullQuoteView);
  },

  addCommands() {
    return {
      setPullQuote:
        () =>
        ({ commands }) =>
          commands.setNode(this.name),
    };
  },
});
