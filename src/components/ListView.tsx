import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Search,
  SortAsc,
  SortDesc,
  ChevronDown,
  Filter
} from 'lucide-react';
import { UnifiedEvent, UnifiedCalendar } from '@/lib/types';
import { format, isToday, isTomorrow, isYesterday, isThisWeek, isThisMonth, addWeeks, addMonths, isSameWeek, isSameMonth } from 'date-fns';

interface ListViewProps {
  events: UnifiedEvent[];
  calendars: UnifiedCalendar[];
  loading?: boolean;
  onRefresh?: () => void;
}

type SortField = 'date' | 'title' | 'calendar' | 'duration';
type SortDirection = 'asc' | 'desc';
type DateFilter = 'all' | 'today' | 'tomorrow' | 'yesterday' | 'thisWeek' | 'nextWeek' | 'thisMonth' | 'nextMonth';

const ListView = ({ events, calendars, loading = false, onRefresh }: ListViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [selectedCalendar, setSelectedCalendar] = useState<string>('all');

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      // Search filter
      if (searchQuery) {
        const searchText = searchQuery.toLowerCase();
        const searchableText = [
          event.title,
          event.description || '',
          event.location || '',
          event.calendarName,
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchText)) {
          return false;
        }
      }

      // Calendar filter
      if (selectedCalendar !== 'all' && event.calendarId !== selectedCalendar) {
        return false;
      }

      // Date filter
      const eventDate = new Date(event.start);
      switch (dateFilter) {
        case 'today':
          return isToday(eventDate);
        case 'tomorrow':
          return isTomorrow(eventDate);
        case 'yesterday':
          return isYesterday(eventDate);
        case 'thisWeek':
          return isThisWeek(eventDate);
        case 'nextWeek':
          return isSameWeek(eventDate, addWeeks(new Date(), 1));
        case 'thisMonth':
          return isThisMonth(eventDate);
        case 'nextMonth':
          return isSameMonth(eventDate, addMonths(new Date(), 1));
        default:
          return true;
      }
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = a.start.getTime() - b.start.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'calendar':
          comparison = a.calendarName.localeCompare(b.calendarName);
          break;
        case 'duration': {
          const aDuration = a.end.getTime() - a.start.getTime();
          const bDuration = b.end.getTime() - b.start.getTime();
          comparison = aDuration - bDuration;
          break;
        }
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  const getEventColor = (event: UnifiedEvent) => {
    return event.calendarColor;
  };

  const getEventDuration = (event: UnifiedEvent) => {
    if (event.isAllDay) return 'All day';
    
    const durationMs = event.end.getTime() - event.start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 ${sortField === field ? 'bg-primary/10 text-primary' : ''}`}
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Event List</h2>
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          )}
          <div className={`text-sm px-3 py-1 rounded-full ${
            filteredAndSortedEvents.length > 0 
              ? 'text-gray-600 bg-gray-100' 
              : 'text-orange-600 bg-orange-100'
          }`}>
            {filteredAndSortedEvents.length} of {events.length} events
          </div>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <Calendar className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="thisWeek">This week</SelectItem>
                <SelectItem value="nextWeek">Next week</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="nextMonth">Next month</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Calendar Filter */}
            <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by calendar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All calendars</SelectItem>
                {calendars.map((calendar) => (
                  <SelectItem key={calendar.id} value={calendar.id}>
                    {calendar.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            <SortButton field="date">Date</SortButton>
            <SortButton field="title">Title</SortButton>
            <SortButton field="calendar">Calendar</SortButton>
            <SortButton field="duration">Duration</SortButton>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAndSortedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Date/Time Column */}
                    <div className="flex-shrink-0 w-full sm:w-32">
                      <div className="text-center sm:text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(new Date(event.start))}
                        </div>
                        {!event.isAllDay && (
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTime(event.start)}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {getEventDuration(event)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                            )}
                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                          
                          
                          {/* Description */}
                          {event.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ backgroundColor: getEventColor(event) + '20', color: getEventColor(event) }}
                          >
                            {event.calendarName}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              event.source === 'google' 
                                ? 'border-blue-500 text-blue-600 bg-blue-50' 
                                : 'border-orange-500 text-orange-600 bg-orange-50'
                            }`}
                          >
                            {event.source === 'google' ? 'Google' : 'Microsoft'}
                          </Badge>
                          {event.isAllDay && (
                            <Badge variant="outline" className="text-xs">
                              All Day
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* No Events */}
        {filteredAndSortedEvents.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedCalendar !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search or filters to see more events.'
                  : 'You don\'t have any events scheduled.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ListView;
