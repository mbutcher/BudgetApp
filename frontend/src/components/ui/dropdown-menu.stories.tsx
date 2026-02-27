import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from '@storybook/test';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './dropdown-menu';
import { Button } from './button';

const meta: Meta = {
  title: 'UI/DropdownMenu',
};
export default meta;

type Story = StoryObj;

function DropdownDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-8">
      {selected && (
        <p className="mb-4 text-sm text-muted-foreground">Selected: {selected}</p>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>
          <Button variant="outline">Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setSelected('Edit');
              setOpen(false);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelected('Duplicate');
              setOpen(false);
            }}
          >
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Archive (disabled)</DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              setSelected('Delete');
              setOpen(false);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const Closed: Story = {
  render: () => <DropdownDemo />,
};

export const InteractionOpenAndSelect: Story = {
  render: () => <DropdownDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the menu
    const trigger = canvas.getByRole('button', { name: /open menu/i });
    await userEvent.click(trigger);

    // Menu items should be visible
    await expect(canvas.getByText('Edit')).toBeInTheDocument();

    // Click "Duplicate"
    const duplicateItem = canvas.getByText('Duplicate');
    await userEvent.click(duplicateItem);

    // Selection feedback appears
    await expect(canvas.getByText('Selected: Duplicate')).toBeInTheDocument();
  },
};
