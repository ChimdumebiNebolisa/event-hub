import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to safely parse dates from Google Calendar API
export function parseGoogleCalendarDate(dateString: string, isAllDay: boolean = false): Date {
  try {
    if (isAllDay) {
      // All-day events come in YYYY-MM-DD format
      // Add time to make it a proper date
      return new Date(dateString + 'T00:00:00');
    } else {
      // Timed events should already be in ISO format
      return new Date(dateString);
    }
  } catch (error) {
    console.error('Failed to parse date:', dateString, error);
    // Return current date as fallback
    return new Date();
  }
}

// Utility function to validate if a date is valid and not the December 2018 fallback
export function isValidEventDate(date: Date): boolean {
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // Check if date is not the December 23, 2018 fallback date
  // JavaScript's Date constructor returns this date when parsing fails
  const december2018 = new Date('2018-12-23T00:00:00');
  const timeDiff = Math.abs(date.getTime() - december2018.getTime());
  
  // If the difference is less than 1 day, it's likely the fallback date
  if (timeDiff < 24 * 60 * 60 * 1000) {
    return false;
  }
  
  return true;
}