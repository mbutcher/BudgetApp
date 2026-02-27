import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountBalancesWidget } from './AccountBalancesWidget';
import { mockAccounts } from './__fixtures__/mockData';

function makeQC(data?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (data !== undefined) qc.setQueryData(['accounts'], data);
  return qc;
}

const withAccounts = (data?: unknown): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(data)}>
      <div style={{ width: 500, height: 220 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof AccountBalancesWidget> = {
  component: AccountBalancesWidget,
  title: 'Dashboard/AccountBalancesWidget',
  args: { excludedAccountIds: [] },
};
export default meta;

type Story = StoryObj<typeof AccountBalancesWidget>;

export const Loaded: Story = {
  decorators: [withAccounts(mockAccounts)],
};

export const Loading: Story = {
  decorators: [withAccounts(/* no data — query stays pending */)],
};

export const Empty: Story = {
  decorators: [withAccounts([])],
};
