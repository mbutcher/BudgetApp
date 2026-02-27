import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta = {
  title: 'UI/Separator',
};
export default meta;

type Story = StoryObj;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p className="text-sm">Section A</p>
      <Separator />
      <p className="text-sm">Section B</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};
