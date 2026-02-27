import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecentTransactionsWidget } from './RecentTransactionsWidget';
import {
  mockPaginatedTransactions,
  mockUser,
} from './__fixtures__/mockData';
import { useAuthStore } from '@features/auth/stores/authStore';

function makeQC(data?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  // RecentTransactionsWidget calls useTransactions({ limit: 10, page: 1 })
  if (data !== undefined) qc.setQueryData(['transactions', { limit: 10, page: 1 }], data);
  return qc;
}

const withData = (data?: unknown): Decorator =>
  (Story) => {
    useAuthStore.setState({ user: mockUser as Parameters<typeof useAuthStore.setState>[0]['user'] });
    return (
      <QueryClientProvider client={makeQC(data)}>
        <div style={{ width: 500, height: 380 }}>
          <Story />
        </div>
      </QueryClientProvider>
    );
  };

const meta: Meta<typeof RecentTransactionsWidget> = {
  component: RecentTransactionsWidget,
  title: 'Dashboard/RecentTransactionsWidget',
};
export default meta;

type Story = StoryObj<typeof RecentTransactionsWidget>;

export const Loaded: Story = {
  decorators: [withData(mockPaginatedTransactions)],
};

export const Loading: Story = {
  decorators: [withData()],
};

export const Empty: Story = {
  decorators: [withData({ data: [], total: 0, page: 1, limit: 10 })],
};
