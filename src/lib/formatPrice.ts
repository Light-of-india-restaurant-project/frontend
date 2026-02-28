/**
 * Format a price in European (Dutch) style: €7,50
 * - Always shows 2 decimal places
 * - Uses comma as decimal separator
 */
export function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',');
}
