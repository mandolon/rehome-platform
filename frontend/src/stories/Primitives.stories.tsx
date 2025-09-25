import type { Meta, StoryObj } from '@storybook/react';

// Mock Button component
const Button = ({ variant = 'default', size = 'default', children, ...props }: any) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Mock Input component
const Input = ({ className = '', ...props }: any) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Mock Badge component
const Badge = ({ variant = 'default', children, ...props }: any) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </div>
  );
};

// Mock Card component
const Card = ({ children, className = '', ...props }: any) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }: any) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

// Primitives showcase component
const Primitives = () => (
  <div className="p-6 space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-4">Buttons</h2>
      <div className="flex flex-wrap gap-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">Inputs</h2>
      <div className="space-y-4 max-w-md">
        <Input placeholder="Enter text..." />
        <Input type="email" placeholder="Enter email..." />
        <Input type="password" placeholder="Enter password..." />
        <Input disabled placeholder="Disabled input" />
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">Badges</h2>
      <div className="flex flex-wrap gap-4">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content area.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Another Card</CardTitle>
            <CardDescription>Another description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>More content here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Third Card</CardTitle>
            <CardDescription>Third description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Final card content.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
);

export default { 
  title: 'Primitives/Components', 
  component: Primitives 
} as Meta<typeof Primitives>;

export const Default: StoryObj<typeof Primitives> = {};

export const Buttons: StoryObj<typeof Button> = {
  render: () => (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
};

export const Inputs: StoryObj<typeof Input> = {
  render: () => (
    <div className="p-6 space-y-4 max-w-md">
      <Input placeholder="Enter text..." />
      <Input type="email" placeholder="Enter email..." />
      <Input type="password" placeholder="Enter password..." />
      <Input disabled placeholder="Disabled input" />
    </div>
  ),
};

export const Badges: StoryObj<typeof Badge> = {
  render: () => (
    <div className="p-6">
      <div className="flex flex-wrap gap-4">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </div>
  ),
};
