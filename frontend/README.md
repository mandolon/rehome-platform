# Rehome Platform Frontend

This is a [Next.js](https://nextjs.org/) 14 project with TypeScript and Tailwind CSS for the Rehome Platform - a collaborative project management platform for architecture and construction teams.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Authentication Context** for user management
- **API Client** configured for Laravel backend communication
- **React Query** for data fetching and caching
- **Responsive Design** with modern UI components

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables file:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:
```bash
npm run build
```

### Lint

Check code quality with ESLint:
```bash
npm run lint
```

### Start Production Server

After building, start the production server:
```bash
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── login/              # Login page
│   │   ├── projects/           # Projects page
│   │   ├── register/           # Registration page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable components
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication context
│   │   └── QueryProvider.tsx   # React Query provider
│   ├── hooks/                  # Custom hooks
│   └── lib/                    # Utilities
│       └── api.ts              # API client configuration
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## API Integration

The frontend is configured to communicate with a Laravel backend API. The API client (`src/lib/api.ts`) includes:

- Automatic authentication token handling
- Request/response interceptors
- Error handling
- TypeScript support

## Authentication

The application includes a comprehensive authentication system:

- **Login/Register pages** with form validation
- **Authentication context** for state management
- **Protected routes** that redirect to login when not authenticated
- **Token-based authentication** with cookies
- **Automatic logout** on token expiration

## Routing Structure

- `/` - Home page with platform overview
- `/login` - User authentication
- `/register` - User registration
- `/dashboard` - Main dashboard (protected)
- `/projects` - Projects management (protected)

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Laravel backend API URL (default: http://localhost:8000/api)
- `NEXT_PUBLIC_APP_ENV` - Application environment (development/production)

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **ESLint** - Code linting

## Contributing

1. Follow the existing code style and conventions
2. Run `npm run lint` before committing
3. Ensure all builds pass with `npm run build`
4. Test changes in development mode with `npm run dev`
