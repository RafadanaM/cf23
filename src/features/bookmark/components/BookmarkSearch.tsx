import { RiSearchLine, RiCloseLine } from '@remixicon/react';
import { useState } from 'react';

import { Button } from '@/core/ui/components/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/core/ui/components/input-group';
import { cn } from '@/core/ui/utils';

interface BookmarkSearchProps {
  keyword: string;
  onChange: (value: string) => void;
}

function BookmarkSearch({ keyword, onChange }: BookmarkSearchProps) {
  const [isFocused, setIsFocus] = useState(false);

  return (
    <InputGroup
      className={cn('h-12 rounded-full bg-card pointer-events-auto mt-1 py-6 px-2')}
    >
      <InputGroupAddon>
        <RiSearchLine className="size-6 text-black" />
      </InputGroupAddon>

      <InputGroupInput
        id="bookmark-search-form"
        name="bookmark-search-form"
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsFocus(false);
          }, 0);
        }}
        placeholder="Search Circle Name"
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
    </InputGroup>
  );
}

export default BookmarkSearch;
