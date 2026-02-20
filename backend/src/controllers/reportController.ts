import type { Request, Response } from 'express';
import { asyncHandler } from '@middleware/errorHandler';
import { getDatabase } from '@config/database';
import { forecastService } from '@services/core/forecastService';

interface MonthlySummaryRow {
  month: string;
  income: string | number;
  expenses: string | number;
}

class ReportController {
  monthlySummary = asyncHandler(async (req: Request, res: Response) => {
    const rawMonths = req.query['months'];
    const months = Math.min(Math.max(parseInt(String(rawMonths ?? '6'), 10) || 6, 1), 24);

    const db = getDatabase();
    const rows = (await db('transactions')
      .where({ user_id: req.user!.id, is_transfer: false })
      .where('date', '>=', db.raw('DATE_SUB(CURDATE(), INTERVAL ? MONTH)', [months]))
      .select(db.raw("DATE_FORMAT(date, '%Y-%m') as month"))
      .sum({ income: db.raw('CASE WHEN amount > 0 THEN amount ELSE 0 END') })
      .sum({ expenses: db.raw('CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END') })
      .groupBy('month')
      .orderBy('month', 'asc')) as MonthlySummaryRow[];

    const data = rows.map((row) => ({
      month: row['month'],
      income: Number(row['income']),
      expenses: Number(row['expenses']),
    }));

    res.json({ status: 'success', data: { summary: data } });
  });

  forecast = asyncHandler(async (req: Request, res: Response) => {
    const rawMonths = req.query['months'];
    const months = Math.min(Math.max(parseInt(String(rawMonths ?? '3'), 10) || 3, 1), 12);
    const data = await forecastService.getForecast(req.user!.id, months);
    res.json({ status: 'success', data: { forecast: data } });
  });
}

export const reportController = new ReportController();
