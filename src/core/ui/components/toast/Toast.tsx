import { Ref } from 'react';
import { ShownToast } from './types';

interface ToastProps {
  ref?: Ref<HTMLDivElement>;
  config: ShownToast;
}

function Toast({ config, ref }: ToastProps) {
  return (
    <div
      ref={ref}
      className="absolute flex top-12 left-1/2 -translate-x-1/2 w-5/6 max-w-2xs min-h-12 bg-card rounded-md shadow-2xl border border-muted-foreground p-1.5"
    >
      <div className="flex-1 flex flex-col gap-1">
        <p className="font-semibold text-sm">{config.title}</p>

        {!!config.description && (
          <p className="font-medium text-xs text-muted-foreground">
            {config.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default Toast;
