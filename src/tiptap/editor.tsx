import { useEditor, EditorContent } from "@tiptap/react";
import { defaultExtensions } from "@tiptap/starter-kit";

import { InteractiveBlockExtension } from "./extensions/interactive-block/InteractiveBlock.extension";

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [...defaultExtensions(), InteractiveBlockExtension],
    content: `<p>Hello World! 🌎️</p><interactive-block count="0"></interactive-block>`,
  });

  return <EditorContent editor={editor} />;
};
