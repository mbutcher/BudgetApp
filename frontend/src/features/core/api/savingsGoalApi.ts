import { apiClient } from '@lib/api/client';
import type {
  SavingsGoal,
  CreateSavingsGoalInput,
  UpdateSavingsGoalInput,
  SavingsGoalProgress,
} from '../types';

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const savingsGoalApi = {
  list: () =>
    apiClient.get<ApiResponse<{ goals: SavingsGoal[] }>>('/savings-goals'),

  get: (id: string) =>
    apiClient.get<ApiResponse<{ goal: SavingsGoal }>>(`/savings-goals/${id}`),

  create: (data: CreateSavingsGoalInput) =>
    apiClient.post<ApiResponse<{ goal: SavingsGoal }>>('/savings-goals', data),

  update: (id: string, data: UpdateSavingsGoalInput) =>
    apiClient.patch<ApiResponse<{ goal: SavingsGoal }>>(`/savings-goals/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/savings-goals/${id}`),

  getProgress: (id: string) =>
    apiClient.get<ApiResponse<{ progress: SavingsGoalProgress }>>(`/savings-goals/${id}/progress`),
};
