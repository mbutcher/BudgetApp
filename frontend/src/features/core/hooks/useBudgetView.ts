import { useQuery } from '@tanstack/react-query';
import { budgetLineApi } from '../api/budgetLineApi';
import { db } from '@lib/db';
import { isOfflineError } from '@lib/db/offlineHelpers';
import type { BudgetView, UpcomingExpensesResponse, PayPeriod } from '../types';

export const BUDGET_VIEW_KEY = ['budget-view'] as const;
export const PAY_PERIOD_KEY = ['pay-period'] as const;

// ─── Cache helpers ────────────────────────────────────────────────────────────

async function readCache<T>(id: string): Promise<T | null> {
  const entry = await db.budgetViewCache.get(id);
  return entry ? (entry.data as T) : null;
}

async function writeCache(id: string, data: unknown): Promise<void> {
  await db.budgetViewCache.put({ id, data, cachedAt: new Date().toISOString() });
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetches the computed Budget View for a given date range.
 * Falls back to the last cached response for this range when offline.
 */
export function useBudgetView(start: string, end: string) {
  return useQuery({
    queryKey: [...BUDGET_VIEW_KEY, start, end],
    queryFn: async () => {
      const cacheKey = `budget-view:${start}:${end}`;
      try {
        const res = await budgetLineApi.getBudgetView(start, end);
        const budgetView = res.data.data.budgetView;
        void writeCache(cacheKey, budgetView);
        return budgetView;
      } catch (err) {
        if (isOfflineError(err)) {
          const cached = await readCache<BudgetView>(cacheKey);
          if (cached) return cached;
        }
        throw err;
      }
    },
    enabled: Boolean(start) && Boolean(end),
    networkMode: 'always',
    retry: false,
  });
}

/**
 * Fetches the current pay period derived from the pay-period-anchor Budget Line.
 * Returns null if no anchor is set. Falls back to cached value when offline.
 */
export function usePayPeriod() {
  return useQuery({
    queryKey: PAY_PERIOD_KEY,
    queryFn: async () => {
      const cacheKey = 'pay-period';
      try {
        const res = await budgetLineApi.getPayPeriod();
        const payPeriod = res.data.data.payPeriod;
        void writeCache(cacheKey, payPeriod);
        return payPeriod;
      } catch (err) {
        if (isOfflineError(err)) {
          const cached = await readCache<PayPeriod | null>(cacheKey);
          if (cached !== null) return cached;
        }
        throw err;
      }
    },
    networkMode: 'always',
    retry: false,
  });
}

/**
 * Fetches upcoming fixed expense occurrences and (optionally) prorated flexible amounts
 * within a given date window. Falls back to cached response when offline.
 */
export function useUpcomingExpenses(
  start: string,
  end: string,
  includeFlexible = false,
) {
  return useQuery({
    queryKey: [...BUDGET_VIEW_KEY, 'upcoming', start, end, includeFlexible],
    queryFn: async () => {
      const cacheKey = `upcoming:${start}:${end}:${String(includeFlexible)}`;
      try {
        const res = await budgetLineApi.getUpcoming(start, end, includeFlexible);
        const upcoming = res.data.data.upcoming;
        void writeCache(cacheKey, upcoming);
        return upcoming;
      } catch (err) {
        if (isOfflineError(err)) {
          const cached = await readCache<UpcomingExpensesResponse>(cacheKey);
          if (cached) return cached;
        }
        throw err;
      }
    },
    enabled: Boolean(start) && Boolean(end),
    networkMode: 'always',
    retry: false,
  });
}
