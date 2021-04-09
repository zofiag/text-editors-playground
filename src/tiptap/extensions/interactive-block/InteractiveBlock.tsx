import { NodeViewWrapper } from "@tiptap/react";

export const InteractiveBlock = (props: any) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    });
  };

  return (
    <NodeViewWrapper>
      <button onClick={increase}>
        This button has been clicked {props.node.attrs.count} times.
      </button>
    </NodeViewWrapper>
  );
};
