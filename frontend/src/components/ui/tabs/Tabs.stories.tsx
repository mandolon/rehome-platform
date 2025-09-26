import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Example: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-80">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <div className="p-4">Content for Tab 1</div>
      </TabsContent>
      <TabsContent value="tab2">
        <div className="p-4">Content for Tab 2</div>
      </TabsContent>
      <TabsContent value="tab3">
        <div className="p-4">Content for Tab 3</div>
      </TabsContent>
    </Tabs>
  )
};
