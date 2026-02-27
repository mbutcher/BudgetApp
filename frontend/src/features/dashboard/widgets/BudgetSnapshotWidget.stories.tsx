import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { BudgetSnapshotWidget } from './BudgetSnapshotWidget';
import { mockBudgetView } from './__fixtures__/mockData';

// Compute the current month's date range — matches what monthWindow() returns internally
const today = new Date();
const monthStart = format(startOfMonth(today), 'yyyy-MM-dd');
const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd');

function makeQC(data?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (data !== undefined) {
    // Pre-populate for any budget-view query with current month dates
    qc.setQueryData(['budget-view', monthStart, monthEnd], data);
  }
  return qc;
}

const withBudget = (data?: unknown): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(data)}>
      <div style={{ width: 500, height: 320 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof BudgetSnapshotWidget> = {
  component: BudgetSnapshotWidget,
  title: 'Dashboard/BudgetSnapshotWidget',
};
export default meta;

type Story = StoryObj<typeof BudgetSnapshotWidget>;

export const Loaded: Story = {
  decorators: [withBudget(mockBudgetView)],
};

export const Loading: Story = {
  decorators: [withBudget()],
};

export const Empty: Story = {
  decorators: [withBudget({ ...mockBudgetView, lines: [] })],
};
