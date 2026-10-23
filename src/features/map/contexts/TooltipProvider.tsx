import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';

interface Position {
  x: number;
  y: number;
}

type TooltipContextValue = {
  updateCoord: (id: string, position: Position) => void;
  getCoord: (id: string) => Position | undefined;

  show: boolean;
  setShow: (val: boolean) => void;
};

const TooltipContext = createContext<TooltipContextValue>({
  updateCoord: (_id: string, _position: Position) => {
    // noop
  },
  getCoord: (_id: string) => {
    return undefined;
  },

  show: false,
  setShow: (_val: boolean) => {
    // noop
  }
});

function TooltipProvider({ children }: PropsWithChildren) {
  const [show, setShow] = useState(false);
  const coordMap = useRef<Map<string, Position>>(new Map());

  const getCoord = useCallback((id: string) => {
    return coordMap.current.get(id);
  }, []);

  const updateCoord = useCallback((id: string, position: Position) => {
    coordMap.current.set(id, position);
  }, []);

  const value = useMemo(
    () => ({
      show,
      setShow,
      getCoord,
      updateCoord
    }),
    [show, updateCoord, getCoord]
  );

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

export default TooltipProvider;

export const useTooltip = () => useContext(TooltipContext);
