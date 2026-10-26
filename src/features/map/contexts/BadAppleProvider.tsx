import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';

interface BadAppleContextValue {
  play: () => void;
  pause: () => void;
  show: boolean;
  registerAudio: (node: HTMLAudioElement | null) => void;
  setShow: (val: boolean) => void;
}

const BadAppleContext = createContext<BadAppleContextValue>({
  play: () => {
    // noop
  },
  pause: () => {
    // noop
  },
  show: false,
  registerAudio: (_node: HTMLAudioElement | null) => {},

  // noop
  setShow: (_val: boolean) => {
    // noop
  }
});

function BadAppleProvider({ children }: PropsWithChildren<{}>) {
  const [show, setShow] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const registerAudio = useCallback((node: HTMLAudioElement | null) => {
    audioRef.current = node;
  }, []);

  const play = useCallback(() => {
    audioRef?.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef?.current?.pause();
  }, []);

  const value = useMemo(
    () => ({ show, play, setShow, pause, registerAudio }),
    [show, play, registerAudio, pause]
  );

  return <BadAppleContext.Provider value={value}>{children}</BadAppleContext.Provider>;
}

export default BadAppleProvider;

export const useBadApple = () => useContext(BadAppleContext);
