import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { UpcomingExpensesWidget } from './UpcomingExpensesWidget';
import { mockAccounts, mockPayPeriod, mockUpcomingExpenses } from './__fixtures__/mockData';

// Compute next-30-day date range for the upcoming expenses key
const today = new Date();
const upcomingStart = format(today, 'yyyy-MM-dd');
const upcomingEnd = format(addDays(today, 30), 'yyyy-MM-dd');

function makeQC(upcomingData?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  qc.setQueryData(['accounts'], mockAccounts);
  qc.setQueryData(['pay-period'], mockPayPeriod);
  // Pre-populate for the likely period key combinations
  if (upcomingData !== undefined) {
    qc.setQueryData(['budget-view', 'upcoming', upcomingStart, upcomingEnd, false], upcomingData);
    // Also set for pay period dates (component may use these instead)
    qc.setQueryData(
      ['budget-view', 'upcoming', mockPayPeriod.start, mockPayPeriod.end, false],
      upcomingData,
    );
  }
  return qc;
}

const withData = (upcomingData?: unknown): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(upcomingData)}>
      <div style={{ width: 500, height: 380 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof UpcomingExpensesWidget> = {
  component: UpcomingExpensesWidget,
  title: 'Dashboard/UpcomingExpensesWidget',
};
export default meta;

type Story = StoryObj<typeof UpcomingExpensesWidget>;

export const Loaded: Story = {
  decorators: [withData(mockUpcomingExpenses)],
};

export const Loading: Story = {
  decorators: [withData()],
};

export const Empty: Story = {
  decorators: [withData({ start: upcomingStart, end: upcomingEnd, fixedItems: [], flexibleItems: [] })],
};
