import type { Request, Response } from 'express';
import { asyncHandler, AppError } from '@middleware/errorHandler';
import {
  dashboardConfigRepository,
  buildDefaultConfig,
} from '@repositories/dashboardConfigRepository';
import { dashboardHintsService } from '@services/core/dashboardHintsService';
import type { DashboardConfig, WidgetId, DashboardLayouts } from '@typings/core.types';

const VALID_WIDGET_IDS = new Set<WidgetId>([
  'warnings',
  'net-worth',
  'account-balances',
  'budget-snapshot',
  'upcoming-expenses',
  'monthly-chart',
  'savings-goals',
  'recent-transactions',
  'hints',
  'spending-by-category',
  'debt-payoff',
  'tag-summary',
]);

const BREAKPOINTS = ['xs', 'sm', 'lg', 'xl'] as const;

function validateConfig(body: unknown): DashboardConfig | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;

  // widgetVisibility
  if (!b['widgetVisibility'] || typeof b['widgetVisibility'] !== 'object') return null;
  const vis = b['widgetVisibility'] as Record<string, boolean>;
  for (const k of Object.keys(vis)) {
    if (!VALID_WIDGET_IDS.has(k as WidgetId)) return null;
    if (typeof vis[k] !== 'boolean') return null;
  }

  // excludedAccountIds
  if (!Array.isArray(b['excludedAccountIds'])) return null;
  for (const id of b['excludedAccountIds'] as unknown[]) {
    if (typeof id !== 'string') return null;
  }

  // layouts
  if (!b['layouts'] || typeof b['layouts'] !== 'object') return null;
  const layouts = b['layouts'] as Record<string, unknown>;
  for (const bp of BREAKPOINTS) {
    if (!Array.isArray(layouts[bp])) return null;
  }

  return {
    userId: '', // filled in by controller
    widgetVisibility: vis as Record<WidgetId, boolean>,
    excludedAccountIds: b['excludedAccountIds'] as string[],
    layouts: b['layouts'] as DashboardLayouts,
    updatedAt: new Date(),
    // Rollover fields are preserved by putConfig after this call; default here to satisfy type
    acknowledgedRollovers: {},
    budgetLinesLastReviewedAt: null,
  };
}

class DashboardController {
  getConfig = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const existing = await dashboardConfigRepository.findByUserId(userId);
    const config = existing ?? buildDefaultConfig(userId);
    res.json({ status: 'success', data: { config } });
  });

  putConfig = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const validated = validateConfig(req.body);
    if (!validated) {
      throw new AppError('Invalid dashboard config body', 400);
    }
    validated.userId = userId;
    // warnings must always be visible
    validated.widgetVisibility['warnings'] = true;
    // Preserve rollover config fields — a PUT from an older frontend should not wipe them
    const existing = await dashboardConfigRepository.findByUserId(userId);
    validated.acknowledgedRollovers = existing?.acknowledgedRollovers ?? {};
    validated.budgetLinesLastReviewedAt = existing?.budgetLinesLastReviewedAt ?? null;
    const saved = await dashboardConfigRepository.upsert(validated);
    // Clear hint cache — excluded accounts may have changed
    dashboardHintsService.clearCache(userId);
    res.json({ status: 'success', data: { config: saved } });
  });

  getHints = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const hints = await dashboardHintsService.getHints(userId);
    res.json({ status: 'success', data: { hints } });
  });

  /** POST /dashboard/rollover-ack — acknowledge a completed rollover period. */
  acknowledgeRollover = asyncHandler(async (req: Request, res: Response) => {
    const { previousStart, previousEnd } = req.body as {
      previousStart: unknown;
      previousEnd: unknown;
    };
    const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
    if (
      typeof previousStart !== 'string' ||
      !ISO_DATE_RE.test(previousStart) ||
      typeof previousEnd !== 'string' ||
      !ISO_DATE_RE.test(previousEnd)
    ) {
      throw new AppError('previousStart and previousEnd must be valid ISO dates (YYYY-MM-DD)', 400);
    }
    const userId = req.user!.id;
    const existing = await dashboardConfigRepository.findByUserId(userId);
    const base = existing ?? buildDefaultConfig(userId);
    const key = `${previousStart}_${previousEnd}`;
    const updatedRollovers = { ...base.acknowledgedRollovers, [key]: new Date().toISOString() };
    if (existing) {
      await dashboardConfigRepository.patchRolloverConfig(userId, {
        acknowledgedRollovers: updatedRollovers,
      });
    } else {
      await dashboardConfigRepository.upsert({ ...base, acknowledgedRollovers: updatedRollovers });
    }
    dashboardHintsService.clearCache(userId);
    res.json({ status: 'success', data: null });
  });

  /** POST /dashboard/budget-review-complete — stamp the annual budget review timestamp. */
  completeBudgetReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const now = new Date();
    const existing = await dashboardConfigRepository.findByUserId(userId);
    if (existing) {
      await dashboardConfigRepository.patchRolloverConfig(userId, {
        budgetLinesLastReviewedAt: now,
      });
    } else {
      const base = buildDefaultConfig(userId);
      await dashboardConfigRepository.upsert({ ...base, budgetLinesLastReviewedAt: now });
    }
    dashboardHintsService.clearCache(userId);
    res.json({ status: 'success', data: null });
  });
}

export const dashboardController = new DashboardController();
