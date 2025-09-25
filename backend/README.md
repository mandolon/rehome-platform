# Rehome Platform Backend API

A Laravel 11 API-only backend for the Rehome Platform project management system.

## Features

- **Multi-role authentication** (admin, project_manager, team_member, client)
- **RESTful API** with Laravel Sanctum cookie authentication
- **PostgreSQL database** with proper relationships
- **Role-based access control** with policies
- **File upload/download** with storage abstraction
- **CORS support** for frontend integration
- **Comprehensive seeding** with sample data

## Database Schema

- **Users**: Multi-role system with profile data (JSON)
- **Projects**: Owned by users, with status tracking
- **Tasks**: Assigned to users, with priority and status
- **Attachments**: Polymorphic relations to projects and tasks

## Installation

### Prerequisites

- PHP 8.2+
- Composer
- PostgreSQL
- Node.js (for frontend integration)

### Setup

1. **Install dependencies**:
   ```bash
   composer install
   ```

2. **Environment configuration**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database setup**:
   ```bash
   php artisan migrate --seed
   ```

4. **Storage setup**:
   ```bash
   php artisan storage:link
   ```

### Development Server

```bash
php artisan serve --host=0.0.0.0 --port=9000
```

The API will be available at `http://localhost:9000`

## API Endpoints

### Health Check
- `GET /api/health` - Returns `{"ok": true}`

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (sets cookie)
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects (with pagination, search, filters)
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Query Parameters
- `?q=search` - Search projects by name/description
- `?status=active` - Filter by status
- `?page=1&per_page=20` - Pagination

## Local Development

### Test Accounts
Local test accounts are created only in `APP_ENV=local` by `DatabaseSeeder`. These accounts use the password specified in `TEST_ACCOUNT_PASSWORD` environment variable.

**⚠️ Security Notice:**
- Test accounts are only created in local environment
- Never commit plaintext passwords to the repository
- Change default passwords before deploying to any environment
- Use environment-specific passwords via `TEST_ACCOUNT_PASSWORD`

### Test Account Credentials (Local Only)
- **Admin**: admin@rehome.com
- **Project Manager**: pm@rehome.com  
- **Team Member 1**: team1@rehome.com
- **Team Member 2**: team2@rehome.com
- **Client**: client@rehome.com

### Database Cleanup Scripts
- `php cleanup-duplicates.php` - Remove duplicate user accounts
- `php rotate-passwords.php` - Rotate test account passwords

## Docker Setup

### Using Docker Compose

Create a `docker-compose.yml` in the project root:

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: rehome
      POSTGRES_USER: rehome
      POSTGRES_PASSWORD: rehome
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: ./backend
    ports:
      - "9000:9000"
    depends_on:
      - db
    environment:
      - DB_HOST=db
    volumes:
      - ./backend:/app
    command: php artisan serve --host=0.0.0.0 --port=9000

volumes:
  postgres_data:
```

### Dockerfile for Backend

```dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install
RUN php artisan key:generate
RUN php artisan storage:link

EXPOSE 9000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=9000"]
```

### Running with Docker

```bash
docker-compose up -d
docker-compose exec api php artisan migrate --seed
```

## Testing

Run the test suite:

```bash
composer test
# or
php artisan test
```

## Scripts

Available composer scripts:

```bash
composer seed    # Fresh migration with seed data
composer test    # Run tests
```

## CORS Configuration

The API is configured to accept requests from `http://localhost:3000` with credentials support for cookie-based authentication.

## Role-Based Access

- **Admin**: Full access to all resources
- **Project Manager**: Can create/manage projects and tasks
- **Team Member**: Can view assigned projects and update own tasks
- **Client**: Read-only access to assigned projects

## File Storage

Files are stored in `storage/app/public` and accessible via `/storage/` URL prefix. The storage is S3-ready for production deployment.