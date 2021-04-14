import { useContext } from "react";
import { BoldExtension, ItalicExtension } from "remirror/extensions";
import {
  Remirror,
  useRemirror,
  EditorComponent,
  useCommands,
} from "@remirror/react";

import { useIsOk } from "./hooks/useIsOk";
import { SomeContext, SomeProvider } from "./some-provider";

import { CustomExtension } from "./extensions/custom/CustomExtension";
import { getMentionExtension } from "./extensions/mention/MentionExtension";
import { MentionPopup } from "./extensions/mention/MentionPopup";
import { CustomReactExtension } from "./extensions/custom/CustomReactExtension";

const EditorInner = () => {
  const { toggleIsOk } = useContext(SomeContext);
  const { toggleCustomReactBlock } = useCommands();

  return (
    <>
      <EditorComponent />
      <button onClick={toggleIsOk}>Add text from - CustomExtension</button>
      <button onClick={toggleCustomReactBlock}>
        Add node from - CustomReactExtension
      </button>
      <MentionPopup />
    </>
  );
};

export const Editor = () => {
  const { mentionAtomExtension } = getMentionExtension();

  const { manager, onChange, state } = useRemirror({
    extensions: () => [
      mentionAtomExtension,
      new BoldExtension(),
      new ItalicExtension(),
      new CustomExtension(),
      new CustomReactExtension({ someParameter: true }),
    ],
    content:
      "<p><strong>I am strong.</strong> and <em>I am emphasized</em></p>",
    stringHandler: "html",
  });

  return (
    <>
      <SomeProvider>
        <Remirror
          manager={manager}
          onChange={onChange}
          state={state}
          hooks={[useIsOk]}
        >
          <EditorInner />
        </Remirror>
      </SomeProvider>
    </>
  );
};
