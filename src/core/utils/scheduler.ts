export function interactionResponse() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100); // Fallback for the case where the animation frame never fires.
    requestAnimationFrame(() => {
      setTimeout(resolve);
    });
  });
}

export async function yieldToMain(options?: SchedulerPostTaskOptions) {
  if ('scheduler' in window) {
    if (typeof scheduler?.yield === 'function') {
      return scheduler.yield();
    }

    if (typeof scheduler?.postTask === 'function') {
      return scheduler.postTask(() => {}, options);
    }
  }

  return Promise.resolve();
}

// oxlint-disable-next-line typescript/no-explicit-any
export function debounce<T extends (...args: any[]) => unknown>(
  fn: T,
  delay: number = 250
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

// oxlint-disable-next-line typescript/no-explicit-any
export function throttle<T extends (...args: any[]) => void>(fn: T, delay = 250) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timer) {
      lastArgs = args;
      return;
    }

    fn.apply(this, args);

    const schedule = () => {
      if (lastArgs) {
        fn.apply(this, lastArgs);
        lastArgs = null;
        timer = setTimeout(schedule, delay);
      } else {
        timer = null;
      }
    };

    timer = setTimeout(schedule, delay);
  };
}
