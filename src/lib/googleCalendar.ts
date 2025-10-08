// Google Calendar API helper for calendar integration
import { User } from 'firebase/auth';

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string; // For all-day events
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string; // For all-day events
    timeZone?: string;
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

export interface GoogleCalendar {
  id: string;
  summary: string;
  backgroundColor?: string;
  foregroundColor?: string;
  primary?: boolean;
}

class GoogleCalendarAPI {
  private baseUrl = 'https://www.googleapis.com/calendar/v3';

  // Get access token from localStorage (stored during sign-in)
  private async getAccessToken(user: User): Promise<string> {
    try {
      // Check if user has Google provider
      const providerData = user.providerData.find(provider => provider.providerId === 'google.com');
      if (!providerData) {
        throw new Error('Google provider not found. Please sign in with Google first.');
      }

      // Get the stored access token
      const accessToken = localStorage.getItem('google_access_token');
      if (!accessToken) {
        throw new Error('No Google access token found. Please sign out and sign in again.');
      }

      return accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to get access token. Please sign out and sign in again.');
    }
  }

  // Get user's calendars
  async getUserCalendars(user: User): Promise<GoogleCalendar[]> {
    try {
      const accessToken = await this.getAccessToken(user);
      
      const response = await fetch(`${this.baseUrl}/users/me/calendarList`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch calendars: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items.map((calendar: any) => ({
        id: calendar.id,
        summary: calendar.summary,
        backgroundColor: calendar.backgroundColor,
        foregroundColor: calendar.foregroundColor,
        primary: calendar.primary,
      }));
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw error;
    }
  }

  // Get events from a specific calendar
  async getCalendarEvents(
    user: User,
    calendarId: string = 'primary',
    startDate?: Date,
    endDate?: Date
  ): Promise<GoogleCalendarEvent[]> {
    try {
      const accessToken = await this.getAccessToken(user);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (startDate) {
        params.append('timeMin', startDate.toISOString());
      }
      if (endDate) {
        params.append('timeMax', endDate.toISOString());
      }
      params.append('singleEvents', 'true');
      params.append('orderBy', 'startTime');
      
      const queryString = params.toString();
      const url = `${this.baseUrl}/calendars/${encodeURIComponent(calendarId)}/events${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      
      
      // Filter out events that might have invalid dates
      const validEvents = data.items.filter((event: any) => {
        const startDate = event.start.dateTime || event.start.date;
        const endDate = event.end.dateTime || event.end.date;
        
        // Check if dates are valid
        const startValid = startDate && !isNaN(new Date(startDate).getTime());
        const endValid = endDate && !isNaN(new Date(endDate).getTime());
        
        if (!startValid || !endValid) {
          console.warn('⚠️ Filtering out event with invalid dates:', {
            title: event.summary,
            start: event.start,
            end: event.end,
            startValid,
            endValid
          });
          return false;
        }
        
        return true;
      });
      
      
      return validEvents.map((event: any) => ({
        id: event.id,
        summary: event.summary,
        start: event.start,
        end: event.end,
        location: event.location,
        attendees: event.attendees,
        organizer: event.organizer,
        description: event.description,
        htmlLink: event.htmlLink,
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get events from all calendars
  async getAllEvents(
    user: User,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ calendar: GoogleCalendar; events: GoogleCalendarEvent[] }[]> {
    try {
      const calendars = await this.getUserCalendars(user);
      
      // Set default date range if not provided (last 30 days to next 90 days)
      const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const defaultEndDate = endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      
      
      const calendarEvents = await Promise.all(
        calendars.map(async (calendar) => {
          try {
            const events = await this.getCalendarEvents(user, calendar.id, defaultStartDate, defaultEndDate);
            return {
              calendar,
              events,
            };
          } catch (error) {
            console.error(`Error fetching events for calendar ${calendar.summary}:`, error);
            return {
              calendar,
              events: [],
            };
          }
        })
      );

      return calendarEvents;
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const googleCalendarAPI = new GoogleCalendarAPI();
