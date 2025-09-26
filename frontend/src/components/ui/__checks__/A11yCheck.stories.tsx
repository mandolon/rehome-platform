import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Checks/A11y',
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'label',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// This story should fail a11y checks - missing label
export const Violating: Story = {
  render: () => (
    <div>
      <h2>A11y Violation Example</h2>
      <button>Button without accessible name</button>
      <input type="text" placeholder="Input without label" />
    </div>
  ),
};

// This story should pass a11y checks - proper labels
export const Fixed: Story = {
  render: () => (
    <div>
      <h2>A11y Fixed Example</h2>
      <button aria-label="Submit form">Submit</button>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};
