import { Spinner } from '@/core/ui/components/spinner';
import { cn } from '@/core/ui/utils';

interface MapLoaderProps {
  className?: string;
}

function MapLoader({ className }: MapLoaderProps) {
  return (
    <div
      className={cn(
        'h-screen w-screen flex flex-col items-center justify-center',
        className
      )}
    >
      <Spinner className="size-8" />
    </div>
  );
}

export default MapLoader;
