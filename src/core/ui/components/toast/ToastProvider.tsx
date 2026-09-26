import { AnimatePresence, motion } from 'motion/react';
import {
  createContext,
  PropsWithChildren,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { createPortal } from 'react-dom';

import Toast from './Toast';
import { ShownToast, ToastConfig } from './types';

type ToastContextValue = {
  showToast: (toastConfig: ToastConfig) => void;
};

const ToastContext = createContext<ToastContextValue>({
  showToast: (_toastConfig: ToastConfig) => {
    // noop
  }
});

const OFFSET_Y = 10;

const MotionToast = motion.create(Toast);

function ToastProvider({ children }: PropsWithChildren<{}>) {
  const [mounted, setMounted] = useState(false);
  const [toasts, showToasts] = useState<ShownToast[]>([]);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  const showToast = useCallback(({ timeoutMs = 3000, ...rest }: ToastConfig) => {
    const id = crypto.randomUUID();

    showToasts((prev) => [...prev, { ...rest, id, timeoutMs }]);

    setTimeout(() => {
      showToasts((prev) => prev.filter((x) => x.id !== id));
    }, timeoutMs);
  }, []);

  const value = useMemo(
    () => ({
      showToast
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div
            id="toast-root"
            className="flex fixed top-0 w-full flex-col-reverse overflow-visible z-50"
          >
            <AnimatePresence>
              {toasts.map((toast, idx) => (
                <MotionToast
                  initial={{
                    y: -300
                  }}
                  animate={{
                    y: 0 + (toasts.length - 1 - idx) * OFFSET_Y
                  }}
                  exit={{
                    y: -300 - (toasts.length - 1 - idx)
                  }}
                  key={toast.id}
                  config={toast}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export default ToastProvider;

export const useToast = () => {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error('useToast must be used with ToastContext!');
  }

  return ctx;
};
