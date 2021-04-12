import { useContext, useEffect } from "react";
import { useCommands } from "@remirror/react";

import { SomeContext } from "../some-provider";

export const useIsOk = () => {
  const { isOk } = useContext(SomeContext);
  const { customCommand } = useCommands();

  console.log("is it working", isOk);

  useEffect(() => {
    customCommand();
  }, [isOk, customCommand]);
};
