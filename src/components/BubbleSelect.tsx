
import { cn } from '@/lib/utils';

interface BubbleSelectProps {
  label: string;
  options: string[];
  selectedValue: string | string[] | null;
  onSelect: (value: string) => void;
  isMultiSelect?: boolean;
  maxSelections?: number;
}

const BubbleSelect: React.FC<BubbleSelectProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  isMultiSelect = false,
  maxSelections,
}) => {
  const handleSelect = (option: string) => {
    if (isMultiSelect && Array.isArray(selectedValue)) {
      if (selectedValue.includes(option)) {
        onSelect(option); // This will trigger removal in parent
      } else if (maxSelections === undefined || selectedValue.length < maxSelections) {
        onSelect(option); // This will trigger addition in parent
      }
    } else {
      onSelect(option);
    }
  };

  return (
    <div className="mb-6 animate-fade-in">
      <h3 className="text-lg font-medium mb-3 text-foreground">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = isMultiSelect && Array.isArray(selectedValue)
            ? selectedValue.includes(option)
            : selectedValue === option;
          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out border-2',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-105'
                  : 'bg-secondary text-secondary-foreground border-secondary hover:bg-primary/80 hover:text-primary-foreground hover:border-primary/80',
                (isMultiSelect && Array.isArray(selectedValue) && maxSelections !== undefined && selectedValue.length >= maxSelections && !isActive)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              )}
              disabled={isMultiSelect && Array.isArray(selectedValue) && maxSelections !== undefined && selectedValue.length >= maxSelections && !isActive}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isMultiSelect && maxSelections && (
        <p className="text-xs text-muted-foreground mt-1">
          Select up to {maxSelections} interests. (Selected: {Array.isArray(selectedValue) ? selectedValue.length : 0}/{maxSelections})
        </p>
      )}
    </div>
  );
};

export default BubbleSelect;
