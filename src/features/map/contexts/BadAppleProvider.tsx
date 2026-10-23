import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

interface BadAppleContextValue {
  play: boolean;
  show: boolean;
  setPlay: (val: boolean) => void;
  setShow: (val: boolean) => void;
}

const BadAppleContext = createContext<BadAppleContextValue>({
  play: false,
  show: false,
  setShow: (_val: boolean) => {
    // noop
  },
  setPlay: (_val: boolean) => {
    // noop
  }
});

function BadAppleProvider({ children }: PropsWithChildren<{}>) {
  const [show, setShow] = useState(false);
  const [play, setPlay] = useState(false);

  const value = useMemo(() => ({ show, play, setShow, setPlay }), [show, play]);

  return <BadAppleContext.Provider value={value}>{children}</BadAppleContext.Provider>;
}

export default BadAppleProvider;

export const useBadApple = () => useContext(BadAppleContext);
