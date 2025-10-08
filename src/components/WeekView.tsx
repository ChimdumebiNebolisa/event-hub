import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users,
  Calendar
} from 'lucide-react';
import { UnifiedEvent, UnifiedCalendar } from '@/lib/types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, isToday, addDays, isSameWeek } from 'date-fns';

interface WeekViewProps {
  events: UnifiedEvent[];
  calendars: UnifiedCalendar[];
  loading?: boolean;
  onRefresh?: () => void;
}

const WeekView = ({ events, calendars, loading = false, onRefresh }: WeekViewProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get the start and end of the current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Sunday start
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  
  // Get all days in the week
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter events for current week
  const weekEvents = events.filter(event => 
    event.start >= weekStart && event.start <= weekEnd
  );

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return weekEvents.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date);
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const getEventColor = (event: UnifiedEvent) => {
    return event.calendarColor;
  };

  // Group events by hour for better display
  const getEventsByHour = (dateEvents: UnifiedEvent[]) => {
    const hourlyEvents: { [hour: number]: UnifiedEvent[] } = {};
    
    dateEvents.forEach(event => {
      const hour = event.start.getHours();
      if (!hourlyEvents[hour]) {
        hourlyEvents[hour] = [];
      }
      hourlyEvents[hour].push(event);
    });
    
    return hourlyEvents;
  };

  // Generate time slots (6 AM to 11 PM)
  const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6);

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h2>
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          )}
          <div className={`text-sm px-3 py-1 rounded-full ${
            weekEvents.length > 0 
              ? 'text-gray-600 bg-gray-100' 
              : 'text-orange-600 bg-orange-100'
          }`}>
            {weekEvents.length} events this week
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className={isSameWeek(new Date(), currentWeek) ? 'bg-primary text-primary-foreground' : ''}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <Calendar className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>

      {/* Week Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            {/* Time column header */}
            <div className="p-3 text-center text-sm font-medium text-gray-500 border-r">
              Time
            </div>
            {/* Day headers */}
            {weekDays.map(day => (
              <div 
                key={day.toISOString()} 
                className={`p-3 text-center text-sm font-medium border-r last:border-r-0 cursor-pointer transition-colors ${
                  isToday(day) 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div>{format(day, 'EEE')}</div>
                <div className="text-lg">{format(day, 'd')}</div>
              </div>
            ))}
          </div>

          {/* Time slots and events */}
          <div className="grid grid-cols-8">
            {timeSlots.map(hour => {
              const hourEvents: { [dayIndex: number]: UnifiedEvent[] } = {};
              
              // Group events by day for this hour
              weekDays.forEach((day, dayIndex) => {
                const dayEvents = getEventsForDate(day);
                hourEvents[dayIndex] = dayEvents.filter(event => 
                  event.start.getHours() === hour || 
                  (event.isAllDay && hour === 6) // Show all-day events at 6 AM
                );
              });

              const hasEvents = Object.values(hourEvents).some(events => events.length > 0);

              return (
                <div key={hour} className={`grid grid-cols-8 border-b last:border-b-0 ${
                  hasEvents ? 'bg-blue-50/30' : ''
                }`}>
                  {/* Time label */}
                  <div className="p-2 text-xs text-gray-500 border-r flex items-center justify-center">
                    {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                  </div>
                  
                  {/* Day columns */}
                  {weekDays.map((day, dayIndex) => {
                    const dayEvents = hourEvents[dayIndex] || [];
                    
                    return (
                      <div 
                        key={dayIndex}
                        className="min-h-[60px] border-r last:border-r-0 p-1 relative"
                      >
                        <AnimatePresence>
                          {dayEvents.map((event, eventIndex) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className={`text-xs p-1 rounded cursor-pointer mb-1 ${
                                event.isAllDay ? 'font-semibold' : ''
                              }`}
                              style={{ 
                                backgroundColor: getEventColor(event) + '20',
                                color: getEventColor(event),
                                borderLeft: `3px solid ${getEventColor(event)}`
                              }}
                              onClick={() => setSelectedDate(day)}
                              title={`${event.title} - ${event.calendarName}`}
                            >
                              <div className="flex items-center gap-1 min-w-0">
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  event.source === 'google' ? 'bg-blue-500' : 'bg-orange-500'
                                }`} />
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <div className="truncate">
                                    {event.isAllDay ? (
                                      event.title
                                    ) : (
                                      `${formatTime(event.start)} ${event.title}`
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    style={{ borderLeftColor: getEventColor(event), borderLeftWidth: '4px' }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-2">
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
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {!event.isAllDay && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.attendees.length}
                          </div>
                        )}
                      </div>
                      
                    </div>
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
    </div>
  );
};

export default WeekView;
