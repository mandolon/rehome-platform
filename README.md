# Rehome Platform

Collaborative project management platform for architecture and construction teams. Laravel 11 backend with Next.js 14 React frontend, featuring multi-role dashboards and real-time collaboration tools.

## Architecture

- **Backend**: Laravel 11 API with PostgreSQL database
- **Frontend**: Next.js 14 React application with TypeScript
- **Authentication**: Laravel Sanctum with JWT tokens
- **Real-time**: WebSocket integration with Pusher
- **File Storage**: Local/cloud storage for project files
- **Database**: PostgreSQL with comprehensive schema

## Features

### 🔐 Multi-Role Authentication System
- **Admin**: Full system access and user management
- **Project Manager**: Create and manage projects, assign team members
- **Architect**: Design-focused project access and task management
- **Contractor**: Execute tasks, update progress, upload files
- **Client**: View projects, provide feedback, track progress

### 📋 Project Management
- Create and manage construction/architecture projects
- Assign team members with role-specific permissions
- Track project progress with visual indicators
- Set budgets, timelines, and project types
- Client information and location management

### ✅ Advanced Task Management
- Create tasks with priorities and due dates
- Assign tasks to team members
- Track completion percentages
- Hierarchical task structure (parent/subtasks)
- Time tracking (estimated vs actual hours)
- Task comments and collaboration

### 📁 File Management System
- Upload files to projects and tasks
- Categorize files (blueprints, designs, permits, photos, documents)
- Version control and file history
- Secure file access based on permissions
- Multiple file format support

### 🔄 Real-time Collaboration
- Live updates across all connected clients
- Real-time task status changes
- Notification system for important events
- Activity feeds and audit trails

### 📊 Role-Based Dashboards
- Customized views based on user roles
- Project statistics and progress tracking
- Task assignments and deadlines
- Recent activity and quick actions

## Getting Started

### Prerequisites

- PHP 8.2+ with required extensions
- Composer
- PostgreSQL database
- Node.js 18+ and npm/yarn
- Redis (optional, for caching)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database and app settings
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Run database migrations:
```bash
php artisan migrate
```

6. Start the development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API endpoints
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
rehome-platform/
├── backend/              # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Providers/
│   ├── database/migrations/
│   ├── routes/
│   └── config/
├── frontend/             # Next.js 14 React App
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── public/
└── README.md
```

## API Documentation

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

#### Projects
- `GET /api/projects` - List projects (filtered by role)
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

#### Tasks
- `GET /api/projects/{id}/tasks` - List project tasks
- `POST /api/projects/{id}/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `GET /api/my-tasks` - Get current user's tasks

#### Files
- `POST /api/projects/{id}/files` - Upload project file
- `GET /api/projects/{id}/files` - List project files
- `POST /api/tasks/{id}/files` - Upload task file

## Database Schema

### Core Tables
- **users**: User accounts with role-based permissions
- **projects**: Construction/architecture projects
- **project_user**: Many-to-many project team assignments
- **tasks**: Project tasks with assignment tracking
- **task_comments**: Collaborative task discussions
- **project_files**: File attachments for projects
- **task_files**: File attachments for tasks

## Security Features

- JWT token authentication with Laravel Sanctum
- Role-based authorization policies
- CORS configuration for frontend integration
- File upload validation and security
- SQL injection protection
- XSS protection

## Technology Stack

### Backend
- Laravel 11.x
- PHP 8.2+
- PostgreSQL
- Laravel Sanctum
- Pusher (WebSockets)

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- Heroicons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
