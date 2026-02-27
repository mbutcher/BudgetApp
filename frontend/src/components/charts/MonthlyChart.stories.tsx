import type { Meta, StoryObj } from '@storybook/react';
import { MonthlyChart } from './MonthlyChart';
import { mockMonthlySummary, mockForecast } from '@features/dashboard/widgets/__fixtures__/mockData';

const meta: Meta<typeof MonthlyChart> = {
  component: MonthlyChart,
  title: 'Charts/MonthlyChart',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof MonthlyChart>;

export const SixMonths: Story = {
  args: { data: mockMonthlySummary },
};

export const WithForecast: Story = {
  args: { data: [...mockMonthlySummary, ...mockForecast] },
};

export const Empty: Story = {
  args: { data: [] },
};
