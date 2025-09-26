import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Archive, Calendar, User, MapPin } from 'lucide-react';

interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const request = {
    id: params.id,
    title: 'Kitchen Renovation',
    client: 'John Smith',
    status: 'in-progress',
    priority: 'high',
    description: 'Complete kitchen renovation including new cabinets, countertops, and appliances.',
    budget: '$25,000',
    timeline: '8-12 weeks',
    location: '123 Main St, Anytown, ST 12345',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  };

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
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
          <p className="text-muted-foreground">
            Request #{request.id} • {request.client}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {getStatusBadge(request.status)}
        {getPriorityBadge(request.priority)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{request.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Timeline:</span>
                      <span className="text-sm text-muted-foreground">{request.timeline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Budget:</span>
                      <span className="text-sm text-muted-foreground">{request.budget}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm text-muted-foreground">{request.location}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">Request created</p>
                        <p className="text-xs text-muted-foreground">{request.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">Status updated to In Progress</p>
                        <p className="text-xs text-muted-foreground">{request.updatedAt}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No files uploaded yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Client</p>
                <p className="text-sm text-muted-foreground">{request.client}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="mt-1">{getStatusBadge(request.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium">Priority</p>
                <div className="mt-1">{getPriorityBadge(request.priority)}</div>
              </div>
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="text-sm text-muted-foreground">{request.budget}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-sm text-muted-foreground">{request.timeline}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
