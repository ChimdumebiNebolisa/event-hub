/**
 * Analytics tracking utilities for Google Tag Manager & GA4
 * 
 * Usage:
 *   import { track } from '@/lib/track';
 *   track('page_view', { page_path: '/dashboard' });
 *   track('cta_primary_clicked', { cta_label: 'Get Started' });
 */

// Extend window with dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// Initialize dataLayer if not present
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = [];
}

// Event parameter types
export interface PageViewParams {
  page_path: string;
  page_title?: string;
  page_location?: string;
}

export interface OutboundClickParams {
  link_url: string;
  link_domain: string;
}

export interface SearchPerformedParams {
  search_term: string;
  results_count: number;
}

export interface FilterChangedParams {
  filter_name: string;
  filter_value: string;
}

export interface AddToCalendarParams {
  calendar_type: 'google' | 'outlook' | 'ical';
  event_title?: string;
}

export interface SuggestSourceSubmittedParams {
  source_name: string;
  source_type?: string;
}

export interface ShareClickedParams {
  content_type?: string;
  method?: string;
}

export interface CtaPrimaryClickedParams {
  cta_label: string;
  cta_location: string;
}

// Union type for all event parameters
export type EventParams =
  | PageViewParams
  | OutboundClickParams
  | SearchPerformedParams
  | FilterChangedParams
  | AddToCalendarParams
  | SuggestSourceSubmittedParams
  | ShareClickedParams
  | CtaPrimaryClickedParams;

/**
 * Main tracking function - pushes events to GTM dataLayer
 */
export function track(
  eventName: string,
  params?: EventParams & { [key: string]: unknown }
): void {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('GTM dataLayer not available');
    return;
  }

  // Get UTM parameters from session storage
  const utmParams = getStoredUTMParams();

  window.dataLayer.push({
    event: eventName,
    ...params,
    ...utmParams,
    timestamp: new Date().toISOString(),
  });

  // Log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, { ...params, ...utmParams });
  }
}

/**
 * Track page view (call on route changes)
 */
export function trackPageView(path: string, title?: string): void {
  track('page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

/**
 * Track outbound link clicks
 */
export function trackOutboundClick(url: string): void {
  try {
    const urlObj = new URL(url);
    track('outbound_click', {
      link_url: url,
      link_domain: urlObj.hostname,
    });
  } catch (e) {
    console.warn('Invalid URL for outbound tracking:', url);
  }
}

/**
 * Track search performed
 */
export function trackSearch(term: string, resultsCount: number): void {
  track('search_performed', {
    search_term: term,
    results_count: resultsCount,
  });
}

/**
 * Track filter change
 */
export function trackFilterChange(filterName: string, value: string): void {
  track('filter_changed', {
    filter_name: filterName,
    filter_value: value,
  });
}

/**
 * Track add to calendar action
 */
export function trackAddToCalendar(
  calendarType: 'google' | 'outlook' | 'ical',
  eventTitle?: string
): void {
  track('add_to_calendar', {
    calendar_type: calendarType,
    event_title: eventTitle,
  });
}

/**
 * Track suggest source submission
 */
export function trackSuggestSource(sourceName: string, sourceType?: string): void {
  track('suggest_source_submitted', {
    source_name: sourceName,
    source_type: sourceType,
  });
}

/**
 * Track share button click
 */
export function trackShare(contentType?: string, method?: string): void {
  track('share_clicked', {
    content_type: contentType,
    method: method,
  });
}

/**
 * Track primary CTA click
 */
export function trackCtaClick(label: string, location: string): void {
  track('cta_primary_clicked', {
    cta_label: label,
    cta_location: location,
  });
}

// UTM Parameter Management
interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Extract UTM parameters from URL
 */
export function extractUTMParams(searchParams: URLSearchParams): UTMParams {
  const params: UTMParams = {};

  if (searchParams.has('utm_source')) {
    params.utm_source = searchParams.get('utm_source') || undefined;
  }
  if (searchParams.has('utm_medium')) {
    params.utm_medium = searchParams.get('utm_medium') || undefined;
  }
  if (searchParams.has('utm_campaign')) {
    params.utm_campaign = searchParams.get('utm_campaign') || undefined;
  }
  if (searchParams.has('utm_term')) {
    params.utm_term = searchParams.get('utm_term') || undefined;
  }
  if (searchParams.has('utm_content')) {
    params.utm_content = searchParams.get('utm_content') || undefined;
  }

  return params;
}

/**
 * Store UTM parameters in sessionStorage
 */
export function storeUTMParams(params: UTMParams): void {
  if (Object.keys(params).length > 0) {
    sessionStorage.setItem('utm_params', JSON.stringify(params));
  }
}

/**
 * Get stored UTM parameters from sessionStorage
 */
export function getStoredUTMParams(): UTMParams {
  try {
    const stored = sessionStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Initialize UTM tracking on app load
 */
export function initUTMTracking(): void {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams(window.location.search);
  const utmParams = extractUTMParams(searchParams);

  if (Object.keys(utmParams).length > 0) {
    storeUTMParams(utmParams);
  }
}

/**
 * Append UTM parameters to a URL
 */
export function appendUTMParams(url: string): string {
  const utmParams = getStoredUTMParams();
  
  if (Object.keys(utmParams).length === 0) {
    return url;
  }

  try {
    const urlObj = new URL(url, window.location.origin);
    
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value);
      }
    });

    return urlObj.toString();
  } catch {
    return url;
  }
}

