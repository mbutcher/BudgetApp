import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SavingsGoalsWidget } from './SavingsGoalsWidget';
import {
  mockSavingsGoals,
  mockSavingsGoalProgress,
  mockUser,
} from './__fixtures__/mockData';
import { useAuthStore } from '@features/auth/stores/authStore';

function makeQC(goals?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (goals !== undefined) {
    qc.setQueryData(['savings-goals'], goals);
    // Pre-populate progress for each mock goal
    for (const [id, progress] of Object.entries(mockSavingsGoalProgress)) {
      qc.setQueryData(['savings-goals', id, 'progress'], progress);
    }
  }
  return qc;
}

const withData = (goals?: unknown): Decorator =>
  (Story) => {
    useAuthStore.setState({ user: mockUser as Parameters<typeof useAuthStore.setState>[0]['user'] });
    return (
      <QueryClientProvider client={makeQC(goals)}>
        <div style={{ width: 380, height: 320 }}>
          <Story />
        </div>
      </QueryClientProvider>
    );
  };

const meta: Meta<typeof SavingsGoalsWidget> = {
  component: SavingsGoalsWidget,
  title: 'Dashboard/SavingsGoalsWidget',
};
export default meta;

type Story = StoryObj<typeof SavingsGoalsWidget>;

export const Loaded: Story = {
  decorators: [withData(mockSavingsGoals)],
};

export const Loading: Story = {
  decorators: [withData()],
};

export const Empty: Story = {
  decorators: [withData([])],
};
