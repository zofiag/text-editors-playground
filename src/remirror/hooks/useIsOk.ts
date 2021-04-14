import { useContext, useEffect } from "react";
import { useCommands, useKeymap } from "@remirror/react";

import { SomeContext } from "../some-provider";

export const useIsOk = () => {
  const { isOk } = useContext(SomeContext);
  const { customCommand } = useCommands();

  useEffect(() => {
    // We can trigger any extension command based on a eg value from a provider
    customCommand();
  }, [isOk, customCommand]);

  // Or listen to custom key maps!
  useKeymap("Shift-g", () => {
    alert("you hacked it!!!!");
    return true;
  });
};
