import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { expect, userEvent, within } from '@storybook/test';
import { WarningsWidget } from './WarningsWidget';
import {
  mockAccounts,
  mockNegativeAssetAccount,
  mockSavingsGoals,
  mockSavingsGoalProgress,
} from './__fixtures__/mockData';

function makeQC(accounts?: unknown, goals?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (accounts !== undefined) qc.setQueryData(['accounts'], accounts);
  if (goals !== undefined) {
    qc.setQueryData(['savings-goals'], goals);
    for (const [id, progress] of Object.entries(mockSavingsGoalProgress)) {
      qc.setQueryData(['savings-goals', id, 'progress'], progress);
    }
  }
  return qc;
}

const withData = (accounts?: unknown, goals?: unknown): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(accounts, goals)}>
      <div style={{ width: 480, height: 220 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof WarningsWidget> = {
  component: WarningsWidget,
  title: 'Dashboard/WarningsWidget',
  args: { excludedAccountIds: [] },
};
export default meta;

type Story = StoryObj<typeof WarningsWidget>;

/** No warnings — shows the "All clear" state. */
export const NoWarnings: Story = {
  decorators: [withData(mockAccounts, [])],
};

/** One negative-balance asset triggers a warning. */
export const WithWarning: Story = {
  decorators: [withData([...mockAccounts, mockNegativeAssetAccount], [])],
};

export const Loading: Story = {
  decorators: [withData()],
};

/** Collapse / expand the warnings accordion. */
export const InteractionCollapseExpand: Story = {
  decorators: [withData([...mockAccounts, mockNegativeAssetAccount], mockSavingsGoals)],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Warning content is visible by default (expanded)
    const toggleBtn = canvas.getByRole('button');
    await expect(toggleBtn).toBeInTheDocument();

    // Collapse the warnings
    await userEvent.click(toggleBtn);

    // The warning messages should no longer be in the DOM
    await expect(
      canvas.queryByText(/overdrawn chequing/i),
    ).not.toBeInTheDocument();

    // Expand again
    await userEvent.click(toggleBtn);

    // Warning message is visible again
    await expect(
      canvas.getByText(/overdrawn chequing/i),
    ).toBeInTheDocument();
  },
};
