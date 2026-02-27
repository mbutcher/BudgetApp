import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';

const meta: Meta = {
  title: 'UI/Card',
};
export default meta;

type Story = StoryObj;

export const Full: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Account Balance</CardTitle>
        <CardDescription>Your TD Chequing account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">$3,421.50</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          View Transactions
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const BodyOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">Content only card with no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderAndBody: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Configure your preferences here.</p>
      </CardContent>
    </Card>
  ),
};
