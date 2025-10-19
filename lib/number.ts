// ============================================================================
// AssetFlowX - Number Formatting Utilities
// ============================================================================

/**
 * Format a number as currency (USD)
 * @param value - Number or string to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "$99.00"
 */
export function formatCurrency(
  value: string | number,
  decimals: number = 2
): string {
  const num = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(num)) {
    return "$0.00"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Format a large number in compact form
 * @param value - Number to format
 * @returns Compact string like "1.2K", "3.4M", "5.6B"
 */
export function formatCompact(value: number): string {
  if (isNaN(value)) {
    return "0"
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value)
}

/**
 * Format a number with thousand separators
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string like "1,234,567"
 */
export function formatNumber(
  value: number,
  decimals: number = 0
): string {
  if (isNaN(value)) {
    return "0"
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format a percentage
 * @param value - Decimal value (e.g., 0.1 for 10%)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string like "10.0%"
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  if (isNaN(value)) {
    return "0.0%"
  }

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Calculate fee split from basis points
 * @param amount - Total amount as string
 * @param bps - Basis points (10000 = 100%)
 * @returns Object with platformFee and instructorShare as strings
 */
export function calculateFeeSplit(
  amount: string,
  bps: number
): { platformFee: string; instructorShare: string } {
  const total = parseFloat(amount)
  if (isNaN(total)) {
    return { platformFee: "0.00", instructorShare: "0.00" }
  }

  const platformFee = (total * bps) / 10000
  const instructorShare = total - platformFee

  return {
    platformFee: platformFee.toFixed(2),
    instructorShare: instructorShare.toFixed(2),
  }
}
