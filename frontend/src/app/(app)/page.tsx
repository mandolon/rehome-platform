import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, FolderOpen, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your requests and projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 completed, 2 pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, title: 'Kitchen Renovation', status: 'pending', client: 'John Smith' },
                { id: 2, title: 'Bathroom Update', status: 'in-progress', client: 'Sarah Johnson' },
                { id: 3, title: 'Living Room Design', status: 'completed', client: 'Mike Davis' },
              ].map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-muted-foreground">{request.client}</p>
                  </div>
                  <Badge variant={
                    request.status === 'completed' ? 'default' :
                    request.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <FileText className="h-4 w-4" />
                <span>Create New Request</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <FolderOpen className="h-4 w-4" />
                <span>Start New Project</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <Clock className="h-4 w-4" />
                <span>View Schedule</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
