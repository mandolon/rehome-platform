# Rehome Platform

Collaborative project management platform for architecture and construction teams. Laravel backend with React frontend, featuring multi-role dashboards and real-time collaboration tools.

## API Controllers

This implementation includes Laravel API controllers for:

### Projects Management
- **ProjectController**: Full CRUD operations for projects
- **Endpoints**: 
  - `GET /api/v1/projects` - List all projects with filtering and pagination
  - `POST /api/v1/projects` - Create new project
  - `GET /api/v1/projects/{id}` - Get specific project
  - `PUT /api/v1/projects/{id}` - Update project
  - `DELETE /api/v1/projects/{id}` - Delete project

### Tasks Management  
- **TaskController**: Full CRUD operations for tasks
- **Endpoints**:
  - `GET /api/v1/tasks` - List tasks with filtering by project, user, status, priority
  - `POST /api/v1/tasks` - Create new task
  - `GET /api/v1/tasks/{id}` - Get specific task
  - `PUT /api/v1/tasks/{id}` - Update task
  - `DELETE /api/v1/tasks/{id}` - Delete task

### User Management
- **UserController**: User management operations
- **Endpoints**:
  - `GET /api/v1/users` - List users with role filtering and search
  - `POST /api/v1/users` - Create new user
  - `GET /api/v1/users/{id}` - Get specific user
  - `PUT /api/v1/users/{id}` - Update user
  - `DELETE /api/v1/users/{id}` - Delete user

## Features

### Form Request Validation
- **StoreProjectRequest** & **UpdateProjectRequest**: Project validation rules
- **StoreTaskRequest** & **UpdateTaskRequest**: Task validation rules  
- **StoreUserRequest** & **UpdateUserRequest**: User validation rules
- Custom validation messages and rules for data integrity

### API Resources
- **ProjectResource**: Consistent project response formatting
- **TaskResource**: Consistent task response formatting
- **UserResource**: Consistent user response formatting
- Support for loading relationships and conditional data

### Error Handling
- Proper HTTP status codes
- Consistent error response format
- Exception handling for model operations
- Validation error responses

### Database Structure
- **Projects**: Name, description, status, dates
- **Tasks**: Title, description, status, priority, due date, project assignment
- **Users**: Name, email, password, role (admin/manager/user)
- **Relationships**: Many-to-many projects/users, one-to-many projects/tasks

### Query Features
- Pagination support
- Relationship loading with `?with=` parameter
- Filtering and search capabilities
- Soft loading of related data

## Usage

The API endpoints support various query parameters:

- `?per_page=20` - Control pagination
- `?with=tasks,users` - Load relationships
- `?project_id=1` - Filter tasks by project
- `?status=active` - Filter by status
- `?search=john` - Search users by name/email

All endpoints return consistent JSON responses with proper HTTP status codes and error handling.
