import DayFilter from './DayFilter';
import HighlightBookmarkToggle from './HighlightBookmarkToggle';

function MapConfigs() {
  return (
    <div className="fixed flex items-center gap-2 left-1/2 -translate-x-[calc(50%-0.25rem-1rem)] top-28">
      <DayFilter />
      <HighlightBookmarkToggle />
    </div>
  );
}

export default MapConfigs;
