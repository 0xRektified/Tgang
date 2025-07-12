import Decimal from 'decimal.js';

/**
 * Currency utility functions for handling cents to dollars conversion
 * Backend stores all USD amounts as cents (integers) to avoid floating point precision issues
 */

/**
 * Convert cents to dollars using Decimal.js for precision
 * @param cents - Amount in cents (integer from backend)
 * @returns Decimal representing dollars
 */
export function centsToDollars(cents: number): Decimal {
  return new Decimal(cents).div(100);
}

/**
 * Convert dollars to cents using Decimal.js for precision
 * @param dollars - Amount in dollars (can be Decimal or number)
 * @returns Integer cents for backend
 */
export function dollarsToCents(dollars: Decimal | number): number {
  return new Decimal(dollars).mul(100).toNumber();
}

/**
 * Format cents as dollar string for display
 * @param cents - Amount in cents (integer from backend)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "$10.50")
 */
export function formatCentsAsDollars(cents: number, decimals: number = 2): string {
  return `$${centsToDollars(cents).toFixed(decimals)}`;
}

/**
 * Format cents as dollar string without $ symbol
 * @param cents - Amount in cents (integer from backend)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string (e.g., "10.50")
 */
export function formatCentsAsNumber(cents: number, decimals: number = 2): string {
  return centsToDollars(cents).toFixed(decimals);
}

/**
 * Parse user input dollars to cents for backend
 * @param input - User input string or number
 * @returns Integer cents for backend, or null if invalid
 */
export function parseInputToCents(input: string | number): number | null {
  try {
    const decimal = new Decimal(input);
    if (decimal.isNaN() || decimal.isNegative()) {
      return null;
    }
    return dollarsToCents(decimal);
  } catch {
    return null;
  }
}

/**
 * Currency constants
 */
export const CURRENCY = {
  CENTS_PER_DOLLAR: 100,
  MIN_CENTS: 0,
} as const;