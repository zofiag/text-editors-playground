import { ComponentType, useContext, useState } from "react";
import { command, CommandFunction } from "remirror";
import {
  ApplySchemaAttributes,
  ExtensionTag,
  NodeExtension,
  NodeExtensionSpec,
  setBlockType,
} from "@remirror/core";
import { NodeViewComponentProps, useCommands } from "@remirror/react";
import { SomeContext } from "../../some-provider";

const CustomReactPlaceholder: ComponentType<NodeViewComponentProps> = () => (
  <span>
    Set <pre>someParameter</pre> to true
  </span>
);

const CustomReactEl: ComponentType<NodeViewComponentProps> = ({
  node,
  forwardRef,
  // Utility for updating proseMirror attributes on a node
  updateAttributes,
}) => {
  // We can create a local state
  const [counter, setCounter] = useState(0);
  // We can consume contexts
  const { toggleIsOk, isOk } = useContext(SomeContext);
  // We can even trigger commands from different extensions here
  const { customCommand } = useCommands();

  return (
    <div {...node.attrs} ref={forwardRef}>
      <small>this is a value from the outer provider {`${isOk}`}</small>

      <button onClick={() => setCounter((i) => i + 1)}>
        Increase the counter: {counter}
      </button>
      <button onClick={toggleIsOk}>Add text from - CustomExtension</button>
    </div>
  );
};

export class CustomReactExtension extends NodeExtension<{
  someParameter: boolean;
}> {
  get name() {
    return "customReact" as const;
  }

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(extra: ApplySchemaAttributes): NodeExtensionSpec {
    const toDOM: NodeExtensionSpec["toDOM"] = this.options.someParameter
      ? (node) => ["span", extra.dom(node), 0]
      : undefined;

    return {
      attrs: {
        ...extra.defaults(),
        custom: { default: "custom" },
      },
      content: "inline*",
      toDOM,
    };
  }

  @command()
  toggleCustomReactBlock(): CommandFunction {
    return setBlockType(this.type, {});
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = this.options
    .someParameter
    ? CustomReactEl
    : CustomReactPlaceholder;
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      customReact: CustomReactExtension;
    }
  }
}
