import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'UI/Button',
  args: { children: 'Button' },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Outline: Story = { args: { variant: 'outline' } };

export const Ghost: Story = { args: { variant: 'ghost' } };

export const Destructive: Story = { args: { variant: 'destructive' } };

export const Link: Story = { args: { variant: 'link' } };

export const Small: Story = { args: { size: 'sm' } };

export const Large: Story = { args: { size: 'lg' } };

export const Disabled: Story = { args: { disabled: true } };

export const Loading: Story = { args: { isLoading: true } };
