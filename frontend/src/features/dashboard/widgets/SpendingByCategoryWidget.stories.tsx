import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpendingByCategoryWidget } from './SpendingByCategoryWidget';
import { mockSpendingByCategory } from './__fixtures__/mockData';

const today = new Date();
const start = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const end = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${lastDay}`;

function makeQC(data?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (data !== undefined)
    qc.setQueryData(['reports', 'spending-by-category', start, end, 'expense'], data);
  return qc;
}

const withData = (data?: unknown): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(data)}>
      <div style={{ width: 500, height: 340 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof SpendingByCategoryWidget> = {
  component: SpendingByCategoryWidget,
  title: 'Dashboard/SpendingByCategoryWidget',
};
export default meta;

type Story = StoryObj<typeof SpendingByCategoryWidget>;

export const Loaded: Story = {
  decorators: [withData(mockSpendingByCategory)],
};

export const Loading: Story = {
  decorators: [withData()],
};

export const Empty: Story = {
  decorators: [withData({ ...mockSpendingByCategory, categories: [] })],
};
