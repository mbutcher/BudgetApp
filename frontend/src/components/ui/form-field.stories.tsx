import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './form-field';
import { Input } from './input';

const meta: Meta = {
  title: 'UI/FormField',
};
export default meta;

type Story = StoryObj;

export const NoError: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="Email address" htmlFor="email">
        <Input id="email" type="email" placeholder="you@example.com" />
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="Email address" htmlFor="email-err" error="Please enter a valid email.">
        <Input
          id="email-err"
          type="email"
          defaultValue="not-an-email"
          className="border-destructive focus-visible:ring-destructive"
        />
      </FormField>
    </div>
  ),
};
