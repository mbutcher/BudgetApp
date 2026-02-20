import { apiClient } from '@lib/api/client';
import type {
  DebtSchedule,
  UpsertDebtScheduleInput,
  AmortizationSchedule,
  WhatIfResult,
  TransactionSplit,
} from '../types';

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const debtApi = {
  getSchedule: (accountId: string) =>
    apiClient.get<ApiResponse<{ schedule: DebtSchedule }>>(
      `/debt/schedule/${accountId}`
    ),

  upsertSchedule: (accountId: string, data: UpsertDebtScheduleInput) =>
    apiClient.put<ApiResponse<{ schedule: DebtSchedule }>>(
      `/debt/schedule/${accountId}`,
      data
    ),

  deleteSchedule: (accountId: string) =>
    apiClient.delete<ApiResponse<null>>(`/debt/schedule/${accountId}`),

  getAmortizationSchedule: (accountId: string) =>
    apiClient.get<ApiResponse<AmortizationSchedule>>(
      `/debt/amortization/${accountId}`
    ),

  whatIfExtraPayment: (accountId: string, extraMonthly: number) =>
    apiClient.get<ApiResponse<WhatIfResult>>(
      `/debt/what-if/${accountId}?extraMonthly=${extraMonthly}`
    ),

  getSplit: (transactionId: string) =>
    apiClient.get<ApiResponse<{ split: TransactionSplit | null }>>(
      `/debt/split/${transactionId}`
    ),
};
