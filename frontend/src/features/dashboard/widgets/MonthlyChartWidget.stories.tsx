import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { expect, userEvent, within } from '@storybook/test';
import { MonthlyChartWidget } from './MonthlyChartWidget';
import { mockMonthlySummary, mockForecast } from './__fixtures__/mockData';

function makeQC(summaryData?: unknown, forecastData?: unknown): QueryClient {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  if (summaryData !== undefined) qc.setQueryData(['reports', 'monthly-summary', 6], summaryData);
  if (forecastData !== undefined) qc.setQueryData(['reports', 'forecast', 3], forecastData);
  return qc;
}

const withChartData = (summaryData?: unknown, forecastData?: unknown): Decorator =>
  (Story) => (
    <QueryClientProvider client={makeQC(summaryData, forecastData)}>
      <div style={{ width: 600, height: 300 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );

const meta: Meta<typeof MonthlyChartWidget> = {
  component: MonthlyChartWidget,
  title: 'Dashboard/MonthlyChartWidget',
};
export default meta;

type Story = StoryObj<typeof MonthlyChartWidget>;

export const Loaded: Story = {
  decorators: [withChartData(mockMonthlySummary, mockForecast)],
};

export const Loading: Story = {
  decorators: [withChartData()],
};

export const Empty: Story = {
  decorators: [withChartData([], [])],
};

export const InteractionForecastToggle: Story = {
  decorators: [withChartData(mockMonthlySummary, mockForecast)],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Forecast checkbox starts unchecked; forecast note is not visible
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).not.toBeChecked();

    // Enable forecast
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    // Forecast note should appear
    await expect(canvas.getByText(/forecast/i)).toBeInTheDocument();
  },
};
