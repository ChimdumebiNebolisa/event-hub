import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, Clock, History } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
  recentSearches?: string[];
  onRecentSearchSelect?: (search: string) => void;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search events...",
  className,
  recentSearches = [],
  onRecentSearchSelect,
  suggestions = [],
  onSuggestionSelect,
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [...recentSearches, ...suggestions];
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < allItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev > 0 ? prev - 1 : allItems.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < allItems.length) {
        const selectedItem = allItems[focusedIndex];
        if (focusedIndex < recentSearches.length) {
          onRecentSearchSelect?.(selectedItem);
        } else {
          onSuggestionSelect?.(selectedItem);
        }
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Open popover when user starts typing
    if (newValue && !isOpen) {
      setIsOpen(true);
    }
    
    // Reset focused index when typing
    setFocusedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string, isRecent: boolean = false) => {
    if (isRecent) {
      onRecentSearchSelect?.(suggestion);
    } else {
      onSuggestionSelect?.(suggestion);
    }
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) &&
    !recentSearches.includes(suggestion)
  );

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              ref={inputRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className="pl-12 pr-16 h-11 text-base font-medium border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
            {value && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 rounded-full"
                onClick={onClear}
              >
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            )}
          </div>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-full p-0 shadow-xl border border-gray-200 rounded-lg" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command>
            <CommandList>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <CommandGroup heading="Recent Searches">
                  {recentSearches.slice(0, 5).map((search, index) => (
                    <CommandItem
                      key={`recent-${search}`}
                      value={search}
                      onSelect={() => handleSuggestionClick(search, true)}
                      className={cn(
                        "flex items-center gap-2",
                        focusedIndex === index && "bg-accent"
                      )}
                    >
                      <History className="w-4 h-4 text-muted-foreground" />
                      <span>{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Suggestions */}
              {filteredSuggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {filteredSuggestions.slice(0, 10).map((suggestion, index) => {
                    const adjustedIndex = index + recentSearches.length;
                    return (
                      <CommandItem
                        key={`suggestion-${suggestion}`}
                        value={suggestion}
                        onSelect={() => handleSuggestionClick(suggestion, false)}
                        className={cn(
                          "flex items-center gap-2",
                          focusedIndex === adjustedIndex && "bg-accent"
                        )}
                      >
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <span>{suggestion}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {/* No results */}
              {recentSearches.length === 0 && filteredSuggestions.length === 0 && (
                <CommandEmpty>
                  <div className="text-center py-4">
                    <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No recent searches or suggestions
                    </p>
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Keyboard shortcut hint */}
      {!value && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Badge variant="outline" className="text-xs px-2 py-1 bg-background/90 border-gray-300 text-gray-600">
            ⌘K
          </Badge>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
