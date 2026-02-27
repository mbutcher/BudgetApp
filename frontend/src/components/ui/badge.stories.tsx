import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'UI/Badge',
  args: { children: 'Badge' },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Destructive: Story = { args: { variant: 'destructive', children: 'Over budget' } };

export const Outline: Story = { args: { variant: 'outline', children: 'Pending' } };
