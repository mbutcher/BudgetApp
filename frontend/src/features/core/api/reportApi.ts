import { apiClient } from '@lib/api/client';
import type { ForecastMonth } from '../types';

interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface MonthlySummaryEntry {
  month: string;   // 'YYYY-MM'
  income: number;
  expenses: number;
  isForecast?: boolean;
}

export const reportApi = {
  monthlySummary: (months = 6) =>
    apiClient.get<ApiResponse<{ summary: MonthlySummaryEntry[] }>>(
      `/reports/monthly-summary?months=${months}`
    ),

  forecast: (months = 3) =>
    apiClient.get<ApiResponse<{ forecast: ForecastMonth[] }>>(
      `/reports/forecast?months=${months}`
    ),
};
