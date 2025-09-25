import { http, HttpResponse } from 'msw';

export const handlers = [
  // Get all requests
  http.get('/api/requests', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Kitchen Renovation',
        client: 'John Smith',
        status: 'pending',
        priority: 'high',
        budget: '$25,000',
        timeline: '8-12 weeks',
        location: '123 Main St, Anytown, ST 12345',
        description: 'Complete kitchen renovation including new cabinets, countertops, and appliances.',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-15',
      },
      {
        id: 2,
        title: 'Bathroom Update',
        client: 'Sarah Johnson',
        status: 'in-progress',
        priority: 'medium',
        budget: '$15,000',
        timeline: '6-8 weeks',
        location: '456 Oak Ave, Somewhere, ST 54321',
        description: 'Modern bathroom update with new fixtures and tile work.',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-14',
      },
      {
        id: 3,
        title: 'Living Room Design',
        client: 'Mike Davis',
        status: 'completed',
        priority: 'low',
        budget: '$8,000',
        timeline: '4-6 weeks',
        location: '789 Pine Rd, Elsewhere, ST 98765',
        description: 'Living room redesign with new furniture and decor.',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-13',
      },
      {
        id: 4,
        title: 'Bedroom Makeover',
        client: 'Emily Wilson',
        status: 'pending',
        priority: 'high',
        budget: '$12,000',
        timeline: '6-10 weeks',
        location: '321 Elm St, Nowhere, ST 11111',
        description: 'Complete bedroom makeover with new furniture and paint.',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12',
      },
      {
        id: 5,
        title: 'Office Setup',
        client: 'David Brown',
        status: 'in-progress',
        priority: 'medium',
        budget: '$10,000',
        timeline: '4-6 weeks',
        location: '654 Maple Dr, Anywhere, ST 22222',
        description: 'Home office setup with custom desk and storage solutions.',
        createdAt: '2024-01-11',
        updatedAt: '2024-01-11',
      },
    ]);
  }),

  // Get single request
  http.get('/api/requests/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id: Number(id),
      title: 'Kitchen Renovation',
      client: 'John Smith',
      status: 'in-progress',
      priority: 'high',
      budget: '$25,000',
      timeline: '8-12 weeks',
      location: '123 Main St, Anytown, ST 12345',
      description: 'Complete kitchen renovation including new cabinets, countertops, and appliances.',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
    });
  }),

  // Get projects
  http.get('/api/projects', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'Kitchen Renovation Project',
        client: 'John Smith',
        status: 'active',
        progress: 65,
        startDate: '2024-01-10',
        endDate: '2024-03-15',
      },
      {
        id: 2,
        name: 'Bathroom Update Project',
        client: 'Sarah Johnson',
        status: 'active',
        progress: 30,
        startDate: '2024-01-08',
        endDate: '2024-02-28',
      },
    ]);
  }),

  // Get user profile
  http.get('/api/me', () => {
    return HttpResponse.json({
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      company: 'ReHome Design',
      role: 'admin',
      bio: 'Experienced interior designer with 10+ years in residential projects.',
    });
  }),

  // Get team members
  http.get('/api/team', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'designer',
        status: 'active',
      },
      {
        id: 3,
        name: 'Mike Davis',
        email: 'mike@example.com',
        role: 'contractor',
        status: 'pending',
      },
    ]);
  }),
];