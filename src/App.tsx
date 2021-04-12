import React from "react";
import logo from "./logo.svg";

import { Tiptap } from "./tiptap/editor";
import { SomeProvider } from "./remirror/some-provider";
import { Editor as RemirrorEditor } from "./remirror/editor";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SomeProvider>
        <RemirrorEditor />
      </SomeProvider>
    </div>
  );
}

export default App;
