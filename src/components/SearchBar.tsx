import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSearchPerformed?: (term: string, resultsCount: number) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  onClear,
  onSearchPerformed,
  placeholder = "Search events...",
  className,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchValue = useDebounce(inputValue, 500);

  // Sync inputValue with prop value when it changes externally
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Track search when debounced value changes
  useEffect(() => {
    if (debouncedSearchValue && onSearchPerformed) {
      // Note: resultsCount should be passed from parent component
      // For now we'll trigger without count, parent can call trackSearch with actual count
      onSearchPerformed(debouncedSearchValue, 0);
    }
  }, [debouncedSearchValue, onSearchPerformed]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue); // Update local state immediately for visual feedback
    onChange(newValue); // Update parent state (which will be debounced)
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="pl-12 pr-16 h-11 text-base font-medium border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 rounded-full"
          onClick={() => {
            setInputValue('');
            onClear();
          }}
        >
          <X className="w-4 h-4 text-gray-500" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
