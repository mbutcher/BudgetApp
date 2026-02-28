import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DebtPayoffWidget } from './DebtPayoffWidget';
import { mockAccounts, mockDebtSchedule, mockAmortizationSchedule } from './__fixtures__/mockData';

const debtAccounts = mockAccounts.filter((a) => !a.isAsset);

function makeQC(accountsData?: unknown, withSchedule = false): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (accountsData !== undefined) qc.setQueryData(['accounts'], accountsData);
  if (withSchedule && debtAccounts.length > 0) {
    const first = debtAccounts[0];
    if (first) {
      qc.setQueryData(['debt', 'schedule', first.id], mockDebtSchedule);
      qc.setQueryData(['debt', 'amortization', first.id], mockAmortizationSchedule);
    }
  }
  return qc;
}

const withData = (accountsData?: unknown, withSchedule = false): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(accountsData, withSchedule)}>
      <div style={{ width: 480, height: 280 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof DebtPayoffWidget> = {
  component: DebtPayoffWidget,
  title: 'Dashboard/DebtPayoffWidget',
};
export default meta;

type Story = StoryObj<typeof DebtPayoffWidget>;

export const Loaded: Story = {
  decorators: [withData(debtAccounts, true)],
};

export const NoSchedule: Story = {
  decorators: [withData(debtAccounts, false)],
};

export const Loading: Story = {
  decorators: [withData()],
};

export const Empty: Story = {
  decorators: [withData([])],
};
