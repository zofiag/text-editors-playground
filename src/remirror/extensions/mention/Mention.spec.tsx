import { useState } from "react";
import { pmBuild } from "jest-prosemirror";
import { renderEditor, RemirrorTestChain } from "jest-remirror";
import {
  createCoreManager,
  ItalicExtension,
  MentionAtomChangeHandler,
  MentionAtomExtension,
  MentionAtomOptions,
} from "remirror/extensions";
import { prosemirrorNodeToHtml } from "@remirror/core";
import { getMentionExtension } from "./MentionExtension";
import { AnyExtension } from "@remirror/core";
import {
  createReactManager,
  ReactComponentExtension,
  Remirror,
} from "@remirror/react";
import { act, render, fireEvent } from "@testing-library/react";
import { MentionPopup } from "./MentionPopup";
import { EditorState } from "remirror";

/**
 * Create the mention extension with an optional `onChange` handler.
 */
function create(options: MentionAtomOptions) {
  const { mentionAtomExtension: extension } = getMentionExtension(options);
  const editor = renderEditor([extension, new ItalicExtension()] as any);
  const { add, view, manager, commands } = editor;
  const { doc, p } = editor.nodes;
  const { mentionAtom } = editor.attributeNodes;

  return {
    add,
    doc,
    p,
    mentionAtom,
    view,
    manager,
    commands,
    editor,
    extension,
  };
}

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

  it("opens up a mention popup on entering a trigger", () => {
    const chain = RemirrorTestChain.create(
      createReactManager([getMentionExtension().mentionAtomExtension], {
        stringHandler: "html",
      })
    );
    const { manager, nodes, marks } = chain;
    const { doc, p } = nodes;
    const { bold, italic } = marks;

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

    // expect(chain.state.doc).toEqualRemirrorDocument(
    //   doc(p(bold(italic("This"))))
    // );
  });

  it("should create a mention node after selecting one of the suggesters", () => {
    const chain = RemirrorTestChain.create(
      createReactManager([getMentionExtension().mentionAtomExtension], {
        stringHandler: "html",
      })
    );
    const { manager, nodes, marks } = chain;
    const { mentionAtom } = chain.attributeNodes;
    const { doc, p } = nodes;
    const { bold, italic } = marks;

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

    const { getByRole, queryByRole, getAllByRole, debug } = render(<Editor />);

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
