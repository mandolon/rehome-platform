# Rehome Platform Backend

Laravel 11 API backend for the Rehome Platform - a collaborative project management platform for architecture and construction teams.

## Features

- **Laravel 11** framework
- **PostgreSQL** database configuration
- **Laravel Sanctum** authentication
- **User Roles System**: admin, project_manager, team_member, client
- **Role-based API access control**
- **RESTful API structure**

## Installation

1. Install dependencies:
```bash
composer install
```

2. Set up environment:
```bash
cp .env.example .env
```

3. Configure your database in `.env`:
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=rehome_platform
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Run migrations:
```bash
php artisan migrate
```

6. Seed the database (optional):
```bash
php artisan db:seed
```

## User Roles

- **Admin**: Full system access
- **Project Manager**: Project management and team oversight
- **Team Member**: Team collaboration and project access
- **Client**: Limited access to assigned projects

## Default Test Users

When seeded, the following test users are created:

- **Admin**: admin@rehome.com / password123
- **Project Manager**: pm@rehome.com / password123
- **Team Member**: team@rehome.com / password123
- **Client**: client@rehome.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (authenticated)
- `GET /api/auth/user` - Get current user (authenticated)

### Role-based Access
- `GET /api/admin/dashboard` - Admin only
- `GET /api/projects/manage` - Admin & Project Manager
- `GET /api/team/dashboard` - Admin, PM & Team Member
- `GET /api/client/dashboard` - Client only
- `GET /api/profile` - All authenticated users

### Health Check
- `GET /api/health` - API health status

## Development

Start the development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## Laravel Sanctum

This API uses Laravel Sanctum for authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer your-token-here
```