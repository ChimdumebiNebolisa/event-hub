import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { useAuthContext } from './AuthContext';
import { useRealtimeEvents } from '@/hooks/useRealtimeEvents';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

export interface RealtimeContextType {
  // Events
  events: any[];
  calendars: any[];
  eventsLoading: boolean;
  eventsError: string | null;
  lastSyncTime: Date | null;
  syncInProgress: boolean;
  offlineEvents: any[];
  refreshEvents: () => Promise<void>;
  addEvent: (event: Partial<any>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<any>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  syncOfflineEvents: () => Promise<void>;
  clearEventsError: () => void;


  // Notifications
  notifications: any[];
  unreadCount: number;
  notificationsLoading: boolean;
  notificationsError: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  showNotification: (type: any, title: string, message: string, eventId?: string) => Promise<void>;
  clearNotificationsError: () => void;

  // Global state
  isOnline: boolean;
  lastActivity: Date | null;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtimeContext = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtimeContext must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const { user } = useAuthContext();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [lastActivity, setLastActivity] = React.useState<Date | null>(null);

  // Real-time hooks
  const eventsState = useRealtimeEvents(user);
  const notificationsState = useRealtimeNotifications(user);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastActivity(new Date());
      // Sync offline events when coming back online
      if (eventsState.offlineEvents.length > 0) {
        eventsState.syncOfflineEvents();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastActivity(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [eventsState]);

  // Track user activity for last activity timestamp
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(new Date());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Enhanced event handlers with notifications
  const enhancedAddEvent = useCallback(async (event: Partial<any>) => {
    try {
      await eventsState.addEvent(event);
      await notificationsState.showNotification(
        'event_added',
        'Event Added',
        `${event.title || 'New event'} has been added`,
        event.id
      );
    } catch (error) {
      await notificationsState.showNotification(
        'sync_failed',
        'Sync Failed',
        'Failed to add event. Changes will sync when connection is restored.',
        event.id
      );
    }
  }, [eventsState, notificationsState]);

  const enhancedUpdateEvent = useCallback(async (eventId: string, updates: Partial<any>) => {
    try {
      await eventsState.updateEvent(eventId, updates);
      await notificationsState.showNotification(
        'event_updated',
        'Event Updated',
        `${updates.title || 'Event'} has been updated`,
        eventId
      );
    } catch (error) {
      await notificationsState.showNotification(
        'sync_failed',
        'Sync Failed',
        'Failed to update event. Changes will sync when connection is restored.',
        eventId
      );
    }
  }, [eventsState, notificationsState]);

  const enhancedDeleteEvent = useCallback(async (eventId: string) => {
    try {
      await eventsState.deleteEvent(eventId);
      await notificationsState.showNotification(
        'event_deleted',
        'Event Deleted',
        'Event has been deleted',
        eventId
      );
    } catch (error) {
      await notificationsState.showNotification(
        'sync_failed',
        'Sync Failed',
        'Failed to delete event. Changes will sync when connection is restored.',
        eventId
      );
    }
  }, [eventsState, notificationsState]);


  const contextValue: RealtimeContextType = {
    // Events
    events: eventsState.events,
    calendars: eventsState.calendars,
    eventsLoading: eventsState.loading,
    eventsError: eventsState.error,
    lastSyncTime: eventsState.lastSyncTime,
    syncInProgress: eventsState.syncInProgress,
    offlineEvents: eventsState.offlineEvents,
    refreshEvents: eventsState.refreshEvents,
    addEvent: enhancedAddEvent,
    updateEvent: enhancedUpdateEvent,
    deleteEvent: enhancedDeleteEvent,
    syncOfflineEvents: eventsState.syncOfflineEvents,
    clearEventsError: eventsState.clearError,


    // Notifications
    notifications: notificationsState.notifications,
    unreadCount: notificationsState.unreadCount,
    notificationsLoading: notificationsState.loading,
    notificationsError: notificationsState.error,
    markAsRead: notificationsState.markAsRead,
    markAllAsRead: notificationsState.markAllAsRead,
    deleteNotification: notificationsState.deleteNotification,
    clearAllNotifications: notificationsState.clearAllNotifications,
    showNotification: notificationsState.showNotification,
    clearNotificationsError: notificationsState.clearError,

    // Global state
    isOnline,
    lastActivity,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
};
