import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  Calendar as CalendarIcon, 
  X, 
  ChevronDown,
  Clock,
  User,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { UnifiedCalendar } from '@/lib/types';
import { SearchFilters, createDateRangeFilter } from '@/hooks/useEventSearch';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  calendars: UnifiedCalendar[];
  hasActiveFilters: boolean;
  searchStats: {
    total: number;
    filtered: number;
    bySource: { google: number; microsoft: number };
    byCalendar: Record<string, number>;
  };
}

const FilterPanel = ({
  filters,
  onFiltersChange,
  onClearFilters,
  calendars,
  hasActiveFilters,
  searchStats,
}: FilterPanelProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleCalendarToggle = (calendarId: string) => {
    const newCalendars = filters.calendars.includes(calendarId)
      ? filters.calendars.filter(id => id !== calendarId)
      : [...filters.calendars, calendarId];
    
    onFiltersChange({ calendars: newCalendars });
  };


  const handleSourceToggle = (source: 'google' | 'microsoft') => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    
    onFiltersChange({ sources: newSources });
  };

  const handleQuickDateRange = (range: 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'thisMonth' | 'nextMonth') => {
    const dateRange = createDateRangeFilter(range);
    onFiltersChange({ dateRange });
  };

  const clearDateRange = () => {
    onFiltersChange({ dateRange: {} });
  };

  const formatDateRange = () => {
    if (!filters.dateRange.start && !filters.dateRange.end) {
      return 'Any date';
    }
    
    if (filters.dateRange.start && filters.dateRange.end) {
      return `${format(filters.dateRange.start, 'MMM d')} - ${format(filters.dateRange.end, 'MMM d')}`;
    }
    
    if (filters.dateRange.start) {
      return `From ${format(filters.dateRange.start, 'MMM d')}`;
    }
    
    if (filters.dateRange.end) {
      return `Until ${format(filters.dateRange.end, 'MMM d')}`;
    }
    
    return 'Any date';
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-7 px-2"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <CardDescription>
          {searchStats.filtered} of {searchStats.total} events
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Date Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Quick Filters
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'today', label: 'Today' },
              { key: 'tomorrow', label: 'Tomorrow' },
              { key: 'thisWeek', label: 'This Week' },
              { key: 'nextWeek', label: 'Next Week' },
              { key: 'thisMonth', label: 'This Month' },
              { key: 'nextMonth', label: 'Next Month' },
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => handleQuickDateRange(key as 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'thisMonth' | 'nextMonth')}
                className="text-xs"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Custom Date Range */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Date Range
          </h3>
          <div className="flex items-center gap-2">
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal"
                >
                  {formatDateRange()}
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.dateRange.start,
                    to: filters.dateRange.end,
                  }}
                  onSelect={(range) => {
                    onFiltersChange({
                      dateRange: {
                        start: range?.from,
                        end: range?.to,
                      },
                    });
                    setIsDatePickerOpen(false);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {(filters.dateRange.start || filters.dateRange.end) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateRange}
                className="h-9 w-9 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Calendar Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4" />
            Calendars ({filters.calendars.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {calendars.map((calendar) => (
              <div key={calendar.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`calendar-${calendar.id}`}
                  checked={filters.calendars.includes(calendar.id)}
                  onCheckedChange={() => handleCalendarToggle(calendar.id)}
                />
                <Label
                  htmlFor={`calendar-${calendar.id}`}
                  className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: calendar.color }}
                  />
                  <span className="truncate">{calendar.name}</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {searchStats.byCalendar[calendar.id] || 0}
                  </Badge>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />


        <Separator />

        {/* Source Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Sources</h3>
          <div className="space-y-2">
            {[
              { key: 'google' as const, label: 'Google Calendar', color: 'blue' },
              { key: 'microsoft' as const, label: 'Microsoft Calendar', color: 'orange' },
            ].map(({ key, label, color }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`source-${key}`}
                  checked={filters.sources.includes(key)}
                  onCheckedChange={() => handleSourceToggle(key)}
                />
                <Label
                  htmlFor={`source-${key}`}
                  className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                >
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 bg-${color}-500`} />
                  <span>{label}</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {searchStats.bySource[key] || 0}
                  </Badge>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Event Type Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Event Type</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-day-only"
                checked={filters.allDayOnly === true}
                onCheckedChange={(checked) => 
                  onFiltersChange({ 
                    allDayOnly: checked ? true : undefined 
                  })
                }
              />
              <Label htmlFor="all-day-only" className="text-sm cursor-pointer">
                All-day events only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="timed-only"
                checked={filters.allDayOnly === false}
                onCheckedChange={(checked) => 
                  onFiltersChange({ 
                    allDayOnly: checked ? false : undefined 
                  })
                }
              />
              <Label htmlFor="timed-only" className="text-sm cursor-pointer">
                Timed events only
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
