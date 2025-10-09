import { useAuthContext } from "@/contexts/AuthContext";
import { useRealtimeContext } from "@/contexts/RealtimeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Mail, Link, RefreshCw, Unlink, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import CalendarView from "@/components/CalendarView";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import EmailDisplay from "@/components/EmailDisplay";
import { RealtimeStatus } from "@/components/RealtimeStatus";
import { useEventSearch } from "@/hooks/useEventSearch";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ThemeToggle from "@/components/ThemeToggle";
import { DashboardThemeProvider } from "@/contexts/DashboardThemeContext";
// Removed mock data imports - using real API data only

const Dashboard = () => {
  const { user, loading, linkMicrosoftAccount, unlinkProvider } = useAuthContext();
  
  // Guard against using context when user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const {
    events,
    calendars,
    eventsLoading,
    eventsError,
    syncInProgress,
    offlineEvents,
    refreshEvents,
    unreadCount,
    markAllAsRead,
    isOnline
  } = useRealtimeContext();
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
  const [deleteAccountDialog, setDeleteAccountDialog] = useState<{
    open: boolean;
  }>({
    open: false
  });
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  
  // Search and filtering with real-time events
  const {
    filteredEvents,
    searchFilters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    searchStats,
  } = useEventSearch(events);

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
      
      // Check if Microsoft was already linked (token refresh)
      const hasMicrosoft = user?.providerData.some(provider => provider.providerId === 'microsoft.com');
      if (hasMicrosoft) {
        toast.success('Microsoft account token refreshed successfully!');
      } else {
        toast.success('Microsoft account linked successfully!');
      }
      
      // Refresh events after linking/refreshing
      await refreshEvents();
    } catch (error: unknown) {
      console.error('Failed to link Microsoft account:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to link account: ${errorMessage}`);
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
      await refreshEvents();
    } catch (error: unknown) {
      console.error(`Failed to disconnect ${providerId} account:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to disconnect calendar: ${errorMessage}`);
    } finally {
      setUnlinkingProvider(null);
      setConfirmDialog({
        open: false,
        providerId: '',
        providerName: ''
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Clear all local storage
      localStorage.clear();
      
      // Delete user account from Firebase
      if (user) {
        await user.delete();
      }
      
      toast.success('Account deleted successfully. You will be redirected to the home page.');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error: unknown) {
      console.error('Failed to delete account:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to delete account: ${errorMessage}`);
    }
  };

  // Real-time events are now handled by the RealtimeContext
  // No need for manual fetching - events update automatically

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
    <DashboardThemeProvider>
      <div id="dashboard-container" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-6 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16 pt-24 sm:pt-24">
        <div className="max-w-8xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12 sm:mb-12 lg:mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Welcome {user.displayName || user.email?.split('@')[0] || 'User'}! 👋
              </h1>
              <ThemeToggle size="sm" />
            </div>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Your unified calendar dashboard
            </p>
            
            {/* Real-time Status */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <RealtimeStatus showDetails={false} />
              {eventsError && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshEvents}
                  disabled={syncInProgress}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`} />
                  Retry Sync
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-12 sm:mb-12 lg:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Search and Filters */}
              <div className="lg:col-span-3 space-y-6">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-1">
                    <SearchBar
                      value={searchFilters.query}
                      onChange={(query) => updateFilters({ query })}
                      onClear={() => updateFilters({ query: '' })}
                      placeholder="Search events, attendees, locations..."
                    />
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-shrink-0 w-full sm:w-auto"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
              
            </div>
            
            {/* Filter Panel */}
            <div className="mt-4">
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <FilterPanel
                    filters={searchFilters}
                    onFiltersChange={updateFilters}
                    onClearFilters={clearFilters}
                    calendars={calendars}
                    hasActiveFilters={hasActiveFilters}
                    searchStats={searchStats}
                  />
                </div>
                
                {/* Calendar View */}
                <div className="lg:col-span-3">
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
                    <Button onClick={refreshEvents} disabled={eventsLoading}>
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
                events={filteredEvents}
                calendars={calendars}
                loading={eventsLoading}
                onRefresh={refreshEvents}
              />
            )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-xl">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{searchStats.filtered}</p>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">
                      {hasActiveFilters ? 'Filtered Events' : 'Total Events'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 bg-green-100 rounded-xl">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{calendars.length}</p>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">Connected Calendars</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 bg-blue-100 rounded-xl">
                    <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      {filteredEvents.filter(e => e.start >= new Date()).length}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">Upcoming Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 bg-purple-100 rounded-xl">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      {user?.providerData.length || 0}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">Connected Accounts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Integration Status - Full Width */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                  <Calendar className="w-6 h-6" />
                  Calendar Integration
                </CardTitle>
                <CardDescription className="text-base">
                  Connect your calendars to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {/* Google Calendar Connection */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-2 border-gray-200 rounded-xl gap-4 sm:gap-0 hover:border-primary/30 transition-colors duration-200">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-gray-900">Google Calendar</p>
                        <p className="text-sm text-gray-500">
                          {user?.providerData.some(provider => provider.providerId === 'google.com') 
                            ? 'Connected' 
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0 w-full sm:w-auto sm:ml-4">
                      {user?.providerData.some(provider => provider.providerId === 'google.com') ? (
                        <>
                          <Button 
                            size="default" 
                            variant="outline" 
                            disabled
                            className={`w-full sm:w-auto h-10 ${hasGoogleCalendarAccess() ? "text-green-600 border-green-200 bg-green-50" : "text-yellow-600 border-yellow-200 bg-yellow-50"}`}
                          >
                            {hasGoogleCalendarAccess() ? 'Calendar Connected ✓' : 'Account Connected (No Calendar Access)'}
                          </Button>
                          <Button 
                            size="default" 
                            variant="destructive"
                            onClick={() => handleUnlinkProvider('google.com')}
                            disabled={unlinkingProvider === 'google.com'}
                            className="w-full sm:w-auto h-10 hover:bg-destructive/90"
                          >
                            <Unlink className="w-4 h-4 mr-2" />
                            {unlinkingProvider === 'google.com' ? 'Disconnecting...' : 'Disconnect Calendar'}
                          </Button>
                          {!hasGoogleCalendarAccess() && (
                            <Button 
                              size="default" 
                              variant="outline"
                              onClick={() => {
                                // Re-authenticate with Google to get calendar access
                                window.location.href = '/signup';
                              }}
                              className="w-full sm:w-auto h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Link className="w-4 h-4 mr-2" />
                              Reconnect Calendar
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button 
                          size="default" 
                          variant="outline"
                          onClick={() => {
                            // For Google, we need to re-authenticate with calendar scopes
                            // This will redirect to signup which handles Google auth with proper scopes
                            window.location.href = '/signup';
                          }}
                          className="w-full sm:w-auto h-10 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Link className="w-4 h-4 mr-2" />
                          Connect Calendar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Microsoft Calendar Connection */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-2 border-gray-200 rounded-xl gap-4 sm:gap-0 hover:border-primary/30 transition-colors duration-200">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-gray-900">Microsoft Calendar</p>
                        <p className="text-sm text-gray-500">
                          {user?.providerData.some(provider => provider.providerId === 'microsoft.com') 
                            ? 'Connected' 
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0 w-full sm:w-auto sm:ml-4">
                      {user?.providerData.some(provider => provider.providerId === 'microsoft.com') ? (
                        <>
                          <Button 
                            size="default" 
                            variant="outline" 
                            disabled
                            className={`w-full sm:w-auto h-10 ${hasMicrosoftCalendarAccess() ? "text-green-600 border-green-200 bg-green-50" : "text-yellow-600 border-yellow-200 bg-yellow-50"}`}
                          >
                            {hasMicrosoftCalendarAccess() ? 'Calendar Connected ✓' : 'Account Connected (No Calendar Access)'}
                          </Button>
                          <Button 
                            size="default" 
                            variant="destructive"
                            onClick={() => handleUnlinkProvider('microsoft.com')}
                            disabled={unlinkingProvider === 'microsoft.com'}
                            className="w-full sm:w-auto h-10 hover:bg-destructive/90"
                          >
                            <Unlink className="w-4 h-4 mr-2" />
                            {unlinkingProvider === 'microsoft.com' ? 'Disconnecting...' : 'Disconnect Calendar'}
                          </Button>
                          {!hasMicrosoftCalendarAccess() && (
                            <Button 
                              size="default" 
                              variant="outline"
                              onClick={handleLinkMicrosoft}
                              disabled={linkingAccount}
                              className="w-full sm:w-auto h-10 text-orange-600 border-orange-200 hover:bg-orange-50"
                            >
                              <Link className="w-4 h-4 mr-2" />
                              {linkingAccount ? 'Reconnecting...' : 'Reconnect Calendar'}
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button 
                          size="default" 
                          variant="outline"
                          onClick={handleLinkMicrosoft}
                          disabled={linkingAccount}
                          className="w-full sm:w-auto h-10 text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <Link className="w-4 h-4 mr-2" />
                          {linkingAccount ? 'Linking...' : 'Connect Calendar'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-800 font-semibold mb-2">Calendar Access Tips:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
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

          {/* Delete Account Section */}
          <div className="mb-8">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <CardTitle className="text-red-800">Danger Zone</CardTitle>
                    <CardDescription className="text-red-600">
                      Irreversible and destructive actions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-100 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Permanently delete your EventHub account and all associated data. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteAccountDialog({ open: true })}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
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

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        open={deleteAccountDialog.open}
        onOpenChange={(open) => setDeleteAccountDialog(prev => ({ ...prev, open }))}
        title="Delete Account - Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your EventHub account and remove all of your data from our servers. You will lose access to all your calendar integrations and settings."
        confirmText="Yes, Delete My Account"
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        destructive={true}
      />
    </div>
    </DashboardThemeProvider>
  );
};

export default Dashboard;
