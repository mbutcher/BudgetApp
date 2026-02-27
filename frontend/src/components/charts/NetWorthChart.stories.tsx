import type { Meta, StoryObj } from '@storybook/react';
import { NetWorthChart } from './NetWorthChart';
import type { NetWorthSnapshot } from '@features/core/types';

const meta: Meta<typeof NetWorthChart> = {
  component: NetWorthChart,
  title: 'Charts/NetWorthChart',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof NetWorthChart>;

const base: NetWorthSnapshot = {
  id: '',
  userId: 'u1',
  snapshotDate: '',
  totalAssets: 0,
  totalLiabilities: 0,
  netWorth: 0,
  createdAt: '2026-01-01T00:00:00Z',
};

export const PositiveTrend: Story = {
  args: {
    snapshots: [
      { ...base, id: '1', snapshotDate: '2025-09-01', totalAssets: 10000, totalLiabilities: 8000, netWorth: 2000 },
      { ...base, id: '2', snapshotDate: '2025-10-01', totalAssets: 11500, totalLiabilities: 7800, netWorth: 3700 },
      { ...base, id: '3', snapshotDate: '2025-11-01', totalAssets: 12000, totalLiabilities: 7600, netWorth: 4400 },
      { ...base, id: '4', snapshotDate: '2025-12-01', totalAssets: 13500, totalLiabilities: 7200, netWorth: 6300 },
      { ...base, id: '5', snapshotDate: '2026-01-01', totalAssets: 14200, totalLiabilities: 7000, netWorth: 7200 },
      { ...base, id: '6', snapshotDate: '2026-02-01', totalAssets: 15921, totalLiabilities: 6800, netWorth: 9121 },
    ],
  },
};

export const NegativeTrend: Story = {
  args: {
    snapshots: [
      { ...base, id: '1', snapshotDate: '2025-09-01', totalAssets: 8000, totalLiabilities: 12000, netWorth: -4000 },
      { ...base, id: '2', snapshotDate: '2025-10-01', totalAssets: 7800, totalLiabilities: 12500, netWorth: -4700 },
      { ...base, id: '3', snapshotDate: '2025-11-01', totalAssets: 7500, totalLiabilities: 13200, netWorth: -5700 },
      { ...base, id: '4', snapshotDate: '2025-12-01', totalAssets: 7200, totalLiabilities: 14000, netWorth: -6800 },
      { ...base, id: '5', snapshotDate: '2026-01-01', totalAssets: 7000, totalLiabilities: 14800, netWorth: -7800 },
      { ...base, id: '6', snapshotDate: '2026-02-01', totalAssets: 6800, totalLiabilities: 15500, netWorth: -8700 },
    ],
  },
};

export const Flat: Story = {
  args: {
    snapshots: [
      { ...base, id: '1', snapshotDate: '2025-09-01', totalAssets: 10000, totalLiabilities: 8000, netWorth: 2000 },
      { ...base, id: '2', snapshotDate: '2025-10-01', totalAssets: 10050, totalLiabilities: 8030, netWorth: 2020 },
      { ...base, id: '3', snapshotDate: '2025-11-01', totalAssets: 9980, totalLiabilities: 7990, netWorth: 1990 },
      { ...base, id: '4', snapshotDate: '2025-12-01', totalAssets: 10010, totalLiabilities: 8010, netWorth: 2000 },
    ],
  },
};
