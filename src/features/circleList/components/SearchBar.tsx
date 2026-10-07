import { RiSearchLine, RiCloseLine } from '@remixicon/react';
import { motion } from 'motion/react';

import { Button } from '@/core/ui/components/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/core/ui/components/input-group';
import { cn } from '@/core/ui/utils';

interface SearchBarProps {
  keyword: string;
  isFocused: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
}

const MotionInputGroup = motion.create(InputGroup);

function SearchBar({ keyword, isFocused, onFocus, onChange }: SearchBarProps) {
  return (
    <MotionInputGroup
      layout={'position'}
      className={cn(
        'h-12 rounded-full bg-card pointer-events-auto',
        isFocused ? 'shadow-none' : 'shadow-xl'
      )}
    >
      <InputGroupAddon className="pl-4">
        <RiSearchLine className="size-6 text-primary" />
      </InputGroupAddon>

      <InputGroupInput
        id="search-form"
        name="search-form"
        onClick={onFocus}
        placeholder="Search by Name, Code, or Fandom"
        autoComplete={'off'}
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
      />

      {isFocused && (
        <InputGroupAddon align="inline-end" className="pr-4">
          <Button variant="ghost" size="icon-lg" onClick={() => onChange('')}>
            <RiCloseLine className="size-6" />
          </Button>
        </InputGroupAddon>
      )}
    </MotionInputGroup>
  );
}

export default SearchBar;
