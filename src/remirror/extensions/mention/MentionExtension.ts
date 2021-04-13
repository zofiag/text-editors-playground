import { MentionAtomExtension, MentionAtomOptions } from "remirror/extensions";

export const getMentionExtension = (options?: MentionAtomOptions) => {
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
    ...options,
  });

  return { mentionAtomExtension };
};
