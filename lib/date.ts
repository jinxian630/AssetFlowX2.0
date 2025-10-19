// ============================================================================
// AssetFlowX - Date Formatting Utilities
// ============================================================================

import { format, formatDistanceToNow, isPast, isValid, parseISO } from "date-fns"

/**
 * Format an ISO date string to a readable format
 * @param dateString - ISO 8601 date string
 * @param formatString - date-fns format string (default: "MMM d, yyyy h:mm a")
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  formatString: string = "MMM d, yyyy h:mm a"
): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString

    if (!isValid(date)) {
      return "Invalid date"
    }

    return format(date, formatString)
  } catch (error) {
    return "Invalid date"
  }
}

/**
 * Format date as "just now", "2 hours ago", etc.
 * @param dateString - ISO 8601 date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string | Date): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString

    if (!isValid(date)) {
      return "Invalid date"
    }

    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return "Invalid date"
  }
}

/**
 * Format date for short display (no time)
 * @param dateString - ISO 8601 date string
 * @returns Short date like "Oct 18, 2025"
 */
export function formatShortDate(dateString: string | Date): string {
  return formatDate(dateString, "MMM d, yyyy")
}

/**
 * Format date for long display with timezone
 * @param dateString - ISO 8601 date string
 * @returns Long date like "October 18, 2025 at 2:30 PM EST"
 */
export function formatLongDate(dateString: string | Date): string {
  return formatDate(dateString, "MMMM d, yyyy 'at' h:mm a zzz")
}

/**
 * Check if a date is in the past
 * @param dateString - ISO 8601 date string
 * @returns True if date is in the past
 */
export function isExpired(dateString: string | Date): boolean {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString

    if (!isValid(date)) {
      return false
    }

    return isPast(date)
  } catch (error) {
    return false
  }
}

/**
 * Get time remaining until a date
 * @param dateString - ISO 8601 date string
 * @returns Human-readable time remaining or "Expired"
 */
export function getTimeRemaining(dateString: string | Date): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString

    if (!isValid(date)) {
      return "Invalid date"
    }

    if (isPast(date)) {
      return "Expired"
    }

    return formatDistanceToNow(date, { addSuffix: false })
  } catch (error) {
    return "Invalid date"
  }
}

/**
 * Format just the time portion
 * @param dateString - ISO 8601 date string
 * @returns Time like "2:30 PM"
 */
export function formatTime(dateString: string | Date): string {
  return formatDate(dateString, "h:mm a")
}

/**
 * Format for API date range filters (YYYY-MM-DD)
 * @param date - Date object or ISO string
 * @returns ISO date string (date only)
 */
export function formatDateForAPI(date: string | Date): string {
  return formatDate(date, "yyyy-MM-dd")
}
