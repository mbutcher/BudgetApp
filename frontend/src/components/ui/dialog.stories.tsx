import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from '@storybook/test';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './dialog';
import { Button } from './button';
import { Input } from './input';

const meta: Meta = {
  title: 'UI/Dialog',
};
export default meta;

type Story = StoryObj;

function DialogDemo({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Make changes to your profile here.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Display name" data-testid="name-input" />
            <Input placeholder="Email address" type="email" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Closed: Story = {
  render: () => <DialogDemo />,
};

export const Open: Story = {
  render: () => <DialogDemo initialOpen />,
};

export const InteractionOpenFillClose: Story = {
  render: () => <DialogDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dialog
    const openBtn = canvas.getByRole('button', { name: /open dialog/i });
    await userEvent.click(openBtn);

    // Dialog content should be visible
    await expect(canvas.getByText('Edit Profile')).toBeInTheDocument();

    // Fill in the input
    const nameInput = canvas.getByPlaceholderText(/display name/i);
    await userEvent.type(nameInput, 'Jane Smith');

    // Close via Cancel
    const cancelBtn = canvas.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelBtn);

    // Dialog should be closed
    await expect(canvas.queryByText('Edit Profile')).not.toBeInTheDocument();
  },
};
