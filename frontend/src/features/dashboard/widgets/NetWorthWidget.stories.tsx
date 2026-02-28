import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NetWorthWidget } from './NetWorthWidget';
import { mockAccounts, mockNetWorthHistory } from './__fixtures__/mockData';

function makeQC(accountData?: unknown, netWorthData?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (accountData !== undefined) qc.setQueryData(['accounts'], accountData);
  // NetWorthWidget now uses 6 months of history for the sparkline
  if (netWorthData !== undefined) qc.setQueryData(['reports', 'net-worth', 6], netWorthData);
  return qc;
}

const withData = (accountData?: unknown, netWorthData?: unknown): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(accountData, netWorthData)}>
      <div style={{ width: 380, height: 200 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof NetWorthWidget> = {
  component: NetWorthWidget,
  title: 'Dashboard/NetWorthWidget',
  args: { excludedAccountIds: [] },
};
export default meta;

type Story = StoryObj<typeof NetWorthWidget>;

export const Loaded: Story = {
  decorators: [withData(mockAccounts, mockNetWorthHistory)],
};

export const Loading: Story = {
  decorators: [withData()],
};

export const Empty: Story = {
  decorators: [withData([], { snapshots: [], latest: null })],
};
