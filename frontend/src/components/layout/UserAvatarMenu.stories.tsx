import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { UserAvatarMenu } from './UserAvatarMenu';
import { useAuthStore } from '@features/auth/stores/authStore';
import { mockUser } from '@features/dashboard/widgets/__fixtures__/mockData';

const withAuthStore: Decorator = (Story) => {
  useAuthStore.setState({ user: mockUser as Parameters<typeof useAuthStore.setState>[0]['user'] });
  return <Story />;
};

const meta: Meta<typeof UserAvatarMenu> = {
  component: UserAvatarMenu,
  title: 'Layout/UserAvatarMenu',
  decorators: [withAuthStore],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof UserAvatarMenu>;

export const Default: Story = {};

export const InteractionOpenMenu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the avatar button to open the menu
    const avatarBtn = canvas.getByRole('button');
    await userEvent.click(avatarBtn);

    // Menu items should be visible
    await expect(canvas.getByText(/settings/i)).toBeInTheDocument();
  },
};
