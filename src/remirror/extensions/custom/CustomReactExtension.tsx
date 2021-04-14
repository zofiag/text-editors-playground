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
}) => {
  const [counter, setCounter] = useState(0);
  const { customCommand } = useCommands();
  const { toggleIsOk, isOk } = useContext(SomeContext);

  return (
    <div {...node.attrs} ref={forwardRef}>
      <small>this is {`${isOk}`}</small>

      <button onClick={() => setCounter((i) => i + 1)}>
        Click me to increase the counter: {counter}
      </button>
      <button onClick={toggleIsOk}>custom command</button>
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
