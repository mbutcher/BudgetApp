import type { Meta, StoryObj } from '@storybook/react';
import { SpendingPieChart } from './SpendingPieChart';
import type { SpendingByCategoryItem } from '@features/core/types';

const meta: Meta<typeof SpendingPieChart> = {
  component: SpendingPieChart,
  title: 'Charts/SpendingPieChart',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof SpendingPieChart>;

const mockCategories: SpendingByCategoryItem[] = [
  { categoryId: 'cat-1', categoryName: 'Groceries', parentId: null, color: '#22c55e', totalAmount: 423.5, percentage: 30 },
  { categoryId: 'cat-2', categoryName: 'Dining Out', parentId: null, color: '#f97316', totalAmount: 287.4, percentage: 20 },
  { categoryId: 'cat-3', categoryName: 'Transport', parentId: null, color: '#3b82f6', totalAmount: 215.0, percentage: 15 },
  { categoryId: 'cat-4', categoryName: 'Entertainment', parentId: null, color: '#a855f7', totalAmount: 180.0, percentage: 13 },
  { categoryId: 'cat-5', categoryName: 'Utilities', parentId: null, color: '#f43f5e', totalAmount: 310.0, percentage: 22 },
];

const total = mockCategories.reduce((s, c) => s + c.totalAmount, 0);

export const MultiCategory: Story = {
  args: { categories: mockCategories, total },
};

export const SingleCategory: Story = {
  args: {
    categories: [{ categoryId: 'cat-1', categoryName: 'Groceries', parentId: null, color: '#22c55e', totalAmount: 423.5, percentage: 100 }],
    total: 423.5,
  },
};

export const Empty: Story = {
  args: { categories: [], total: 0 },
};
