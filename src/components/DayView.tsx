import { useState } from 'react';
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
  Calendar,
  Sun,
  Moon
} from 'lucide-react';
import { UnifiedEvent, UnifiedCalendar } from '@/lib/types';
import { format, addDays, subDays, isToday, isSameDay, startOfDay, endOfDay } from 'date-fns';

interface DayViewProps {
  events: UnifiedEvent[];
  calendars: UnifiedCalendar[];
  loading?: boolean;
  onRefresh?: () => void;
}

const DayView = ({ events, calendars, loading = false, onRefresh }: DayViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter events for current day
  const dayEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return isSameDay(eventDate, currentDate);
  });

  // Sort events by start time
  const sortedEvents = dayEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Group events by time periods
  const getEventsByTimePeriod = () => {
    const morning: UnifiedEvent[] = [];
    const afternoon: UnifiedEvent[] = [];
    const evening: UnifiedEvent[] = [];
    const allDay: UnifiedEvent[] = [];

    sortedEvents.forEach(event => {
      if (event.isAllDay) {
        allDay.push(event);
      } else {
        const hour = event.start.getHours();
        if (hour < 12) {
          morning.push(event);
        } else if (hour < 17) {
          afternoon.push(event);
        } else {
          evening.push(event);
        }
      }
    });

    return { morning, afternoon, evening, allDay };
  };

  const { morning, afternoon, evening, allDay } = getEventsByTimePeriod();

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const getEventColor = (event: UnifiedEvent) => {
    return event.calendarColor;
  };

  const renderTimePeriod = (period: string, events: UnifiedEvent[], icon: React.ReactNode, bgColor: string) => {
    if (events.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className={`flex items-center gap-2 p-3 rounded-lg ${bgColor}`}>
          {icon}
          <h3 className="font-semibold text-gray-900">{period}</h3>
          <Badge variant="secondary" className="ml-auto">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              style={{ borderLeftColor: getEventColor(event), borderLeftWidth: '4px' }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">{event.title}</h4>
                    {!event.isAllDay && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(event.start)} - {formatTime(event.end)}
                        </div>
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
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
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
                
                
                {/* Description */}
                {event.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {event.description.length > 150 
                      ? `${event.description.substring(0, 150)}...` 
                      : event.description
                    }
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          {isToday(currentDate) && (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Today
            </Badge>
          )}
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          )}
          <div className={`text-sm px-3 py-1 rounded-full ${
            dayEvents.length > 0 
              ? 'text-gray-600 bg-gray-100' 
              : 'text-orange-600 bg-orange-100'
          }`}>
            {dayEvents.length} events today
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDay('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className={isToday(currentDate) ? 'bg-primary text-primary-foreground' : ''}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDay('next')}
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

      {/* Day Content */}
      {dayEvents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events scheduled
            </h3>
            <p className="text-gray-600">
              {isToday(currentDate) 
                ? "You have a free day! Enjoy your time off." 
                : `No events scheduled for ${format(currentDate, 'MMMM d, yyyy')}.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* All Day Events */}
          {allDay.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  All Day Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {allDay.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      style={{ borderLeftColor: getEventColor(event), borderLeftWidth: '4px' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          {event.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
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
                      
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Time-based Events */}
          <div className="grid lg:grid-cols-3 gap-6">
            {renderTimePeriod(
              'Morning',
              morning,
              <Sun className="w-5 h-5 text-yellow-500" />,
              'bg-yellow-50'
            )}
            {renderTimePeriod(
              'Afternoon',
              afternoon,
              <Sun className="w-5 h-5 text-orange-500" />,
              'bg-orange-50'
            )}
            {renderTimePeriod(
              'Evening',
              evening,
              <Moon className="w-5 h-5 text-purple-500" />,
              'bg-purple-50'
            )}
          </div>

          {/* No events in any time period */}
          {morning.length === 0 && afternoon.length === 0 && evening.length === 0 && allDay.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No timed events
                </h3>
                <p className="text-gray-600">
                  All events for this day are all-day events.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DayView;
