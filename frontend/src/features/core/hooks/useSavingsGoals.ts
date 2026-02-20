import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savingsGoalApi } from '../api/savingsGoalApi';
import type { CreateSavingsGoalInput, UpdateSavingsGoalInput } from '../types';

export function useSavingsGoals() {
  return useQuery({
    queryKey: ['savings-goals'],
    queryFn: async () => {
      const res = await savingsGoalApi.list();
      return res.data.data.goals;
    },
  });
}

export function useSavingsGoal(id: string) {
  return useQuery({
    queryKey: ['savings-goals', id],
    queryFn: async () => {
      const res = await savingsGoalApi.get(id);
      return res.data.data.goal;
    },
    enabled: !!id,
  });
}

export function useSavingsGoalProgress(id: string) {
  return useQuery({
    queryKey: ['savings-goals', id, 'progress'],
    queryFn: async () => {
      const res = await savingsGoalApi.getProgress(id);
      return res.data.data.progress;
    },
    enabled: !!id,
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSavingsGoalInput) => savingsGoalApi.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
    },
  });
}

export function useUpdateSavingsGoal(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSavingsGoalInput) => savingsGoalApi.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      void queryClient.invalidateQueries({ queryKey: ['savings-goals', id] });
    },
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => savingsGoalApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
    },
  });
}
