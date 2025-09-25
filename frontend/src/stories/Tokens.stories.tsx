import type { Meta, StoryObj } from '@storybook/react';

const Tokens = () => (
  <div className="p-6 grid gap-6">
    <section>
      <h2 className="text-lg font-medium mb-4">Colors</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['--background','--foreground','--card','--muted','--primary','--secondary'].map(k => (
          <div key={k} className="rounded-xl border p-4">
            <div className="h-10 w-full rounded" style={{ background: `hsl(var(${k}))` }} />
            <div className="mt-2 text-sm">{k}</div>
          </div>
        ))}
      </div>
    </section>
    <section>
      <h2 className="text-lg font-medium mb-4">Radii</h2>
      <div className="flex gap-4">
        {['0.375rem','0.75rem','1rem'].map((r,i)=>(
          <div key={i} className="border p-6" style={{ borderRadius: r }}>radius {r}</div>
        ))}
      </div>
    </section>
    <section>
      <h2 className="text-lg font-medium mb-4">Typography</h2>
      <div className="space-y-2">
        <div className="text-xs">text-xs - Small text</div>
        <div className="text-sm">text-sm - Small text</div>
        <div className="text-base">text-base - Base text</div>
        <div className="text-lg">text-lg - Large text</div>
        <div className="text-xl">text-xl - Extra large text</div>
        <div className="text-2xl">text-2xl - 2X large text</div>
      </div>
    </section>
    <section>
      <h2 className="text-lg font-medium mb-4">Spacing</h2>
      <div className="space-y-2">
        {['1', '2', '4', '6', '8', '12'].map(size => (
          <div key={size} className="flex items-center gap-2">
            <div className={`w-${size} h-${size} bg-primary rounded`} />
            <span className="text-sm">spacing-{size}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default { 
  title: 'Design/Tokens', 
  component: Tokens 
} as Meta<typeof Tokens>;

export const Default: StoryObj<typeof Tokens> = {};
