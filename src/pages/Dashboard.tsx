import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Mail, Link, RefreshCw, Unlink, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CalendarView from "@/components/CalendarView";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import EmailDisplay from "@/components/EmailDisplay";
import { googleCalendarAPI } from "@/lib/googleCalendar";
import { microsoftGraphAPI } from "@/lib/microsoftGraph";
import { UnifiedEvent, UnifiedCalendar, convertGoogleEvent, convertMicrosoftEvent } from "@/lib/types";
// Removed mock data imports - using real API data only

const Dashboard = () => {
  const { user, loading, linkMicrosoftAccount, unlinkProvider } = useAuthContext();
  const navigate = useNavigate();
  const [linkingAccount, setLinkingAccount] = useState(false);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    providerId: string;
    providerName: string;
  }>({
    open: false,
    providerId: '',
    providerName: ''
  });
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [calendars, setCalendars] = useState<UnifiedCalendar[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  // Check if user has calendar access tokens
  const hasGoogleCalendarAccess = () => {
    return user?.providerData.some(provider => provider.providerId === 'google.com') && 
           localStorage.getItem('google_access_token');
  };

  const hasMicrosoftCalendarAccess = () => {
    return user?.providerData.some(provider => provider.providerId === 'microsoft.com') && 
           localStorage.getItem('microsoft_access_token');
  };

  const handleLinkMicrosoft = async () => {
    setLinkingAccount(true);
    try {
      await linkMicrosoftAccount();
      toast.success('Microsoft account linked successfully!');
      // Refresh events after linking
      fetchEvents();
    } catch (error: any) {
      console.error('Failed to link Microsoft account:', error);
      toast.error(`Failed to link account: ${error.message}`);
    } finally {
      setLinkingAccount(false);
    }
  };

  const handleUnlinkProvider = async (providerId: string) => {
    const providerName = providerId === 'google.com' ? 'Google' : 'Microsoft';
    
    // Show confirmation dialog
    setConfirmDialog({
      open: true,
      providerId,
      providerName
    });
  };

  const confirmUnlinkProvider = async () => {
    const { providerId, providerName } = confirmDialog;
    setUnlinkingProvider(providerId);
    
    try {
      await unlinkProvider(providerId);
      toast.success(`${providerName} calendar disconnected successfully! You can reconnect anytime.`);
      // Refresh events after unlinking - this will show no events since tokens are cleared
      fetchEvents();
    } catch (error: any) {
      console.error(`Failed to disconnect ${providerId} account:`, error);
      toast.error(`Failed to disconnect calendar: ${error.message}`);
    } finally {
      setUnlinkingProvider(null);
      setConfirmDialog({
        open: false,
        providerId: '',
        providerName: ''
      });
    }
  };

  const fetchEvents = async () => {
    if (!user) return;
    
    setEventsLoading(true);
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
      } catch (error) {
        console.error('Error fetching Google Calendar events:', error);
        toast.error('Failed to fetch Google Calendar events');
      }

      // Fetch Microsoft Calendar events (if user has Microsoft account)
      if (user.providerData.some(provider => provider.providerId === 'microsoft.com')) {
        try {
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
        } catch (error) {
          console.error('Error fetching Microsoft Calendar events:', error);
          toast.error('Failed to fetch Microsoft Calendar events');
        }
      }

      // Filter out unwanted events
      const filteredEvents = allEvents.filter(event => {
        const title = event.title.toLowerCase();
        const calendarName = event.calendarName.toLowerCase();
        
        // Only filter out events from dedicated birthday calendars
        const isBirthday = (title.includes('birthday') || title.includes('happy birthday')) 
                           && calendarName.includes('birthday');
        
        // Keep all other events including holidays and tasks
        return !isBirthday;
      });
      
      console.log(`Filtered out ${allEvents.length - filteredEvents.length} unwanted events`);
      console.log(`Remaining events: ${filteredEvents.length}`);
      
      // Sort events by start time
      filteredEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
      
      setEvents(filteredEvents);
      setCalendars(allCalendars);
      
      
      
      if (allEvents.length === 0) {
        toast.info('No events found. Make sure your calendars are connected and you have events scheduled.');
      } else {
        toast.success(`Loaded ${allEvents.length} events from ${allCalendars.length} calendars`);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch calendar events. Please check your authentication and try again.');
      setEvents([]);
      setCalendars([]);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome {user.displayName || user.email?.split('@')[0] || 'User'}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Your unified calendar dashboard
            </p>
          </div>

          {/* Calendar View */}
          <div className="mb-8">
            {calendars.length === 0 && !eventsLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No calendars connected
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Sign in with Google or Microsoft to connect your calendars and view your events.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={fetchEvents} disabled={eventsLoading}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${eventsLoading ? 'animate-spin' : ''}`} />
                      Try Again
                    </Button>
                    <p className="text-xs text-gray-500">
                      💡 Tip: Create an event in Google Calendar, then click "Try Again" to see it appear
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <CalendarView 
                events={events}
                calendars={calendars}
                loading={eventsLoading}
                onRefresh={fetchEvents}
              />
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                    <p className="text-sm text-gray-600">Total Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{calendars.length}</p>
                    <p className="text-sm text-gray-600">Connected Calendars</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <RefreshCw className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {events.filter(e => e.start >= new Date()).length}
                    </p>
                    <p className="text-sm text-gray-600">Upcoming Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {user?.providerData.length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Connected Accounts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Integration Status - Full Width */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendar Integration
                </CardTitle>
                <CardDescription>
                  Connect your calendars to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Google Calendar Connection */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">Google Calendar</p>
                        <p className="text-xs text-gray-500">
                          {user?.providerData.some(provider => provider.providerId === 'google.com') 
                            ? 'Connected' 
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {user?.providerData.some(provider => provider.providerId === 'google.com') ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            disabled
                            className={hasGoogleCalendarAccess() ? "text-green-600 border-green-200" : "text-yellow-600 border-yellow-200"}
                          >
                            {hasGoogleCalendarAccess() ? 'Calendar Connected ✓' : 'Account Connected (No Calendar Access)'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleUnlinkProvider('google.com')}
                            disabled={unlinkingProvider === 'google.com'}
                            className="hover:bg-destructive/90"
                          >
                            <Unlink className="w-3 h-3 mr-1" />
                            {unlinkingProvider === 'google.com' ? 'Disconnecting...' : 'Disconnect Calendar'}
                          </Button>
                          {!hasGoogleCalendarAccess() && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                // Re-authenticate with Google to get calendar access
                                window.location.href = '/signup';
                              }}
                              className="text-blue-600 border-blue-200"
                            >
                              <Link className="w-3 h-3 mr-1" />
                              Reconnect Calendar
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // For Google, we need to re-authenticate with calendar scopes
                            // This will redirect to signup which handles Google auth with proper scopes
                            window.location.href = '/signup';
                          }}
                          className="text-blue-600 border-blue-200"
                        >
                          <Link className="w-3 h-3 mr-1" />
                          Connect Calendar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Microsoft Calendar Connection */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">Microsoft Calendar</p>
                        <p className="text-xs text-gray-500">
                          {user?.providerData.some(provider => provider.providerId === 'microsoft.com') 
                            ? 'Connected' 
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {user?.providerData.some(provider => provider.providerId === 'microsoft.com') ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            disabled
                            className={hasMicrosoftCalendarAccess() ? "text-green-600 border-green-200" : "text-yellow-600 border-yellow-200"}
                          >
                            {hasMicrosoftCalendarAccess() ? 'Calendar Connected ✓' : 'Account Connected (No Calendar Access)'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleUnlinkProvider('microsoft.com')}
                            disabled={unlinkingProvider === 'microsoft.com'}
                            className="hover:bg-destructive/90"
                          >
                            <Unlink className="w-3 h-3 mr-1" />
                            {unlinkingProvider === 'microsoft.com' ? 'Disconnecting...' : 'Disconnect Calendar'}
                          </Button>
                          {!hasMicrosoftCalendarAccess() && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={handleLinkMicrosoft}
                              disabled={linkingAccount}
                              className="text-orange-600 border-orange-200"
                            >
                              <Link className="w-3 h-3 mr-1" />
                              {linkingAccount ? 'Reconnecting...' : 'Reconnect Calendar'}
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleLinkMicrosoft}
                          disabled={linkingAccount}
                          className="text-orange-600 border-orange-200"
                        >
                          <Link className="w-3 h-3 mr-1" />
                          {linkingAccount ? 'Linking...' : 'Connect Calendar'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-800 font-medium mb-1">Calendar Access Tips:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Disconnect and reconnect calendars to refresh permissions</li>
                          <li>• You can connect multiple calendar accounts simultaneously</li>
                          <li>• Events from all connected calendars will be shown together</li>
                          <li>• Disconnecting only stops calendar sync, your account stays signed in</li>
                          <li>• Use the "Disconnect Calendar" button to remove calendar access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Details - Collapsible */}
          <div className="mb-8">
            <Card>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setShowAccountDetails(!showAccountDetails)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <div>
                      <CardTitle>Account Info</CardTitle>
                      <CardDescription>
                        Your connected account details
                      </CardDescription>
                    </div>
                  </div>
                  {showAccountDetails ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              {showAccountDetails && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Account Details</h4>
                      <div className="space-y-4">
                        {/* Primary Account */}
                        <EmailDisplay
                          email={user.email || ''}
                          provider={user.providerData[0]?.providerId === 'google.com' ? 'google' : 'microsoft'}
                          showProviderBadge={true}
                          showCalendarLink={true}
                        />
                        
                        {/* Display Name if available */}
                        {user.displayName && (
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{user.displayName}</span>
                          </div>
                        )}
                        
                        {/* Additional Providers */}
                        {user.providerData.length > 1 && (
                          <div className="space-y-2">
                            <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                              Additional Connected Accounts
                            </h5>
                            {user.providerData.slice(1).map((provider, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    provider.providerId === 'google.com' 
                                      ? 'border-blue-500 text-blue-600 bg-blue-50' 
                                      : 'border-orange-500 text-orange-600 bg-orange-50'
                                  }`}
                                >
                                  {provider.providerId.replace('.com', '')}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {provider.email || 'Connected'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={`Disconnect ${confirmDialog.providerName} Calendar`}
        description={`This will disconnect your ${confirmDialog.providerName} calendar from EventHub. Your ${confirmDialog.providerName} account will remain signed in, but calendar events will no longer be synced. You can reconnect your calendar anytime.`}
        confirmText="Disconnect Calendar"
        cancelText="Cancel"
        onConfirm={confirmUnlinkProvider}
        destructive={true}
      />
    </div>
  );
};

export default Dashboard;
