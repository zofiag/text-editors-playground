import { MentionAtomExtension } from "remirror/extensions";

export const useMentionExtension = () => {
  const mentionAtomExtension = new MentionAtomExtension({
    disableDecorations: false,
    matchers: [
      {
        name: "mentionAtom",
        char: "@",
        matchOffset: 0,
        mentionClassName: "mention-class-name",
        suggestClassName: "sugget-class-name",
      },
    ],
  });

  return { mentionAtomExtension };
};
