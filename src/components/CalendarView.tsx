import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { UnifiedEvent, UnifiedCalendar } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

interface CalendarViewProps {
  events: UnifiedEvent[];
  calendars: UnifiedCalendar[];
  loading?: boolean;
  onRefresh?: () => void;
}

const CalendarView = ({ events, calendars, loading = false, onRefresh }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');



  // Filter events for current month only
  const finalMonthEvents = events.filter(event => 
    event.start >= startOfMonth(currentDate) && 
    event.start <= endOfMonth(currentDate)
  );

  // Count events by source
  const googleEventsCount = finalMonthEvents.filter(event => event.source === 'google').length;
  const microsoftEventsCount = finalMonthEvents.filter(event => event.source === 'microsoft').length;

  // Get days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return finalMonthEvents.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date);
    });
  };

  // Get events for selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const getEventColor = (event: UnifiedEvent) => {
    return event.calendarColor;
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          {loading && (
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          )}
          <div className={`text-sm px-3 py-1 rounded-full ${
            finalMonthEvents.length > 0 
              ? 'text-gray-600 bg-gray-100' 
              : 'text-orange-600 bg-orange-100'
          }`}>
            {finalMonthEvents.length > 0 ? (
              <div className="flex items-center gap-1">
                <span>{finalMonthEvents.length} events in view</span>
                <span className="text-gray-500">
                  ({googleEventsCount > 0 && `${googleEventsCount} from Google`}
                  {googleEventsCount > 0 && microsoftEventsCount > 0 && ', '}
                  {microsoftEventsCount > 0 && `${microsoftEventsCount} from Microsoft`})
                </span>
              </div>
            ) : (
              'No events in this month'
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
            className="flex-shrink-0"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex-shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {/* Show message if no events in current month */}
                {finalMonthEvents.length === 0 && events.length > 0 && (
                  <div className="col-span-7 p-4 text-center text-gray-500 bg-yellow-50 border-b">
                    <p className="text-sm">
                      No events in {format(currentDate, 'MMMM yyyy')}. 
                      Try navigating to other months or check the console for event details.
                    </p>
                  </div>
                )}
                {days.map((day, dayIdx) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);

                  return (
                    <motion.div
                      key={day.toISOString()}
                      className={`
                        min-h-[100px] border-r border-b last:border-r-0 p-2 cursor-pointer overflow-hidden
                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                        ${isSelected ? 'bg-primary/10' : ''}
                        ${isTodayDate ? 'bg-blue-50' : ''}
                        hover:bg-gray-50 transition-colors
                      `}
                      onClick={() => setSelectedDate(day)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className={`
                        text-sm font-medium mb-1
                        ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                        ${isTodayDate ? 'text-primary font-bold' : ''}
                        ${isSelected ? 'text-primary' : ''}
                      `}>
                        {format(day, 'd')}
                      </div>
                      
                      {/* Events for this day */}
                      <div className="space-y-1">
                        <AnimatePresence>
                          {dayEvents.slice(0, 3).map((event, eventIdx) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className={`
                                text-xs p-1 rounded truncate cursor-pointer
                                ${event.isAllDay ? 'font-semibold' : ''}
                              `}
                              style={{ 
                                backgroundColor: getEventColor(event) + '20',
                                color: getEventColor(event),
                                borderLeft: `3px solid ${getEventColor(event)}`
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDate(day);
                              }}
                              whileHover={{ scale: 1.05 }}
                              title={`${event.title} - ${event.calendarName} (${event.source === 'google' ? 'Google' : 'Microsoft'})`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  event.source === 'google' ? 'bg-blue-500' : 'bg-orange-500'
                                }`} 
                                title={event.source === 'google' ? 'Google Calendar' : 'Microsoft Calendar'} />
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <span className="text-xs truncate block">
                                    {event.isAllDay ? (
                                      event.title
                                    ) : (
                                      `${formatTime(event.start)} ${event.title}`
                                    )}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 font-medium">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                        
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Panel */}
        <div className="space-y-4 min-w-0">
          {/* Selected Date Events */}
          {selectedDate && (
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{format(selectedDate, 'EEEE, MMMM d')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                        style={{ borderLeftColor: getEventColor(event), borderLeftWidth: '4px' }}
                      >
                        <div className="space-y-3">
                          {/* Event Title - Full width, prominent */}
                          <div className="mb-1">
                            <h4 className="font-semibold text-gray-900 text-base leading-tight">{event.title}</h4>
                          </div>
                          
                          {/* Badges Row - Separate from title */}
                          <div className="flex items-center gap-2 flex-wrap">
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
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 mt-3">
                          {!event.isAllDay && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </div>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                          )}
                          
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                            </div>
                          )}
                          
                          {event.description && (
                            <p className="text-sm text-gray-500 mt-2">
                              {event.description.substring(0, 100)}
                              {event.description.length > 100 && '...'}
                            </p>
                          )}
                        </div>
                        
                        {event.htmlLink && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => window.open(event.htmlLink, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open in {event.source === 'google' ? 'Google Calendar' : 'Outlook'}
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No events scheduled for this day
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Source Legend */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Event Sources</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Google Calendar</span>
                  <Badge variant="outline" className="text-xs border-blue-500 text-blue-600 bg-blue-50">
                    Google
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Microsoft Calendar</span>
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-600 bg-orange-50">
                    Microsoft
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Legend */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Calendars</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {calendars.map((calendar) => (
                  <div key={calendar.id} className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: calendar.color }}
                    />
                    <span className="text-sm font-medium truncate flex-1 min-w-0">{calendar.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs flex-shrink-0 ${
                        calendar.source === 'google' 
                          ? 'border-blue-500 text-blue-600 bg-blue-50' 
                          : 'border-orange-500 text-orange-600 bg-orange-50'
                      }`}
                    >
                      {calendar.source === 'google' ? 'Google' : 'Microsoft'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
