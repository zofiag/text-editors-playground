import React, { useCallback, useState, useMemo } from "react";

export const SomeContext = React.createContext({
  isOk: true,
  toggleIsOk: () => {},
});

export const SomeProvider: React.FC = ({ children }) => {
  const [isOk, setIsOk] = useState(true);

  const toggleIsOk = useCallback(() => {
    setIsOk((t) => !t);
  }, []);

  const value = useMemo(
    () => ({
      isOk,
      toggleIsOk,
    }),
    [isOk, toggleIsOk]
  );

  return <SomeContext.Provider value={value}>{children}</SomeContext.Provider>;
};
