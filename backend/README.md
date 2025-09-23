# Laravel Backend

A professional project management API built with Laravel 11 for architecture and construction teams.

## Features

- **Multi-role Authentication**: Admin, Project Manager, Architect, Contractor, Client roles
- **Project Management**: Create, update, and manage construction projects
- **Task Management**: Assign tasks with priorities, due dates, and progress tracking
- **File Management**: Upload and manage project files with categorization
- **Real-time Updates**: WebSocket support for collaborative features
- **PostgreSQL Database**: Robust data storage with proper relationships

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{id}/users` - Add user to project
- `DELETE /api/projects/{id}/users/{user}` - Remove user from project

### Tasks
- `GET /api/projects/{id}/tasks` - List project tasks
- `POST /api/projects/{id}/tasks` - Create task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/{id}/comments` - Add comment to task
- `GET /api/my-tasks` - Get current user's tasks

### Files
- `POST /api/projects/{id}/files` - Upload project file
- `GET /api/projects/{id}/files` - List project files
- `GET /api/projects/{id}/files/{file}/download` - Download project file
- `DELETE /api/projects/{id}/files/{file}` - Delete project file
- `POST /api/tasks/{id}/files` - Upload task file
- `GET /api/tasks/{id}/files` - List task files

## Installation

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
composer install
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Configure your database settings in `.env`

5. Run migrations:
```bash
php artisan migrate
```

6. Start the development server:
```bash
php artisan serve
```

## Database Schema

### Core Tables
- **users**: User accounts with role-based access
- **projects**: Construction/architecture projects
- **project_user**: Many-to-many relationship for project team members
- **tasks**: Project tasks with assignment and progress tracking
- **task_comments**: Comments on tasks
- **project_files**: File attachments for projects
- **task_files**: File attachments for tasks

### User Roles
- **admin**: Full system access
- **project_manager**: Can create and manage projects
- **architect**: Can create projects and manage design tasks
- **contractor**: Can view projects and manage assigned tasks
- **client**: Can view projects and provide feedback

## Security Features

- Laravel Sanctum for API authentication
- Role-based authorization policies
- File upload security with size and type validation
- CSRF protection for web routes
- Secure password hashing