import React, { useState, useEffect } from 'react';
import { useRealtimeContext } from '@/contexts/RealtimeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Cloud,
  CloudOff,
  Bell,
  BellOff
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NotificationPanel } from './NotificationPanel';

interface RealtimeStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const RealtimeStatus: React.FC<RealtimeStatusProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const {
    isOnline,
    syncInProgress,
    lastSyncTime,
    offlineEvents,
    eventsError,
    unreadCount,
    syncOfflineEvents,
    markAllAsRead,
    clearAllNotifications
  } = useRealtimeContext();

  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [timeSinceLastSync, setTimeSinceLastSync] = useState<string>('');

  // Update time since last sync
  useEffect(() => {
    const updateTimeSinceSync = () => {
      if (lastSyncTime) {
        const now = new Date();
        const diffMs = now.getTime() - lastSyncTime.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (diffMinutes < 1) {
          setTimeSinceLastSync('Just now');
        } else if (diffMinutes < 60) {
          setTimeSinceLastSync(`${diffMinutes}m ago`);
        } else {
          const diffHours = Math.floor(diffMinutes / 60);
          setTimeSinceLastSync(`${diffHours}h ago`);
        }
      } else {
        setTimeSinceLastSync('Never');
      }
    };

    updateTimeSinceSync();
    const interval = setInterval(updateTimeSinceSync, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (eventsError) return 'text-orange-500';
    if (offlineEvents.length > 0) return 'text-yellow-500';
    if (syncInProgress) return 'text-blue-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (eventsError) return <AlertCircle className="w-4 h-4" />;
    if (offlineEvents.length > 0) return <CloudOff className="w-4 h-4" />;
    if (syncInProgress) return <RefreshCw className="w-4 h-4 animate-spin" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (eventsError) return 'Sync Error';
    if (offlineEvents.length > 0) return `${offlineEvents.length} pending`;
    if (syncInProgress) return 'Syncing...';
    return 'Synced';
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Connection Status */}
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1 ${getStatusColor()}`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              {isOnline ? (
                <span className="text-xs text-green-600">Online</span>
              ) : (
                <span className="text-xs text-red-600">Offline</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isOnline ? 'Connected to internet' : 'No internet connection'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Sync Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-xs">{getStatusText()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p>Status: {getStatusText()}</p>
              <p>Last sync: {timeSinceLastSync}</p>
              {offlineEvents.length > 0 && (
                <p>{offlineEvents.length} events pending sync</p>
              )}
              {eventsError && (
                <p className="text-red-500">Error: {eventsError}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Offline Events Badge */}
        {offlineEvents.length > 0 && (
          <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
            <CloudOff className="w-3 h-3 mr-1" />
            {offlineEvents.length}
          </Badge>
        )}

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative p-1 h-6 w-6"
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{unreadCount > 0 ? `${unreadCount} unread notifications` : 'No new notifications'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Sync Button for Offline Events */}
        {offlineEvents.length > 0 && isOnline && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={syncOfflineEvents}
                disabled={syncInProgress}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${syncInProgress ? 'animate-spin' : ''}`} />
                Sync
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sync {offlineEvents.length} pending changes</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>

      {/* Detailed Status Panel */}
      {showDetails && (
        <div className="ml-4 p-2 bg-gray-50 rounded-lg border text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={getStatusColor()}>{getStatusText()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last sync:</span>
            <span className="text-gray-800">{timeSinceLastSync}</span>
          </div>
          {offlineEvents.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending:</span>
              <span className="text-yellow-600">{offlineEvents.length} events</span>
            </div>
          )}
          {eventsError && (
            <div className="text-red-500 text-xs">
              Error: {eventsError}
            </div>
          )}
        </div>
      )}
    </div>

    {/* Notification Panel */}
    <NotificationPanel 
      isOpen={showNotificationPanel} 
      onClose={() => setShowNotificationPanel(false)} 
    />
  </>
  );
};
