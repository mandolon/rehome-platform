# Rehome Platform Frontend

Modern Next.js 14 frontend for the Rehome Platform project management system.

## Features

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for styling with shadcn/ui components
- **Laravel Sanctum** authentication with cookie-based sessions
- **Role-based access control** (admin, project_manager, team_member, client)
- **Responsive design** with modern UI components
- **Testing** with Vitest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Running Laravel backend on `http://localhost:9000`

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:9000/api
```

3. Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Authentication Flow (Laravel Sanctum)

The app uses Laravel Sanctum for cookie-based authentication:

1. **CSRF Protection**: Before login/register, we call `GET /sanctum/csrf-cookie` to get CSRF token
2. **Login**: `POST /api/auth/login` with credentials, cookies are stored automatically
3. **Authenticated Requests**: All subsequent requests include `credentials: 'include'`
4. **User Data**: `GET /api/auth/me` to get current user info
5. **Logout**: `POST /api/auth/logout` to invalidate session

All API calls go through the centralized `apiClient` which handles:
- CSRF token management
- Credential inclusion
- Error handling
- Base URL configuration

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Protected route group
│   │   ├── dashboard/     # Dashboard page
│   │   └── projects/      # Projects pages
│   ├── login/             # Authentication pages
│   ├── register/
│   └── layout.tsx         # Root layout with AuthProvider
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and configuration
│   ├── api/               # API client and endpoints
│   ├── auth/              # Authentication context
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── test/                  # Test setup
```

## Available Scripts

- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm test` - Run tests with Vitest
- `pnpm format` - Format code with Prettier

## API Integration

The frontend communicates with a Laravel backend API:

### Authentication Endpoints
- `GET /sanctum/csrf-cookie` - Get CSRF token
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Core Endpoints
- `GET /api/projects` - List projects (with filters, pagination)
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects` - Create project
- `GET /api/projects/{id}/tasks` - List project tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task

## Role-Based Access

The app supports four user roles with different permissions:

- **Admin**: Full system access
- **Project Manager**: Create/manage projects and teams
- **Team Member**: View assigned projects and tasks
- **Client**: View project progress and status

Use the `<RoleGate>` component to conditionally render content:

```tsx
<RoleGate allow={['admin', 'project_manager']}>
  <AdminButton />
</RoleGate>
```

## Docker Support

The app is designed to work in Docker containers:

```dockerfile
# Development
EXPOSE 3000
CMD ["pnpm", "dev", "-p", "3000"]

# Production  
CMD ["pnpm", "start"]
```

Environment variables are read at runtime from `process.env.NEXT_PUBLIC_API_URL`.

## Testing

Run tests with:
```bash
pnpm test
```

Tests are written with Vitest and React Testing Library. Key test areas:
- API client error handling and credential management
- Protected route behavior and redirects
- Role-based component rendering
- Authentication flow

## Contributing

1. Follow the existing code style (Prettier + ESLint)
2. Write tests for new features
3. Use TypeScript strictly
4. Follow the established patterns for API calls and state management

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: `http://localhost:9000/api`)
