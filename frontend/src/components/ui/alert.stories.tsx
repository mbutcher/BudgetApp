import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription } from './alert';

const meta: Meta = {
  title: 'UI/Alert',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertDescription>Your SimpleFIN sync completed successfully.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertDescription>Failed to connect to SimpleFIN. Check your access URL.</AlertDescription>
    </Alert>
  ),
};
