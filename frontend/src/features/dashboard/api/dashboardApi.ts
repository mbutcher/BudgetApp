import { apiClient } from '@lib/api/client';
import type { DashboardConfig, DashboardHint } from '../types/dashboard';

interface ConfigResponse {
  status: 'success';
  data: { config: DashboardConfig };
}

interface HintsResponse {
  status: 'success';
  data: { hints: DashboardHint[] };
}

export async function fetchDashboardConfig(): Promise<DashboardConfig> {
  const res = await apiClient.get<ConfigResponse>('/dashboard/config');
  return res.data.data.config;
}

export async function putDashboardConfig(config: DashboardConfig): Promise<DashboardConfig> {
  const res = await apiClient.put<ConfigResponse>('/dashboard/config', config);
  return res.data.data.config;
}

export async function fetchDashboardHints(): Promise<DashboardHint[]> {
  const res = await apiClient.get<HintsResponse>('/dashboard/hints');
  return res.data.data.hints;
}

export async function acknowledgeRollover(previousStart: string, previousEnd: string): Promise<void> {
  await apiClient.post('/dashboard/rollover-ack', { previousStart, previousEnd });
}

export async function markBudgetReviewComplete(): Promise<void> {
  await apiClient.post('/dashboard/budget-review-complete', {});
}
