import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debtApi } from '../api/debtApi';
import type { UpsertDebtScheduleInput } from '../types';

interface ApiError {
  response?: { status: number };
}

export function useDebtSchedule(accountId: string) {
  return useQuery({
    queryKey: ['debt', 'schedule', accountId],
    queryFn: async () => {
      const res = await debtApi.getSchedule(accountId);
      return res.data.data.schedule;
    },
    // 404 means no schedule configured yet — not an error
    retry: (_, err: ApiError) => err.response?.status !== 404,
    enabled: !!accountId,
  });
}

export function useAmortizationSchedule(accountId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['debt', 'amortization', accountId],
    queryFn: async () => {
      const res = await debtApi.getAmortizationSchedule(accountId);
      return res.data.data;
    },
    enabled: !!accountId && enabled,
  });
}

export function useWhatIf(accountId: string, extraMonthly: number | null) {
  return useQuery({
    queryKey: ['debt', 'what-if', accountId, extraMonthly],
    queryFn: async () => {
      const res = await debtApi.whatIfExtraPayment(accountId, extraMonthly!);
      return res.data.data;
    },
    enabled: !!accountId && extraMonthly !== null && extraMonthly > 0,
  });
}

export function useTransactionSplit(transactionId: string | null) {
  return useQuery({
    queryKey: ['debt', 'split', transactionId],
    queryFn: async () => {
      const res = await debtApi.getSplit(transactionId!);
      return res.data.data.split;
    },
    enabled: !!transactionId,
  });
}

export function useUpsertDebtSchedule(accountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertDebtScheduleInput) => debtApi.upsertSchedule(accountId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['debt', 'schedule', accountId] });
      void queryClient.invalidateQueries({ queryKey: ['debt', 'amortization', accountId] });
    },
  });
}

export function useDeleteDebtSchedule(accountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => debtApi.deleteSchedule(accountId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['debt', 'schedule', accountId] });
      void queryClient.invalidateQueries({ queryKey: ['debt', 'amortization', accountId] });
    },
  });
}
