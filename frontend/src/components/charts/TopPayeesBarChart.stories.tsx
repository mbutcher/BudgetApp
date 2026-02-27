import type { Meta, StoryObj } from '@storybook/react';
import { TopPayeesBarChart } from './TopPayeesBarChart';
import type { TopPayeeItem } from '@features/core/types';

const meta: Meta<typeof TopPayeesBarChart> = {
  component: TopPayeesBarChart,
  title: 'Charts/TopPayeesBarChart',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof TopPayeesBarChart>;

const mockPayees: TopPayeeItem[] = [
  { payee: 'Metro Grocery', totalAmount: 1247.83, percentage: 28 },
  { payee: 'Shell Gas', totalAmount: 623.5, percentage: 14 },
  { payee: 'Netflix', totalAmount: 179.88, percentage: 4 },
  { payee: 'Tim Hortons', totalAmount: 148.2, percentage: 3.3 },
  { payee: 'LCBO', totalAmount: 132.4, percentage: 3 },
];

const total = mockPayees.reduce((s, p) => s + p.totalAmount, 0);

export const TopFive: Story = {
  args: { payees: mockPayees, total },
};

export const Empty: Story = {
  args: { payees: [], total: 0 },
};
