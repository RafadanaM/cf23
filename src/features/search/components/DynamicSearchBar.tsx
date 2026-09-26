import { motion } from 'motion/react';
import { ComponentProps } from 'react';

import { Button } from '@/core/ui/components/button';
import { cn } from '@/core/ui/utils';

import SearchBar from './SearchBar';

interface DynamicSearchBarProps extends ComponentProps<typeof SearchBar> {
  onClose: () => void;
}

const MotionButton = motion.create(Button);

function DynamicSearchBar({
  keyword,
  isFocused,
  onChange,
  onClose,
  onFocus
}: DynamicSearchBarProps) {
  return (
    <div
      className={cn(
        'fixed flex flex-col items-center gap-2 top-0 left-0 right-0 p-4 transition-colors',
        isFocused ? 'bg-card shadow-xl' : 'bg-card/0 pointer-events-none'
      )}
    >
      <h1
        className={cn(
          '-mt-1.5 text-center self-center font-semibold text-white bg-primary py-1 px-3 rounded-full shadow-2xl shadow-primary',
          isFocused ? 'hidden' : 'flex'
        )}
      >
        {'CF 22 Interactive Map'}
      </h1>
      <div className="flex items-center gap-2 w-full max-w-2xl">
        <SearchBar
          keyword={keyword}
          isFocused={isFocused}
          onChange={onChange}
          onFocus={onFocus}
        />
        {isFocused && (
          <MotionButton
            variant="ghost"
            key="button"
            className="origin-right text-primary font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {'Cancel'}
          </MotionButton>
        )}
      </div>
    </div>
  );
}

export default DynamicSearchBar;
