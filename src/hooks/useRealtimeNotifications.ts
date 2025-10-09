import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  Unsubscribe,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'event_added' | 'event_updated' | 'event_deleted' | 'sync_completed' | 'sync_failed';
  title: string;
  message: string;
  eventId?: string;
  userId: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface NotificationActions {
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  showNotification: (type: Notification['type'], title: string, message: string, eventId?: string) => Promise<void>;
}

export const useRealtimeNotifications = (user: User | null): NotificationState & NotificationActions => {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    loading: true,
    error: null,
  });

  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // Real-time listener for notifications
  const setupNotificationsListener = useCallback(() => {
    if (!user) return;

    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(
      notificationsRef,
      orderBy('createdAt', 'desc'),
      where('expiresAt', '>', new Date()) // Only get non-expired notifications
    );

    unsubscribeRef.current = onSnapshot(
      q,
      (snapshot) => {
        const notifications: Notification[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          expiresAt: doc.data().expiresAt?.toDate(),
        })) as Notification[];

        const unreadCount = notifications.filter(n => !n.read).length;

        setState(prev => ({
          ...prev,
          notifications,
          unreadCount,
          loading: false,
          error: null,
        }));

        // Show toast for new notifications
        notifications
          .filter(notification => !notification.read && notification.createdAt > new Date(Date.now() - 5000)) // Last 5 seconds
          .forEach(notification => {
            showToastNotification(notification);
          });
      },
      (error) => {
        console.error('Real-time notifications listener error:', error);
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      }
    );
  }, [user]);

  // Show toast notification
  const showToastNotification = useCallback((notification: Notification) => {
    const toastOptions = {
      duration: 5000,
      action: notification.eventId ? {
        label: 'View Event',
        onClick: () => {
          // Scroll to event or open event details
          const eventElement = document.getElementById(`event-${notification.eventId}`);
          if (eventElement) {
            eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight the event briefly
            eventElement.classList.add('animate-pulse');
            setTimeout(() => {
              eventElement.classList.remove('animate-pulse');
            }, 2000);
          }
        }
      } : undefined,
    };

    switch (notification.type) {
      case 'event_added':
        toast.success(notification.title, toastOptions);
        break;
      case 'event_updated':
        toast.info(notification.title, toastOptions);
        break;
      case 'event_deleted':
        toast.warning(notification.title, toastOptions);
        break;
      case 'sync_completed':
        toast.success(notification.title, { duration: 3000 });
        break;
      case 'sync_failed':
        toast.error(notification.title, { duration: 5000 });
        break;
      default:
        toast.info(notification.title, { duration: 3000 });
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    if (!user) return;

    try {
      const notificationRef = doc(db, 'users', user.uid, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      const unreadNotifications = state.notifications.filter(n => !n.read);
      
      unreadNotifications.forEach(notification => {
        const notificationRef = doc(db, 'users', user.uid, 'notifications', notification.id);
        batch.update(notificationRef, { read: true });
      });

      if (unreadNotifications.length > 0) {
        await batch.commit();
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user, state.notifications]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string): Promise<void> => {
    if (!user) return;

    try {
      const notificationRef = doc(db, 'users', user.uid, 'notifications', notificationId);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [user]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      
      state.notifications.forEach(notification => {
        const notificationRef = doc(db, 'users', user.uid, 'notifications', notification.id);
        batch.delete(notificationRef);
      });

      if (state.notifications.length > 0) {
        await batch.commit();
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  }, [user, state.notifications]);

  // Create a new notification
  const showNotification = useCallback(async (
    type: Notification['type'], 
    title: string, 
    message: string, 
    eventId?: string, 
  ): Promise<void> => {
    if (!user) return;

    try {
      const notificationsRef = collection(db, 'users', user.uid, 'notifications');
      
      // Calculate expiration time (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const newNotification = {
        type,
        title,
        message,
        eventId,
        userId: user.uid,
        read: false,
        createdAt: serverTimestamp(),
        expiresAt: expiresAt,
      };

      await addDoc(notificationsRef, newNotification);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }, [user]);

  // Setup real-time listener when user changes
  useEffect(() => {
    if (user) {
      setupNotificationsListener();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user, setupNotificationsListener]);

  return {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    showNotification,
  };
};
