# ReHome Platform

Collaborative project management platform for architecture and construction teams. Laravel 11 backend API with Next.js 14 frontend, featuring multi-role dashboards and real-time collaboration tools.

## 🏗️ Architecture

- **Backend**: Laravel 11 API with PostgreSQL database
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Authentication**: Laravel Sanctum for API authentication
- **User Roles**: Admin, Project Manager, Team Member, Client

## 📁 Project Structure

```
rehome-platform/
├── backend/          # Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/Api/  # API controllers
│   │   └── Models/               # Eloquent models
│   ├── database/migrations/      # Database migrations
│   ├── routes/api.php           # API routes
│   └── ...
└── frontend/         # Next.js 14 frontend
    ├── src/
    │   ├── app/      # App Router pages
    │   └── ...
    └── ...
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- NPM or Yarn
- PostgreSQL (for production)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Configure database in `.env`:
   ```env
   # For development (SQLite)
   DB_CONNECTION=sqlite

   # For production (PostgreSQL)
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=rehome_platform
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

6. Run database migrations:
   ```bash
   php artisan migrate
   ```

7. Start the development server:
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🔑 API Authentication

The API uses Laravel Sanctum for authentication. Key endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User login  
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user
- `GET /api/health` - Health check

### User Roles

The platform supports four user roles:

- **Admin**: Full system access and user management
- **Project Manager**: Project oversight and team management
- **Team Member**: Task execution and collaboration
- **Client**: Project viewing and communication

### Example API Usage

```bash
# Register a new user
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "project_manager"
  }'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🛠️ Development

### Backend Commands

```bash
# Run tests
php artisan test

# Code formatting
./vendor/bin/pint

# Create new API controller
php artisan make:controller Api/YourController

# Create migration
php artisan make:migration create_your_table

# Run specific migration
php artisan migrate --path=/database/migrations/your_migration.php
```

### Frontend Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📦 Deployment

### Backend Deployment

1. Set up PostgreSQL database
2. Configure `.env` for production
3. Run migrations: `php artisan migrate`
4. Configure web server (Apache/Nginx)

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to hosting provider (Vercel, Netlify, etc.)
3. Configure API base URL for production

## 🔧 Configuration

### Environment Variables

Backend (`.env`):
```env
APP_NAME="ReHome Platform"
APP_ENV=production
APP_URL=https://your-domain.com

DB_CONNECTION=pgsql
DB_DATABASE=rehome_platform
# ... other database settings

# API settings
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
```

Frontend:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

---

**Status**: ✅ Initial setup complete with Laravel 11 API backend and Next.js 14 frontend
