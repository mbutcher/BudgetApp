import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../api/reportApi';

export function useMonthlySummary(months = 6) {
  return useQuery({
    queryKey: ['reports', 'monthly-summary', months],
    queryFn: async () => {
      const res = await reportApi.monthlySummary(months);
      return res.data.data.summary;
    },
  });
}

export function useForecast(months = 3) {
  return useQuery({
    queryKey: ['reports', 'forecast', months],
    queryFn: async () => {
      const res = await reportApi.forecast(months);
      return res.data.data.forecast;
    },
  });
}
