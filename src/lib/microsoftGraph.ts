// Microsoft Graph API helper for calendar integration
import { User } from 'firebase/auth';

export interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  attendees?: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
    status: {
      response: string;
    };
  }>;
  isAllDay?: boolean;
  organizer?: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
}

export interface Calendar {
  id: string;
  name: string;
  color: string;
  isDefaultCalendar: boolean;
}

class MicrosoftGraphAPI {
  private baseUrl = 'https://graph.microsoft.com/v1.0';

  // Get access token from localStorage (stored during sign-in)
  private async getAccessToken(user: User): Promise<string> {
    try {
      // Check if user has Microsoft provider
      const providerData = user.providerData.find(provider => provider.providerId === 'microsoft.com');
      if (!providerData) {
        throw new Error('Microsoft account not linked. Please link your Microsoft account first to access calendar data.');
      }

      // Get the stored access token
      const accessToken = localStorage.getItem('microsoft_access_token');
      if (!accessToken) {
        throw new Error('Microsoft access token not found. Please sign out and sign in again to refresh your access.');
      }

      console.log('Microsoft access token found:', accessToken.substring(0, 20) + '...');

      // Check if token is expired (basic check - tokens typically last 1 hour)
      try {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        console.log('Token expiration check:', {
          exp: tokenData.exp,
          currentTime,
          isExpired: tokenData.exp && tokenData.exp < currentTime,
          scopes: tokenData.scp || tokenData.scope
        });
        
        if (tokenData.exp && tokenData.exp < currentTime) {
          console.warn('Microsoft access token appears to be expired');
          throw new Error('Microsoft access token has expired. Please sign out and sign in again.');
        }
      } catch (parseError) {
        console.warn('Could not parse Microsoft access token for expiration check:', parseError);
        // Continue with the token anyway, let the API call fail if it's invalid
      }

      return accessToken;
    } catch (error) {
      console.error('Error getting Microsoft access token:', error);
      throw error;
    }
  }

  // Get user's calendars
  async getUserCalendars(user: User): Promise<Calendar[]> {
    try {
      const accessToken = await this.getAccessToken(user);
      
      const response = await fetch(`${this.baseUrl}/me/calendars`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Microsoft Graph API response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Microsoft Graph API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          url: `${this.baseUrl}/me/calendars`
        });
        
        if (response.status === 401) {
          throw new Error(`Microsoft access token is invalid or expired. Error: ${errorData.error?.message || 'Unauthorized'}. Please sign out and sign in again.`);
        } else if (response.status === 403) {
          throw new Error(`Insufficient permissions to access Microsoft calendars. Error: ${errorData.error?.message || 'Forbidden'}. Please ensure the app has calendar access permissions.`);
        } else if (response.status === 429) {
          throw new Error('Too many requests to Microsoft Graph API. Please wait a moment and try again.');
        } else {
          throw new Error(`Failed to fetch calendars: ${errorData.error?.message || response.statusText} (${response.status})`);
        }
      }

      const data = await response.json();
      return data.value.map((calendar: any) => ({
        id: calendar.id,
        name: calendar.name,
        color: calendar.color,
        isDefaultCalendar: calendar.isDefaultCalendar,
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
  ): Promise<CalendarEvent[]> {
    try {
      const accessToken = await this.getAccessToken(user);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (startDate) {
        params.append('startDateTime', startDate.toISOString());
      }
      if (endDate) {
        params.append('endDateTime', endDate.toISOString());
      }
      
      const queryString = params.toString();
      const url = `${this.baseUrl}/me/calendars/${calendarId}/events${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Microsoft Graph API error (events):', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          calendarId
        });
        
        if (response.status === 401) {
          throw new Error('Microsoft access token is invalid or expired. Please sign out and sign in again.');
        } else if (response.status === 403) {
          throw new Error('Insufficient permissions to access Microsoft calendar events. Please ensure the app has calendar access permissions.');
        } else if (response.status === 404) {
          throw new Error(`Calendar not found. The calendar with ID '${calendarId}' may have been deleted or you may not have access to it.`);
        } else if (response.status === 429) {
          throw new Error('Too many requests to Microsoft Graph API. Please wait a moment and try again.');
        } else {
          throw new Error(`Failed to fetch events: ${response.statusText} (${response.status})`);
        }
      }

      const data = await response.json();
      return data.value.map((event: any) => ({
        id: event.id,
        subject: event.subject,
        start: event.start,
        end: event.end,
        location: event.location,
        attendees: event.attendees,
        isAllDay: event.isAllDay,
        organizer: event.organizer,
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
  ): Promise<{ calendar: Calendar; events: CalendarEvent[] }[]> {
    try {
      const calendars = await this.getUserCalendars(user);
      
      const calendarEvents = await Promise.all(
        calendars.map(async (calendar) => {
          const events = await this.getCalendarEvents(user, calendar.id, startDate, endDate);
          return {
            calendar,
            events,
          };
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
export const microsoftGraphAPI = new MicrosoftGraphAPI();
