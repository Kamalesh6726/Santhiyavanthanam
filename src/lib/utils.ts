import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely converts any value (Firestore Timestamp, string, number, Date) to a valid Date object.
 * Always returns a valid Date, never throws or returns Invalid Date (NaN).
 */
export function toValidDate(val: any, defaultDate: Date = new Date()): Date {
  if (val === null || val === undefined) return defaultDate;

  if (val instanceof Date) {
    return isNaN(val.getTime()) ? defaultDate : val;
  }

  // Firestore Timestamp with .toDate()
  if (typeof val === 'object' && typeof val.toDate === 'function') {
    try {
      const d = val.toDate();
      if (d instanceof Date && !isNaN(d.getTime())) return d;
    } catch {
      return defaultDate;
    }
  }

  // Firestore Timestamp-like { seconds, nanoseconds }
  if (typeof val === 'object' && typeof val.seconds === 'number') {
    const d = new Date(val.seconds * 1000);
    if (!isNaN(d.getTime())) return d;
  }

  // Numeric timestamp (milliseconds)
  if (typeof val === 'number') {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }

  // String formats (ISO, YYYY-MM-DD, etc.)
  if (typeof val === 'string') {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;

    // Manual parse for YYYY-MM-DD
    const parts = val.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const manualDate = new Date(year, month, day);
      if (!isNaN(manualDate.getTime())) return manualDate;
    }
  }

  return defaultDate;
}

/**
 * Safely formats any date value with date-fns format, never throwing 'Invalid time value'.
 */
export function safeFormat(val: any, formatStr: string, fallback: string = ''): string {
  try {
    const d = toValidDate(val);
    return format(d, formatStr);
  } catch {
    return fallback || format(new Date(), formatStr);
  }
}
