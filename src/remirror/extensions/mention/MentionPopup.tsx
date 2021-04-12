import { useMentionAtom } from "@remirror/react-hooks";

const ITEMS = [
  { id: "1", label: "Item1" },
  { id: "2", label: "Item2" },
];

export const MentionPopup = () => {
  const { getItemProps, getMenuProps, state } = useMentionAtom({
    items: ITEMS,
  });
  // const coords = (view.nodeDOM(range.from)
  //   ?.parentNode as HTMLElement).getBoundingClientRect();

  if (!state) return null;

  return (
    <div {...getMenuProps()}>
      {ITEMS.map(({ id, label }, index) => (
        <span key={id} {...getItemProps({ item: { id, label }, index })}>
          {label}
        </span>
      ))}
    </div>
  );
};
