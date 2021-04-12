import { useContext } from "react";
import { BoldExtension, ItalicExtension } from "remirror/extensions";
import { Remirror, useRemirror } from "@remirror/react";

import { CustomExtension } from "./extensions/custom/CustomExtension";
import { useIsOk } from "./hooks/useIsOk";
import { SomeContext } from "./some-provider";

export const Editor = () => {
  const { toggleIsOk } = useContext(SomeContext);

  const { manager, onChange, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new CustomExtension(),
    ],
    content:
      "<p><strong>I am strong.</strong> and <em>I am emphasized</em></p>",
    stringHandler: "html",
  });

  return (
    <>
      <Remirror
        manager={manager}
        onChange={onChange}
        state={state}
        hooks={[useIsOk]}
      ></Remirror>
      <button onClick={toggleIsOk}>Toggle isOk</button>
    </>
  );
};
