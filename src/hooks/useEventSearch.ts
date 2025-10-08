import { useState, useEffect, useMemo, useCallback } from 'react';
import { UnifiedEvent } from '@/lib/types';
import { useDebounce } from './useDebounce';

export interface SearchFilters {
  query: string;
  dateRange: {
    start?: Date;
    end?: Date;
  };
  calendars: string[];
  sources: ('google' | 'microsoft')[];
  allDayOnly?: boolean;
}

interface UseEventSearchResult {
  filteredEvents: UnifiedEvent[];
  searchFilters: SearchFilters;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  searchStats: {
    total: number;
    filtered: number;
    bySource: { google: number; microsoft: number };
    byCalendar: Record<string, number>;
  };
}

const defaultFilters: SearchFilters = {
  query: '',
  dateRange: {},
  calendars: [],
  sources: [],
  allDayOnly: undefined,
};

export const useEventSearch = (events: UnifiedEvent[]): UseEventSearchResult => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(defaultFilters);
  
  // Debounce the search query to avoid excessive filtering
  const debouncedQuery = useDebounce(searchFilters.query, 300);

  // Create a debounced version of the filters for search
  const debouncedFilters = useMemo(() => ({
    ...searchFilters,
    query: debouncedQuery,
  }), [searchFilters, debouncedQuery]);

  // Filter events based on search criteria
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Text search across title, description, location, and attendees
      if (debouncedFilters.query) {
        const searchText = debouncedFilters.query.toLowerCase();
        const searchableText = [
          event.title,
          event.description || '',
          event.location || '',
          event.organizer?.name || '',
          event.organizer?.email || '',
          ...(event.attendees || []).map(a => a.name || a.email || ''),
        ].join(' ').toLowerCase();

        if (!searchableText.includes(searchText)) {
          return false;
        }
      }

      // Date range filter
      if (debouncedFilters.dateRange.start && event.start < debouncedFilters.dateRange.start) {
        return false;
      }
      if (debouncedFilters.dateRange.end && event.end > debouncedFilters.dateRange.end) {
        return false;
      }

      // Calendar filter
      if (debouncedFilters.calendars.length > 0 && 
          !debouncedFilters.calendars.includes(event.calendarId)) {
        return false;
      }


      // Source filter
      if (debouncedFilters.sources.length > 0 && 
          !debouncedFilters.sources.includes(event.source)) {
        return false;
      }

      // All-day events filter
      if (debouncedFilters.allDayOnly !== undefined && 
          event.isAllDay !== debouncedFilters.allDayOnly) {
        return false;
      }

      return true;
    });
  }, [events, debouncedFilters]);

  // Calculate search statistics
  const searchStats = useMemo(() => {
    const bySource = {
      google: filteredEvents.filter(e => e.source === 'google').length,
      microsoft: filteredEvents.filter(e => e.source === 'microsoft').length,
    };

    const byCalendar: Record<string, number> = {};
    filteredEvents.forEach(event => {
      byCalendar[event.calendarId] = (byCalendar[event.calendarId] || 0) + 1;
    });


    return {
      total: events.length,
      filtered: filteredEvents.length,
      bySource,
      byCalendar,
    };
  }, [events.length, filteredEvents]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      debouncedFilters.query !== '' ||
      debouncedFilters.dateRange.start !== undefined ||
      debouncedFilters.dateRange.end !== undefined ||
      debouncedFilters.calendars.length > 0 ||
      debouncedFilters.sources.length > 0 ||
      debouncedFilters.allDayOnly !== undefined
    );
  }, [debouncedFilters]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchFilters(defaultFilters);
  }, []);

  return {
    filteredEvents,
    searchFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    searchStats,
  };
};

// Helper function to create quick date range filters
export const createDateRangeFilter = (range: 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'thisMonth' | 'nextMonth') => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (range) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    
    case 'tomorrow': {
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return {
        start: tomorrow,
        end: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    }
    
    case 'thisWeek': {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return {
        start: startOfWeek,
        end: endOfWeek,
      };
    }
    
    case 'nextWeek': {
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() - today.getDay() + 7);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      nextWeekEnd.setHours(23, 59, 59, 999);
      return {
        start: nextWeekStart,
        end: nextWeekEnd,
      };
    }
    
    case 'thisMonth': {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return {
        start: startOfMonth,
        end: endOfMonth,
      };
    }
    
    case 'nextMonth': {
      const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      nextMonthEnd.setHours(23, 59, 59, 999);
      return {
        start: nextMonthStart,
        end: nextMonthEnd,
      };
    }
    
    default:
      return {};
  }
};
