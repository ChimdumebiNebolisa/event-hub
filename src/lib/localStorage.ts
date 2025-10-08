import { UnifiedEvent } from './types';

// Local storage keys
const STORAGE_KEYS = {
  EVENTS: 'eventhub_events',
  SYNC_QUEUE: 'eventhub_sync_queue',
  LAST_SYNC: 'eventhub_last_sync',
} as const;

export interface SyncQueueItem {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  retryCount: number;
}

export interface LocalStorageData {
  events: UnifiedEvent[];
  syncQueue: SyncQueueItem[];
  lastSync: Date | null;
}

/**
 * Get all data from local storage
 */
export const getLocalStorageData = (): LocalStorageData => {
  const getItem = <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return defaultValue;
    }
  };

  return {
    events: getItem<UnifiedEvent[]>(STORAGE_KEYS.EVENTS, []),
    syncQueue: getItem<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []).map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
    })),
    lastSync: getItem<string | null>(STORAGE_KEYS.LAST_SYNC, null) 
      ? new Date(getItem<string>(STORAGE_KEYS.LAST_SYNC, ''))
      : null,
  };
};

/**
 * Save data to local storage
 */
export const saveLocalStorageData = (data: Partial<LocalStorageData>): void => {
  const saveItem = (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key ${key}:`, error);
    }
  };

  if (data.events !== undefined) {
    saveItem(STORAGE_KEYS.EVENTS, data.events);
  }
  if (data.syncQueue !== undefined) {
    saveItem(STORAGE_KEYS.SYNC_QUEUE, data.syncQueue);
  }
  if (data.lastSync !== undefined) {
    saveItem(STORAGE_KEYS.LAST_SYNC, data.lastSync?.toISOString() || null);
  }
};

/**
 * Get events from local storage
 */
export const getLocalEvents = (): UnifiedEvent[] => {
  return getLocalStorageData().events;
};

/**
 * Save events to local storage
 */
export const saveLocalEvents = (events: UnifiedEvent[]): void => {
  saveLocalStorageData({ events });
};

/**
 * Add or update an event in local storage
 */
export const upsertLocalEvent = (event: UnifiedEvent): void => {
  const data = getLocalStorageData();
  const existingIndex = data.events.findIndex(e => e.id === event.id);
  
  if (existingIndex >= 0) {
    data.events[existingIndex] = event;
  } else {
    data.events.push(event);
  }
  
  saveLocalEvents(data.events);
};

/**
 * Remove an event from local storage
 */
export const removeLocalEvent = (eventId: string): void => {
  const data = getLocalStorageData();
  data.events = data.events.filter(e => e.id !== eventId);
  saveLocalStorageData(data);
};

/**
 * Clear all local storage data
 */
export const clearLocalStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Check if we're online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Add item to sync queue
 */
export const addToSyncQueue = (item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>): void => {
  const data = getLocalStorageData();
  const syncItem: SyncQueueItem = {
    ...item,
    id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    retryCount: 0,
  };
  
  data.syncQueue.push(syncItem);
  saveLocalStorageData(data);
};

/**
 * Get sync queue
 */
export const getSyncQueue = (): SyncQueueItem[] => {
  return getLocalStorageData().syncQueue;
};

/**
 * Remove item from sync queue
 */
export const removeFromSyncQueue = (itemId: string): void => {
  const data = getLocalStorageData();
  data.syncQueue = data.syncQueue.filter(item => item.id !== itemId);
  saveLocalStorageData(data);
};

/**
 * Update sync queue item
 */
export const updateSyncQueueItem = (itemId: string, updates: Partial<SyncQueueItem>): void => {
  const data = getLocalStorageData();
  const itemIndex = data.syncQueue.findIndex(item => item.id === itemId);
  
  if (itemIndex >= 0) {
    data.syncQueue[itemIndex] = { ...data.syncQueue[itemIndex], ...updates };
    saveLocalStorageData(data);
  }
};

/**
 * Clear sync queue
 */
export const clearSyncQueue = (): void => {
  saveLocalStorageData({ syncQueue: [] });
};

/**
 * Get last sync time
 */
export const getLastSyncTime = (): Date | null => {
  return getLocalStorageData().lastSync;
};

/**
 * Update last sync time
 */
export const updateLastSyncTime = (): void => {
  saveLocalStorageData({ lastSync: new Date() });
};