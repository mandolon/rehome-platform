import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Example: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
      <CardFooter>
        <p>Card footer</p>
      </CardFooter>
    </Card>
  )
};

export const Simple: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="p-6">
        <p>Simple card with just content.</p>
      </CardContent>
    </Card>
  )
};
