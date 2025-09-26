import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';

export default function RequestsPage() {
  const requests = [
    {
      id: 1,
      title: 'Kitchen Renovation',
      client: 'John Smith',
      status: 'pending',
      updatedAt: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Bathroom Update',
      client: 'Sarah Johnson',
      status: 'in-progress',
      updatedAt: '2024-01-14',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Living Room Design',
      client: 'Mike Davis',
      status: 'completed',
      updatedAt: '2024-01-13',
      priority: 'low'
    },
    {
      id: 4,
      title: 'Bedroom Makeover',
      client: 'Emily Wilson',
      status: 'pending',
      updatedAt: '2024-01-12',
      priority: 'high'
    },
    {
      id: 5,
      title: 'Office Setup',
      client: 'David Brown',
      status: 'in-progress',
      updatedAt: '2024-01-11',
      priority: 'medium'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
          <p className="text-muted-foreground">
            Manage and track all client requests
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Requests</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  className="w-80 pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{request.title}</h3>
                    {getStatusBadge(request.status)}
                    {getPriorityBadge(request.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Client: {request.client} • Updated: {request.updatedAt}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  #{request.id}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
