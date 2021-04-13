import React from "react";

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
