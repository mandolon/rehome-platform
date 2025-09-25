import type { Meta, StoryObj } from '@storybook/react';

// Mock StatusBadge component
const StatusBadge = ({ status, children }: { status: string; children?: React.ReactNode }) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {children || status}
    </span>
  );
};

// Mock RequestCard component
const RequestCard = ({ 
  title, 
  description, 
  status, 
  priority = 'medium',
  createdAt 
}: {
  title: string;
  description: string;
  status: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 border-l-4 ${getPriorityColor(priority)}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-card-foreground">{title}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Priority: {priority}</span>
        <span>{createdAt}</span>
      </div>
    </div>
  );
};

// Requests showcase component
const Requests = () => (
  <div className="p-6 space-y-6">
    <section>
      <h2 className="text-2xl font-bold mb-4">Status Badges</h2>
      <div className="flex flex-wrap gap-4">
        <StatusBadge status="pending">Pending</StatusBadge>
        <StatusBadge status="approved">Approved</StatusBadge>
        <StatusBadge status="rejected">Rejected</StatusBadge>
        <StatusBadge status="in-progress">In Progress</StatusBadge>
        <StatusBadge status="completed">Completed</StatusBadge>
        <StatusBadge status="active">Active</StatusBadge>
        <StatusBadge status="inactive">Inactive</StatusBadge>
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">Request Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RequestCard
          title="New Feature Request"
          description="Add dark mode support to the application"
          status="pending"
          priority="high"
          createdAt="2 hours ago"
        />
        <RequestCard
          title="Bug Fix Request"
          description="Fix login form validation issue"
          status="in-progress"
          priority="medium"
          createdAt="1 day ago"
        />
        <RequestCard
          title="UI Improvement"
          description="Update button styles for better accessibility"
          status="approved"
          priority="low"
          createdAt="3 days ago"
        />
        <RequestCard
          title="Database Migration"
          description="Migrate user data to new schema"
          status="completed"
          priority="high"
          createdAt="1 week ago"
        />
        <RequestCard
          title="API Integration"
          description="Integrate with third-party payment service"
          status="rejected"
          priority="medium"
          createdAt="2 weeks ago"
        />
        <RequestCard
          title="Performance Optimization"
          description="Optimize image loading and caching"
          status="active"
          priority="medium"
          createdAt="1 month ago"
        />
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">Request List View</h2>
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-2 border-b">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
            <div>Title</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Created</div>
          </div>
        </div>
        <div className="divide-y">
          {[
            { title: "Feature Request", status: "pending", priority: "high", createdAt: "2h ago" },
            { title: "Bug Report", status: "in-progress", priority: "medium", createdAt: "1d ago" },
            { title: "UI Update", status: "approved", priority: "low", createdAt: "3d ago" },
            { title: "Database Fix", status: "completed", priority: "high", createdAt: "1w ago" },
          ].map((request, index) => (
            <div key={index} className="px-4 py-3 grid grid-cols-4 gap-4 items-center">
              <div className="font-medium">{request.title}</div>
              <div><StatusBadge status={request.status} /></div>
              <div className="text-sm text-muted-foreground">{request.priority}</div>
              <div className="text-sm text-muted-foreground">{request.createdAt}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default { 
  title: 'Requests/Components', 
  component: Requests 
} as Meta<typeof Requests>;

export const Default: StoryObj<typeof Requests> = {};

export const StatusBadges: StoryObj<typeof StatusBadge> = {
  render: () => (
    <div className="p-6">
      <div className="flex flex-wrap gap-4">
        <StatusBadge status="pending">Pending</StatusBadge>
        <StatusBadge status="approved">Approved</StatusBadge>
        <StatusBadge status="rejected">Rejected</StatusBadge>
        <StatusBadge status="in-progress">In Progress</StatusBadge>
        <StatusBadge status="completed">Completed</StatusBadge>
        <StatusBadge status="active">Active</StatusBadge>
        <StatusBadge status="inactive">Inactive</StatusBadge>
      </div>
    </div>
  ),
};

export const RequestCards: StoryObj<typeof RequestCard> = {
  render: () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RequestCard
          title="New Feature Request"
          description="Add dark mode support to the application"
          status="pending"
          priority="high"
          createdAt="2 hours ago"
        />
        <RequestCard
          title="Bug Fix Request"
          description="Fix login form validation issue"
          status="in-progress"
          priority="medium"
          createdAt="1 day ago"
        />
      </div>
    </div>
  ),
};
