import { useState } from "react";
import { pmBuild } from "jest-prosemirror";
import { renderEditor, RemirrorTestChain } from "jest-remirror";
import {
  createCoreManager,
  ItalicExtension,
  MentionAtomOptions,
} from "remirror/extensions";
import { prosemirrorNodeToHtml } from "@remirror/core";
import { getMentionExtension } from "./MentionExtension";
import { createReactManager, Remirror } from "@remirror/react";
import { act, render, fireEvent } from "@testing-library/react";
import { MentionPopup } from "./MentionPopup";
import { EditorState } from "remirror";

describe("Mention", () => {
  const { schema } = createCoreManager([
    getMentionExtension().mentionAtomExtension,
  ]);
  const attributes = { id: "test", label: "test", name: "testing" };

  const { mentionAtom, p } = pmBuild(schema, {
    mentionAtom: { nodeType: "mentionAtom", ...attributes },
  });

  it("creates the correct dom node", () => {
    expect(
      prosemirrorNodeToHtml(p(mentionAtom(attributes.label)))
    ).toMatchInlineSnapshot(
      `<p><span class="mention-atom mention-atom-testing" data-mention-atom-id="test" data-mention-atom-name="testing">test</span></p>`
    );
  });

  it("toggles a mention popup on entering/removing a trigger character", () => {
    const chain = RemirrorTestChain.create(
      createReactManager([getMentionExtension().mentionAtomExtension], {
        stringHandler: "html",
      })
    );
    const { manager } = chain;

    const Editor = () => {
      const [value, setValue] = useState<EditorState>(
        manager.createState({
          content: "",
        })
      );

      return (
        <Remirror
          state={value}
          manager={manager}
          onChange={(changeProps) => {
            const { state } = changeProps;
            setValue(state);
          }}
        >
          <MentionPopup />
        </Remirror>
      );
    };

    const { getByRole, queryByRole } = render(<Editor />);

    act(() => {
      chain.commands.insertText("@");
    });

    expect(getByRole("menu")).toBeInTheDocument();

    act(() => {
      chain.commands.undo();
    });

    expect(queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should create a mention node after selecting one of the suggesters", () => {
    const chain = RemirrorTestChain.create(
      createReactManager([getMentionExtension().mentionAtomExtension], {
        stringHandler: "html",
      })
    );
    const { manager, nodes } = chain;
    const { mentionAtom } = chain.attributeNodes;
    const { p } = nodes;

    const Editor = () => {
      const [value, setValue] = useState<EditorState>(
        manager.createState({
          content: "",
        })
      );

      return (
        <Remirror
          state={value}
          manager={manager}
          onChange={(changeProps) => {
            const { state } = changeProps;
            setValue(state);
          }}
        >
          <MentionPopup />
        </Remirror>
      );
    };

    const { getByRole, getAllByRole } = render(<Editor />);

    act(() => {
      chain.commands.insertText("@");
    });

    expect(getByRole("menu")).toBeInTheDocument();

    act(() => {
      fireEvent.click(getAllByRole("menuitemradio")[0]);
    });

    const mention = mentionAtom({
      id: "1",
      label: "Item1",
      name: "mentionAtom",
    })();

    expect(chain.state).toContainRemirrorDocument(p(mention, " "));
  });
});
