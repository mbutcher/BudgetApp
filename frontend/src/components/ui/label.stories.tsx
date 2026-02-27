import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';

const meta: Meta = {
  title: 'UI/Label',
};
export default meta;

type Story = StoryObj;

export const Standalone: Story = {
  render: () => <Label>Display name</Label>,
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-64">
      <Label htmlFor="display-name">Display name</Label>
      <Input id="display-name" placeholder="Jane Smith" />
    </div>
  ),
};

export const WithNativeCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <input type="checkbox" id="agree" className="rounded border-input" />
      <Label htmlFor="agree">I agree to the terms and conditions</Label>
    </div>
  ),
};
