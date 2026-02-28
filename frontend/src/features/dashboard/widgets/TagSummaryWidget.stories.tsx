import type { Meta, StoryObj } from '@storybook/react';
import { TagSummaryWidget } from './TagSummaryWidget';

const meta: Meta<typeof TagSummaryWidget> = {
  component: TagSummaryWidget,
  title: 'Dashboard/TagSummaryWidget',
};
export default meta;

type Story = StoryObj<typeof TagSummaryWidget>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 400, height: 220 }}>
        <Story />
      </div>
    ),
  ],
};
