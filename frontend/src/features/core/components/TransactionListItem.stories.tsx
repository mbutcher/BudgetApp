import type { Meta, StoryObj } from '@storybook/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { TransactionListItem } from './TransactionListItem';
import { mockAccounts, mockTransactionList } from '@features/dashboard/widgets/__fixtures__/mockData';
import type { Category } from '../types';

const mockCategory: Category = {
  id: 'cat-1',
  householdId: 'hh-1',
  name: 'Groceries',
  color: '#22c55e',
  icon: null,
  isIncome: false,
  parentId: null,
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const mockIncomeCategory: Category = {
  ...mockCategory,
  id: 'cat-income',
  name: 'Salary & Wages',
  color: '#3b82f6',
  isIncome: true,
};

const account = mockAccounts[0]!;

const meta: Meta<typeof TransactionListItem> = {
  component: TransactionListItem,
  title: 'Layout/TransactionListItem',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => {
      const qc = useQueryClient();
      useEffect(() => {
        qc.setQueryData(['accounts'], mockAccounts);
      }, [qc]);
      return (
        <div className="max-w-2xl space-y-1">
          <Story />
        </div>
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof TransactionListItem>;

const tx = mockTransactionList[0]!;

export const Expense: Story = {
  args: {
    transaction: tx,
    category: mockCategory,
    account,
    onEdit: () => {},
  },
};

export const Income: Story = {
  args: {
    transaction: { ...mockTransactionList[2]!, amount: 2500 },
    category: mockIncomeCategory,
    account,
    onEdit: () => {},
  },
};

export const Transfer: Story = {
  args: {
    transaction: { ...tx, id: 'tx-transfer', isTransfer: true, payee: 'Credit Card Payment', amount: -1200 },
    category: mockCategory,
    account,
    onEdit: () => {},
  },
};

export const WithTags: Story = {
  args: {
    transaction: { ...tx, tags: ['vacation', 'dining', 'client'], isCleared: false },
    category: mockCategory,
    account,
    onEdit: () => {},
  },
};

export const ManyTags: Story = {
  args: {
    transaction: { ...tx, tags: ['vacation', 'dining', 'client', 'q1', 'reimbursable'] },
    category: mockCategory,
    account,
    onEdit: () => {},
  },
};

export const Uncleared: Story = {
  args: {
    transaction: { ...tx, isCleared: false },
    category: null,
    account,
    onEdit: () => {},
  },
};

export const NoCategory: Story = {
  args: {
    transaction: { ...tx, categoryId: null },
    category: null,
    account,
    onEdit: () => {},
  },
};

export const ReadOnly: Story = {
  args: {
    transaction: tx,
    category: mockCategory,
    account,
  },
};
