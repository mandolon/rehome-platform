# Next.js Frontend

A modern React frontend built with Next.js 14 for the Rehome Platform.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **React Query** for data fetching and caching
- **Role-based Authentication** with JWT tokens
- **Real-time Updates** via WebSocket
- **File Upload** with drag & drop
- **Responsive Design** for all devices
- **Dark/Light Theme** support

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (Laravel)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Update environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:6001
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
app/
├── auth/                 # Authentication pages
│   ├── login/
│   └── register/
├── dashboard/            # Dashboard page
├── projects/             # Project management
├── tasks/                # Task management
├── components/           # Reusable components
│   ├── ui/              # UI components
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript types
└── globals.css          # Global styles
```

## Key Components

### Authentication
- JWT token-based authentication
- Role-based access control
- Protected routes
- User session management

### Dashboard
- Project statistics overview
- Recent activity feed
- Quick action buttons
- Role-based data filtering

### Project Management
- Create, update, delete projects
- Team member assignment
- File upload and management
- Progress tracking

### Task Management  
- Task creation and assignment
- Progress tracking with percentages
- Due date management
- Comments and collaboration

### Real-time Features
- Live task updates
- Team collaboration
- Notification system
- Activity feeds

## User Roles

1. **Admin**: Full system access
2. **Project Manager**: Manage projects and teams
3. **Architect**: Design-focused project access
4. **Contractor**: Task execution and progress updates
5. **Client**: View-only access with feedback capabilities

## API Integration

The frontend integrates with the Laravel backend API:

- **Authentication**: `/api/auth/*`
- **Projects**: `/api/projects/*`
- **Tasks**: `/api/tasks/*`
- **Files**: `/api/files/*`
- **Users**: `/api/users/*`

## Styling

- **Tailwind CSS** utility-first framework
- **Custom components** with consistent design system
- **Responsive design** for mobile/tablet/desktop
- **Dark mode** support (coming soon)

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The app can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Docker containers

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `ws://localhost:6001` |

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Add proper error handling
4. Include loading states
5. Test responsive design