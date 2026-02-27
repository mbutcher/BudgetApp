import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'UI/Input',
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Type something…' } };

export const WithValue: Story = { args: { defaultValue: 'Pre-filled value' } };

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true, defaultValue: 'Cannot edit' },
};

export const WithErrorStyle: Story = {
  args: {
    placeholder: 'Email address',
    defaultValue: 'not-an-email',
    className: 'border-destructive focus-visible:ring-destructive',
  },
};
