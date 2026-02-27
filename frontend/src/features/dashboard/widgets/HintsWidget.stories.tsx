import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HintsWidget } from './HintsWidget';
import { mockHints } from './__fixtures__/mockData';
import { useNetworkStore } from '@stores/networkStore';

function makeQC(hints?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (hints !== undefined) qc.setQueryData(['dashboard', 'hints'], hints);
  return qc;
}

const withData = (hints?: unknown): Decorator =>
  (Story) => {
    // Ensure network store reports online so the query is enabled
    useNetworkStore.setState({ isOnline: true });
    return (
      <QueryClientProvider client={makeQC(hints)}>
        <div style={{ width: 500, height: 220 }}>
          <Story />
        </div>
      </QueryClientProvider>
    );
  };

const meta: Meta<typeof HintsWidget> = {
  component: HintsWidget,
  title: 'Dashboard/HintsWidget',
};
export default meta;

type Story = StoryObj<typeof HintsWidget>;

export const Loaded: Story = {
  decorators: [withData(mockHints)],
};

export const Loading: Story = {
  decorators: [withData()],
};

export const Empty: Story = {
  decorators: [withData([])],
};
