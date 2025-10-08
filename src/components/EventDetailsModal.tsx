import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink, 
  User,
  Mail
} from 'lucide-react';
import { UnifiedEvent } from '@/lib/types';
import { format } from 'date-fns';

interface EventDetailsModalProps {
  event: UnifiedEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventDetailsModal = ({ event, open, onOpenChange }: EventDetailsModalProps) => {

  if (!event) return null;

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const handleOpenInSource = () => {
    if (event.htmlLink) {
      window.open(event.htmlLink, '_blank');
    } else if (event.source === 'google') {
      window.open('https://calendar.google.com', '_blank');
    } else if (event.source === 'microsoft') {
      window.open('https://outlook.live.com/calendar', '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {event.title}
          </DialogTitle>
          <DialogDescription>
            Event details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <div className="space-y-4">
            {/* Date and Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{formatDate(event.start)}</p>
                {!event.isAllDay && (
                  <p className="text-sm text-muted-foreground">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </p>
                )}
                {event.isAllDay && (
                  <p className="text-sm text-muted-foreground">All day event</p>
                )}
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            )}

            {/* Calendar and Source */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: event.calendarColor + '20', color: event.calendarColor }}
                >
                  {event.calendarName}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={
                    event.source === 'google' 
                      ? 'border-blue-500 text-blue-600 bg-blue-50' 
                      : 'border-orange-500 text-orange-600 bg-orange-50'
                  }
                >
                  {event.source === 'google' ? 'Google' : 'Microsoft'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />


          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Attendees ({event.attendees.length})
                </h3>
                <div className="space-y-2">
                  {event.attendees.map((attendee, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {attendee.name || attendee.email}
                        </p>
                        {attendee.name && (
                          <p className="text-sm text-muted-foreground truncate">
                            {attendee.email}
                          </p>
                        )}
                      </div>
                      {attendee.status && (
                        <Badge 
                          variant="outline" 
                          className={
                            attendee.status === 'accepted' ? 'border-green-500 text-green-600 bg-green-50' :
                            attendee.status === 'declined' ? 'border-red-500 text-red-600 bg-red-50' :
                            'border-yellow-500 text-yellow-600 bg-yellow-50'
                          }
                        >
                          {attendee.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Organizer */}
          {event.organizer && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Organizer
                </h3>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {event.organizer.name || event.organizer.email}
                    </p>
                    {event.organizer.name && (
                      <p className="text-sm text-muted-foreground truncate">
                        {event.organizer.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Description */}
          {event.description && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium">Description</h3>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleOpenInSource}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in {event.source === 'google' ? 'Google Calendar' : 'Outlook'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
