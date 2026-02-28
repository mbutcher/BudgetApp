import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MonthlyChartWidget } from './MonthlyChartWidget';
import { mockMonthlySummary } from './__fixtures__/mockData';

function makeQC(summaryData?: unknown, months = 6): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (summaryData !== undefined) qc.setQueryData(['reports', 'monthly-summary', months], summaryData);
  return qc;
}

const withChartData = (summaryData?: unknown): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(summaryData)}>
      <div style={{ width: 600, height: 300 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof MonthlyChartWidget> = {
  component: MonthlyChartWidget,
  title: 'Dashboard/MonthlyChartWidget',
};
export default meta;

type Story = StoryObj<typeof MonthlyChartWidget>;

export const Loaded: Story = {
  decorators: [withChartData(mockMonthlySummary)],
};

export const Loading: Story = {
  decorators: [withChartData()],
};

export const Empty: Story = {
  decorators: [withChartData([])],
};
