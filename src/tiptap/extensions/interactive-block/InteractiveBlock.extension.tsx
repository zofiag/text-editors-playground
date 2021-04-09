import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { InteractiveBlock } from "./InteractiveBlock";

export const InteractiveBlockExtension = Node.create({
  name: "interactiveBlock",

  group: "inline",

  inline: true,

  atom: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "interactive-block",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["interactive-block", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InteractiveBlock);
  },
});
