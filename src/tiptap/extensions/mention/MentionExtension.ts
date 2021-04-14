// @ts-nocheck
import Mention from "@tiptap/extension-mention";
import tippy, { GetReferenceClientRect, Tippy } from "tippy.js";
import { useEditor, EditorContent, ReactRenderer, Editor } from "@tiptap/react";
import { MENTIONABLES } from "./constants";
import { MentionList } from "./MentionList";

export const mentionExtension = Mention.configure({
  HTMLAttributes: {
    class: "mention",
  },
  suggestion: {
    items: (query) => {
      return MENTIONABLES.filter((item) =>
        item.toLowerCase().startsWith(query.toLowerCase())
      ).slice(0, 5);
    },
    render: () => {
      let reactRenderer: ReactRenderer;
      let popup: any;

      return {
        onStart: (props) => {
          reactRenderer = new ReactRenderer(MentionList as any, {
            props,
            editor: props.editor as any,
          });

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as any,
            appendTo: () => document.body,
            content: reactRenderer.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },
        onUpdate(props) {
          reactRenderer.updateProps(props);

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },
        onKeyDown(props) {
          return (reactRenderer as any).ref?.current.onKeyDown(props);
        },
        onExit() {
          popup[0].destroy();
          reactRenderer.destroy();
        },
      };
    },
  },
});
