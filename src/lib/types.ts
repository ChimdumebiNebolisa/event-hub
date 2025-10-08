// Unified event and calendar types for both Google and Microsoft calendars
import { parseGoogleCalendarDate, isValidEventDate } from './utils';

// Google Calendar API types
interface GoogleEvent {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  organizer?: {
    email: string;
    displayName?: string;
  };
  description?: string;
  htmlLink?: string;
}

// Microsoft Graph API types
interface MicrosoftEvent {
  id: string;
  subject?: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  isAllDay?: boolean;
  location?: {
    displayName?: string;
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name?: string;
    };
    status: {
      response: string;
    };
  }>;
  organizer?: {
    emailAddress: {
      address: string;
      name?: string;
    };
  };
}

export interface UnifiedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  location?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    status?: string;
  }>;
  organizer?: {
    email: string;
    name?: string;
  };
  description?: string;
  calendarId: string;
  calendarName: string;
  calendarColor: string;
  source: 'google' | 'microsoft';
  htmlLink?: string;
}

export interface UnifiedCalendar {
  id: string;
  name: string;
  color: string;
  source: 'google' | 'microsoft';
  isPrimary?: boolean;
}

export interface CalendarEventGroup {
  calendar: UnifiedCalendar;
  events: UnifiedEvent[];
}

// Helper function to convert Google Calendar event to unified format
export function convertGoogleEvent(
  event: GoogleEvent,
  calendar: { id: string; summary: string; backgroundColor?: string }
): UnifiedEvent {
  const startDate = event.start.dateTime || event.start.date;
  const endDate = event.end.dateTime || event.end.date;
  const isAllDay = !event.start.dateTime && !!event.start.date;


  // Create dates with proper validation
  let startDateTime: Date;
  let endDateTime: Date;

  try {
    // Use utility function to parse dates safely
    startDateTime = parseGoogleCalendarDate(startDate, isAllDay);
    endDateTime = parseGoogleCalendarDate(endDate, isAllDay);
    
    // For all-day events, set end time to end of day
    if (isAllDay) {
      endDateTime = new Date(endDate + 'T23:59:59');
    }

    // Validate dates using utility function
    if (!isValidEventDate(startDateTime) || !isValidEventDate(endDateTime)) {
      console.error('❌ Invalid date conversion (likely December 2018 fallback):', {
        title: event.summary,
        startDate,
        endDate,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        startValid: isValidEventDate(startDateTime),
        endValid: isValidEventDate(endDateTime)
      });
      throw new Error('Invalid date format - likely December 2018 fallback');
    }

  } catch (error) {
    console.error('❌ Date conversion failed, using fallback:', error);
    // Fallback to current date/time to prevent December 2018 issue
    const now = new Date();
    startDateTime = now;
    endDateTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
  }

  return {
    id: event.id,
    title: event.summary || 'No Title',
    start: startDateTime,
    end: endDateTime,
    isAllDay,
    ...(event.location && { location: event.location }),
    ...(event.attendees && { attendees: event.attendees.map((attendee) => ({
      email: attendee.email,
      ...(attendee.displayName && { name: attendee.displayName }),
      ...(attendee.responseStatus && { status: attendee.responseStatus }),
    })) }),
    ...(event.organizer && { organizer: {
      email: event.organizer.email,
      ...(event.organizer.displayName && { name: event.organizer.displayName }),
    } }),
    ...(event.description && { description: event.description }),
    calendarId: calendar.id,
    calendarName: calendar.summary,
    calendarColor: calendar.backgroundColor || '#4285f4',
    source: 'google' as const,
    ...(event.htmlLink && { htmlLink: event.htmlLink }),
  };
}

// Helper function to convert Microsoft Calendar event to unified format
export function convertMicrosoftEvent(
  event: MicrosoftEvent,
  calendar: { id: string; name: string; color: string }
): UnifiedEvent {

  // Create dates with proper validation
  let startDateTime: Date;
  let endDateTime: Date;

  try {
    // Microsoft Graph API returns dates in ISO format
    startDateTime = new Date(event.start.dateTime);
    endDateTime = new Date(event.end.dateTime);

    // Validate dates
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      console.error('❌ Invalid Microsoft date conversion:', {
        title: event.subject,
        startRaw: event.start.dateTime,
        endRaw: event.end.dateTime,
        startDateTime,
        endDateTime
      });
      throw new Error('Invalid Microsoft date format');
    }

  } catch (error) {
    console.error('❌ Microsoft date conversion failed, using fallback:', error);
    // Fallback to current date/time to prevent December 2018 issue
    const now = new Date();
    startDateTime = now;
    endDateTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
  }

  return {
    id: event.id,
    title: event.subject || 'No Title',
    start: startDateTime,
    end: endDateTime,
    isAllDay: event.isAllDay || false,
    ...(event.location?.displayName && { location: event.location.displayName }),
    ...(event.attendees && { attendees: event.attendees.map((attendee) => ({
      email: attendee.emailAddress.address,
      ...(attendee.emailAddress.name && { name: attendee.emailAddress.name }),
      ...(attendee.status.response && { status: attendee.status.response }),
    })) }),
    ...(event.organizer && { organizer: {
      email: event.organizer.emailAddress.address,
      ...(event.organizer.emailAddress.name && { name: event.organizer.emailAddress.name }),
    } }),
    calendarId: calendar.id,
    calendarName: calendar.name,
    calendarColor: calendar.color || '#0078d4',
    source: 'microsoft' as const,
  };
}
