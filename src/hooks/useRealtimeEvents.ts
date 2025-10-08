import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where, 
  limit,
  Unsubscribe,
  writeBatch,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UnifiedEvent, UnifiedCalendar } from '@/lib/types';
import { googleCalendarAPI } from '@/lib/googleCalendar';
import { microsoftGraphAPI } from '@/lib/microsoftGraph';
import { convertGoogleEvent, convertMicrosoftEvent } from '@/lib/types';
import { toast } from 'sonner';

// Extended event interface for Firestore storage
export interface StoredEvent extends UnifiedEvent {
  id: string;
  userId: string;
  lastSyncAt: Date;
  syncStatus: 'synced' | 'pending' | 'error';
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RealtimeEventState {
  events: UnifiedEvent[];
  calendars: UnifiedCalendar[];
  loading: boolean;
  error: string | null;
  lastSyncTime: Date | null;
  syncInProgress: boolean;
  offlineEvents: StoredEvent[];
}

export interface RealtimeEventActions {
  refreshEvents: () => Promise<void>;
  addEvent: (event: Partial<UnifiedEvent>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<UnifiedEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  syncOfflineEvents: () => Promise<void>;
  clearError: () => void;
}

export const useRealtimeEvents = (user: User | null): RealtimeEventState & RealtimeEventActions => {
  const [state, setState] = useState<RealtimeEventState>({
    events: [],
    calendars: [],
    loading: true,
    error: null,
    lastSyncTime: null,
    syncInProgress: false,
    offlineEvents: [],
  });

  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time listener for stored events
  const setupRealtimeListener = useCallback(() => {
    if (!user) return;

    const eventsRef = collection(db, 'users', user.uid, 'events');
    const q = query(
      eventsRef,
      orderBy('start', 'asc')
    );

    unsubscribeRef.current = onSnapshot(
      q,
      (snapshot) => {
        const events: UnifiedEvent[] = [];
        const offlineEvents: StoredEvent[] = [];

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const eventData = {
            id: doc.id,
            ...data,
            start: data.start?.toDate() || new Date(),
            end: data.end?.toDate() || new Date(),
            lastSyncAt: data.lastSyncAt?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as StoredEvent;

          console.log('📋 Event from Firestore:', {
            id: eventData.id,
            title: eventData.title,
            syncStatus: eventData.syncStatus,
            source: eventData.source
          });

          if (eventData.syncStatus === 'pending' || eventData.syncStatus === 'error') {
            offlineEvents.push(eventData);
            console.log('🔄 Added to offline events:', eventData.title);
            // TEMPORARY: Also add pending events to visible events for debugging
            events.push(eventData as UnifiedEvent);
            console.log('🔍 TEMP: Also added pending event to visible events:', eventData.title);
          } else {
            events.push(eventData as UnifiedEvent);
            console.log('✅ Added to visible events:', eventData.title);
          }
        });

        console.log(`📊 Real-time listener update: ${events.length} visible events, ${offlineEvents.length} offline events`);

        setState(prev => ({
          ...prev,
          events,
          offlineEvents,
          loading: false,
          error: null,
        }));
      },
      (error) => {
        console.error('Real-time listener error:', error);
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      }
    );
  }, [user]);

