import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from '@storybook/test';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta: Meta = {
  title: 'UI/Tabs',
};
export default meta;

type Story = StoryObj;

function TabsDemo({ defaultTab = 'overview' }: { defaultTab?: string }) {
  const [tab, setTab] = useState(defaultTab);
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="p-4 text-sm">Overview tab content.</p>
      </TabsContent>
      <TabsContent value="transactions">
        <p className="p-4 text-sm">Transactions tab content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="p-4 text-sm">Settings tab content.</p>
      </TabsContent>
    </Tabs>
  );
}

export const FirstTabActive: Story = {
  render: () => <TabsDemo defaultTab="overview" />,
};

export const SecondTabActive: Story = {
  render: () => <TabsDemo defaultTab="transactions" />,
};

export const InteractionSwitchTabs: Story = {
  render: () => <TabsDemo defaultTab="overview" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initially on Overview
    await expect(canvas.getByText('Overview tab content.')).toBeInTheDocument();

    // Click Transactions tab
    const txTab = canvas.getByRole('button', { name: /transactions/i });
    await userEvent.click(txTab);

    // Transactions content is now visible; Overview content is gone
    await expect(canvas.getByText('Transactions tab content.')).toBeInTheDocument();
    await expect(canvas.queryByText('Overview tab content.')).not.toBeInTheDocument();
  },
};
