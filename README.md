# Rehome Platform

Multi-role collaborative platform for architecture and construction teams. Features project management, task tracking, team collaboration, and client portals with real-time updates.

## Tech Stack
- **Backend**: Laravel 11 + SQLite (dev) / PostgreSQL (prod)
- **Frontend**: Next.js 14 + React + TypeScript
- **Authentication**: Laravel Sanctum
- **Real-time**: Laravel Broadcasting
- **UI**: Tailwind CSS + shadcn/ui
- **Code Review**: CodeRabbit AI
- **CI/CD**: GitHub Actions

## 🤖 Automated Code Reviews

This repository uses **CodeRabbit AI** for automated code reviews on all pull requests. 

**Setup Required**: Install the [CodeRabbit GitHub App](https://github.com/marketplace/coderabbit-ai) to enable AI reviews.

See [`docs/CODERABBIT-SETUP.md`](docs/CODERABBIT-SETUP.md) for detailed setup instructions.

## Quick Start (Windows PowerShell)

### Prerequisites
- **PHP 8.2+** with extensions: `curl`, `mbstring`, `sqlite3`, `zip`, `xml`
- **Node.js 18+** 
- **Composer** (latest)
- **Git**

### 1. Clone and Setup Backend

```powershell
# Clone repository
git clone https://github.com/mandolon/rehome-platform.git
cd rehome-platform

# Backend setup
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed

# Start backend server (port 9000)
php artisan serve --port=9000
```

### 2. Setup Frontend (New PowerShell Window)

```powershell
# Navigate to frontend
cd rehome-platform/frontend

# Install dependencies
npm ci

# Create environment file
Copy-Item .env.example .env.local

# Start frontend (port 3000)
npm run dev
```

### 3. Verification

Open your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9000/api

## Quick Start (Linux/macOS)

```bash
# Clone and setup backend
git clone https://github.com/mandolon/rehome-platform.git
cd rehome-platform/backend
composer install
cp .env.example .env
php artisan key:generate && php artisan migrate && php artisan db:seed
php artisan serve --port=9000 &

# Setup frontend
cd ../frontend
npm ci
cp .env.example .env.local
npm run dev
```

## Project Structure

```
rehome-platform/
├── backend/          # Laravel 11 API
├── frontend/         # Next.js 14 React app
├── docs/            # Documentation
├── .github/         # GitHub Actions workflows
└── README.md        # This file
```

## Development

### Running Tests

```powershell
# Backend tests
cd backend
php artisan test

# Frontend tests
cd frontend
npm run test
npm run typecheck
npm run lint
```

### Pre-flight Checks (Windows)

```powershell
# Run all checks before creating PR
.\pre-flight.bat
```

## Authentication Flow

The app uses Laravel Sanctum for SPA authentication:

1. **CSRF Cookie**: `GET /sanctum/csrf-cookie`
2. **Login**: `POST /api/auth/login` 
3. **Authenticated Requests**: Include cookies automatically
4. **User Info**: `GET /api/auth/me`
5. **Logout**: `POST /api/auth/logout`

## Roles & Permissions

- **Admin**: Full system access
- **Project Manager**: Create/manage projects and teams  
- **Team Member**: View assigned projects and tasks
- **Client**: View project progress and status

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run pre-flight checks: `.\pre-flight.bat` (Windows) or follow CI steps
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Create a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Production Deployment

See [PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md) for production deployment instructions.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/mandolon/rehome-platform/issues)
- 💬 [Discussions](https://github.com/mandolon/rehome-platform/discussions)

## License

This project is licensed under the MIT License.
