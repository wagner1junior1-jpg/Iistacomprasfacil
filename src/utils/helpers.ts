import { ShoppingItem, ShoppingTrip, Supermarket } from '../types';

export function formatCurrency(value?: number | null, currency = 'R$'): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }
  return `${currency} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatMonthName(monthStr: string): string {
  // Format: "YYYY-MM" -> "Agosto de 2026"
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} de ${year}`;
}

export function getMonthKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

// "YYYY-MM-DD" in the device's local timezone (toISOString would use UTC)
export function getLocalDateKey(date: Date = new Date()): string {
  const d = String(date.getDate()).padStart(2, '0');
  return `${getMonthKey(date)}-${d}`;
}

export function getNextMonthKey(currentMonthKey: string): string {
  const [year, month] = currentMonthKey.split('-').map(Number);
  const nextDate = new Date(year, month, 1); // JS 0-indexed month: month is next
  return getMonthKey(nextDate);
}

export function getPreviousMonthKey(currentMonthKey: string): string {
  const [year, month] = currentMonthKey.split('-').map(Number);
  const prevDate = new Date(year, month - 2, 1);
  return getMonthKey(prevDate);
}

// Calculate totals for active list
export function calculateListTotals(items: ShoppingItem[]) {
  let totalEstimated = 0;
  let totalBought = 0;
  let totalActual = 0;
  let boughtCount = 0;
  let unpricedBoughtCount = 0;

  for (const item of items) {
    const unitPrice = item.actualPrice ?? item.estimatedPrice ?? 0;
    const estPrice = item.estimatedPrice ?? item.actualPrice ?? 0;

    totalEstimated += estPrice * item.quantity;

    if (item.bought) {
      boughtCount++;
      if (item.actualPrice !== null && item.actualPrice !== undefined) {
        totalBought += item.actualPrice * item.quantity;
        totalActual += item.actualPrice * item.quantity;
      } else if (item.estimatedPrice) {
        totalBought += item.estimatedPrice * item.quantity;
      } else {
        unpricedBoughtCount++;
      }
    }
  }

  return {
    totalEstimated,
    totalBought,
    totalActual,
    totalCount: items.length,
    boughtCount,
    pendingCount: items.length - boughtCount,
    unpricedBoughtCount,
    progressPercentage: items.length > 0 ? Math.round((boughtCount / items.length) * 100) : 0,
  };
}

// Market Basket Comparison: compare the current list against all supermarkets
export interface MarketComparisonResult {
  supermarketId: string;
  supermarketName: string;
  totalCost: number;
  availableItemsCount: number;
  missingItemsCount: number;
  isCheapest: boolean;
  savingsVsHighest: number;
  coveragePercentage: number;
  itemBreakdown: {
    itemId: string;
    itemName: string;
    unit: string;
    quantity: number;
    price: number | null;
    total: number | null;
  }[];
}

export function compareBasketAcrossMarkets(items: ShoppingItem[], supermarkets: Supermarket[]): MarketComparisonResult[] {
  if (items.length === 0 || supermarkets.length === 0) return [];

  const results: MarketComparisonResult[] = supermarkets.map(sm => {
    let totalCost = 0;
    let availableItemsCount = 0;
    let missingItemsCount = 0;

    const itemBreakdown = items.map(item => {
      // Find registered price in this supermarket
      const storeRecord = item.storePrices?.find(sp => sp.supermarketId === sm.id || sp.supermarketName.toLowerCase() === sm.name.toLowerCase());
      
      // If item was bought/tagged at this market specifically with actual price
      let unitPrice: number | null = null;
      if (storeRecord && storeRecord.price > 0) {
        unitPrice = storeRecord.price;
      } else if (item.supermarketId === sm.id && item.actualPrice) {
        unitPrice = item.actualPrice;
      }

      if (unitPrice !== null) {
        availableItemsCount++;
        totalCost += unitPrice * item.quantity;
        return {
          itemId: item.id,
          itemName: item.name,
          unit: item.unit,
          quantity: item.quantity,
          price: unitPrice,
          total: unitPrice * item.quantity
        };
      } else {
        missingItemsCount++;
        // Fallback to estimated price if not specifically registered for this store, to allow comparison with note
        const fallback = item.estimatedPrice ?? item.actualPrice ?? null;
        if (fallback) {
          totalCost += fallback * item.quantity;
        }
        return {
          itemId: item.id,
          itemName: item.name,
          unit: item.unit,
          quantity: item.quantity,
          price: fallback,
          total: fallback ? fallback * item.quantity : null
        };
      }
    });

    return {
      supermarketId: sm.id,
      supermarketName: sm.name,
      totalCost,
      availableItemsCount,
      missingItemsCount,
      isCheapest: false,
      savingsVsHighest: 0,
      coveragePercentage: items.length > 0 ? Math.round((availableItemsCount / items.length) * 100) : 0,
      itemBreakdown
    };
  });

  // Items that have some price (registered or fallback) in each market; items without any
  // price add R$ 0 to the total, so markets are only comparable at equal pricing coverage.
  const pricedCount = (r: MarketComparisonResult) => r.itemBreakdown.filter(b => b.price !== null).length;
  const maxPriced = Math.max(...results.map(pricedCount));

  // Most priced items first, then lowest cost
  results.sort((a, b) => pricedCount(b) - pricedCount(a) || a.totalCost - b.totalCost);

  const comparable = results.filter(r => pricedCount(r) === maxPriced);
  if (comparable.length > 0 && comparable[0].totalCost > 0) {
    comparable[0].isCheapest = true;
    const highestCost = Math.max(...comparable.map(r => r.totalCost));
    comparable.forEach(r => {
      r.savingsVsHighest = highestCost - r.totalCost;
    });
  }

  return results;
}