  // Fetch events from external APIs and sync to Firestore
  const syncExternalEvents = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, syncInProgress: true }));

    try {
      const allEvents: UnifiedEvent[] = [];
      const allCalendars: UnifiedCalendar[] = [];

      // Fetch Google Calendar events
      try {
        const googleCalendars = await googleCalendarAPI.getUserCalendars(user);
        const googleCalendarEvents = await googleCalendarAPI.getAllEvents(user);
        
        googleCalendars.forEach(cal => {
          allCalendars.push({
            id: cal.id,
            name: cal.summary,
            color: cal.backgroundColor || '#4285f4',
            source: 'google',
            isPrimary: cal.primary,
          });
        });

        googleCalendarEvents.forEach(({ calendar, events }) => {
          events.forEach(event => {
            allEvents.push(convertGoogleEvent(event, calendar));
          });
        });
        
        console.log(`✅ Google Calendar: ${allEvents.length} events from ${googleCalendars.length} calendars`);
      } catch (error) {
        console.error('❌ Error fetching Google Calendar events:', error);
        // Don't throw, just log and continue with Microsoft
      }

      // Fetch Microsoft Calendar events
      if (user.providerData.some(provider => provider.providerId === 'microsoft.com')) {
        try {
          console.log('🔄 Attempting to fetch Microsoft Calendar events...');
          const microsoftCalendars = await microsoftGraphAPI.getUserCalendars(user);
          const microsoftCalendarEvents = await microsoftGraphAPI.getAllEvents(user);
          
          microsoftCalendars.forEach(cal => {
            allCalendars.push({
              id: cal.id,
              name: cal.name,
              color: cal.color || '#0078d4',
              source: 'microsoft',
              isPrimary: cal.isDefaultCalendar,
            });
          });

          microsoftCalendarEvents.forEach(({ calendar, events }) => {
            events.forEach(event => {
              allEvents.push(convertMicrosoftEvent(event, calendar));
            });
          });
          
          console.log(`✅ Microsoft Calendar: ${microsoftCalendarEvents.reduce((total, {events}) => total + events.length, 0)} events from ${microsoftCalendars.length} calendars`);
        } catch (error) {
          console.error('❌ Error fetching Microsoft Calendar events:', error);
          // Don't throw, just log and continue
        }
      } else {
        console.log('ℹ️ No Microsoft account linked, skipping Microsoft Calendar sync');
      }

      // Filter out unwanted events (birthdays, etc.)
      const filteredEvents = allEvents.filter(event => {
        const title = event.title.toLowerCase();
        const calendarName = event.calendarName.toLowerCase();
        const isBirthday = (title.includes('birthday') || title.includes('happy birthday')) 
                           && calendarName.includes('birthday');
        return !isBirthday;
      });

      // Sync to Firestore with batch write
      const batch = writeBatch(db);
      const eventsRef = collection(db, 'users', user.uid, 'events');

      // First, mark all existing events as potentially outdated
      const existingEventsQuery = query(eventsRef);
      const existingSnapshot = await getDocs(existingEventsQuery);
      existingSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { 
          syncStatus: 'pending',
          lastSyncAt: serverTimestamp()
        });
      });

      // Then add/update all current events
      filteredEvents.forEach(event => {
        const eventDocRef = doc(eventsRef, `${event.source}_${event.id}`);
        
        console.log(`🔄 Processing event for Firestore:`, {
          id: event.id,
          title: event.title,
          source: event.source,
          docId: `${event.source}_${event.id}`
        });
        
        // Filter out undefined values to prevent Firestore errors
        const eventData = {
          ...event,
          userId: user.uid,
          syncStatus: 'synced',
          lastSyncAt: serverTimestamp(),
          version: 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        // Remove undefined values from the event data (including nested objects)
        const cleanedEventData = Object.fromEntries(
          Object.entries(eventData).filter(([_, value]) => value !== undefined)
        );
        
        // Clean nested objects (organizer, attendees) to remove undefined fields
        if (cleanedEventData.organizer) {
          cleanedEventData.organizer = Object.fromEntries(
            Object.entries(cleanedEventData.organizer).filter(([_, value]) => value !== undefined)
          );
        }
        
        if (cleanedEventData.attendees && Array.isArray(cleanedEventData.attendees)) {
          cleanedEventData.attendees = cleanedEventData.attendees.map(attendee => 
            Object.fromEntries(
              Object.entries(attendee).filter(([_, value]) => value !== undefined)
            )
          );
        }
        
        batch.set(eventDocRef, cleanedEventData, { merge: true });
      });

      await batch.commit();
      console.log(`💾 Batch commit completed. Synced ${filteredEvents.length} events to Firestore`);

      setState(prev => ({
        ...prev,
        calendars: allCalendars,
        lastSyncTime: new Date(),
        syncInProgress: false,
        error: null,
      }));

      if (filteredEvents.length > 0) {
        toast.success(`✅ Synced ${filteredEvents.length} events from ${allCalendars.length} calendars`);
      } else {
        toast.info(`ℹ️ No events found in ${allCalendars.length} calendars`);
      }
    } catch (error) {
      console.error('❌ Error syncing events:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sync failed',
        syncInProgress: false,
      }));
      
      // More specific error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
        toast.error('🔑 Authentication expired. Please sign out and sign in again.');
      } else if (errorMessage.includes('permission')) {
        toast.error('🚫 Permission denied. Please check your calendar access settings.');
      } else {
        toast.error(`❌ Failed to sync events: ${errorMessage}`);
      }
    }
  }, [user]);

  // Auto-sync every 5 minutes
  useEffect(() => {
    if (!user) return;

    const syncInterval = setInterval(() => {
      syncExternalEvents();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(syncInterval);
  }, [user, syncExternalEvents]);

  // Setup real-time listener when user changes
  useEffect(() => {
    if (user) {
      setupRealtimeListener();
      // Initial sync
      syncExternalEvents();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [user, setupRealtimeListener, syncExternalEvents]);

  // Optimistic update for adding events
  const addEvent = useCallback(async (eventData: Partial<UnifiedEvent>) => {
    if (!user) return;

    try {
      const newEvent: StoredEvent = {
        id: `temp_${Date.now()}`,
        title: eventData.title || 'New Event',
        start: eventData.start || new Date(),
        end: eventData.end || new Date(),
        isAllDay: eventData.isAllDay || false,
        location: eventData.location,
        attendees: eventData.attendees,
        organizer: eventData.organizer,
        description: eventData.description,
        calendarId: eventData.calendarId || 'unknown',
        calendarName: eventData.calendarName || 'Unknown Calendar',
        calendarColor: eventData.calendarColor || '#4285f4',
        source: eventData.source || 'google',
        htmlLink: eventData.htmlLink,
        userId: user.uid,
        syncStatus: 'pending',
        lastSyncAt: new Date(),
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to Firestore
      const eventsRef = collection(db, 'users', user.uid, 'events');
      await addDoc(eventsRef, newEvent);

      toast.success('Event added successfully');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  }, [user]);

  // Optimistic update for modifying events
  const updateEvent = useCallback(async (eventId: string, updates: Partial<UnifiedEvent>) => {
    if (!user) return;

    try {
      const eventRef = doc(db, 'users', user.uid, 'events', eventId);
      await updateDoc(eventRef, {
        ...updates,
        syncStatus: 'pending',
        lastSyncAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  }, [user]);

  // Optimistic delete
  const deleteEvent = useCallback(async (eventId: string) => {
    if (!user) return;

    try {
      const eventRef = doc(db, 'users', user.uid, 'events', eventId);
      await deleteDoc(eventRef);

      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  }, [user]);

  // Sync offline events
  const syncOfflineEvents = useCallback(async () => {
    if (!user || state.offlineEvents.length === 0) return;

    setState(prev => ({ ...prev, syncInProgress: true }));

    try {
      await syncExternalEvents();
      
      // Clear offline events after successful sync
      const batch = writeBatch(db);
      state.offlineEvents.forEach(event => {
        const eventRef = doc(db, 'users', user.uid, 'events', event.id);
        batch.update(eventRef, { syncStatus: 'synced' });
      });
      await batch.commit();

      toast.success('Offline events synced successfully');
    } catch (error) {
      console.error('Error syncing offline events:', error);
      toast.error('Failed to sync offline events');
    } finally {
      setState(prev => ({ ...prev, syncInProgress: false }));
    }
  }, [user, state.offlineEvents, syncExternalEvents]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshEvents = useCallback(async () => {
    await syncExternalEvents();
  }, [syncExternalEvents]);

  return {
    ...state,
    addEvent,
    updateEvent,
    deleteEvent,
    syncOfflineEvents,
    clearError,
    refreshEvents,
  };
};
