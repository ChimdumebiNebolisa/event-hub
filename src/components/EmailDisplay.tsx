import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail } from 'lucide-react';

/**
 * EmailDisplay Component
 * 
 * A reusable component for displaying user email addresses with provider information
 * and calendar links. Handles long email addresses gracefully with proper truncation.
 * 
 * @param email - The user's email address
 * @param provider - The authentication provider ('google' | 'microsoft')
 * @param showProviderBadge - Whether to show the provider badge (default: true)
 * @param showCalendarLink - Whether to show the calendar link button (default: true)
 * @param onCalendarClick - Custom click handler for calendar link
 * @param className - Additional CSS classes
 * @param variant - Display variant: 'default' (stacked layout) or 'compact' (single line)
 * 
 * @example
 * // Default variant (stacked layout)
 * <EmailDisplay 
 *   email="user@example.com" 
 *   provider="google" 
 * />
 * 
 * @example
 * // Compact variant (single line)
 * <EmailDisplay 
 *   email="user@example.com" 
 *   provider="google" 
 *   variant="compact"
 * />
 */

interface EmailDisplayProps {
  email: string;
  provider: 'google' | 'microsoft';
  showProviderBadge?: boolean;
  showCalendarLink?: boolean;
  onCalendarClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const EmailDisplay = ({ 
  email, 
  provider, 
  showProviderBadge = true, 
  showCalendarLink = true,
  onCalendarClick,
  className = "",
  variant = 'default'
}: EmailDisplayProps) => {
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'border-blue-500 text-blue-600 bg-blue-50';
      case 'microsoft':
        return 'border-orange-500 text-orange-600 bg-orange-50';
      default:
        return 'border-gray-500 text-gray-600 bg-gray-50';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'microsoft':
        return 'Microsoft';
      default:
        return provider;
    }
  };

  const getCalendarUrl = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'https://calendar.google.com';
      case 'microsoft':
        return 'https://outlook.live.com/calendar';
      default:
        return '#';
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Email and Provider Row */}
        <div className="flex items-center gap-2 min-w-0">
          <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-600">s.</span>
          <span 
            className="text-sm font-medium text-gray-900 truncate min-w-0 flex-1"
            title={email}
          >
            {email}
          </span>
          {showProviderBadge && (
            <Badge 
              variant="outline" 
              className={`text-xs flex-shrink-0 ${getProviderColor(provider)}`}
            >
              {getProviderName(provider)}
            </Badge>
          )}
        </div>
        
        {/* Calendar Link Row - Separate line to prevent crowding */}
        {showCalendarLink && (
          <div className="flex justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={onCalendarClick || (() => window.open(getCalendarUrl(provider), '_blank'))}
              className="text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open in {getProviderName(provider)} Calendar
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Email and Provider Row */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 min-w-0">
          <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-600">signed in as</span>
          <span 
            className="text-sm font-medium text-gray-900 truncate min-w-0 flex-1"
            title={email}
          >
            {email}
          </span>
        </div>
        {showProviderBadge && (
          <div className="flex justify-start">
            <Badge 
              variant="outline" 
              className={`text-xs ${getProviderColor(provider)}`}
            >
              {getProviderName(provider)}
            </Badge>
          </div>
        )}
      </div>

      {/* Calendar Link Row */}
      {showCalendarLink && (
        <div className="flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={onCalendarClick || (() => window.open(getCalendarUrl(provider), '_blank'))}
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Open in {getProviderName(provider)} Calendar
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmailDisplay;
