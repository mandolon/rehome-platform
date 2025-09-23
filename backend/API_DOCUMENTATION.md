# Rehome Platform API Documentation

## Overview

The Rehome Platform Backend API provides authentication and role-based access control for a collaborative project management platform designed for architecture and construction teams.

## Base URL
```
http://localhost:8000/api
```

## Authentication

This API uses Laravel Sanctum for authentication with Bearer tokens.

### Headers
```
Authorization: Bearer {your-access-token}
Content-Type: application/json
Accept: application/json
```

## User Roles

The system supports four user roles with different access levels:

- **Admin** (`admin`) - Full system access
- **Project Manager** (`project_manager`) - Project management and team oversight
- **Team Member** (`team_member`) - Team collaboration and project access  
- **Client** (`client`) - Limited access to assigned projects

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "team_member"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "team_member",
    "is_active": true
  },
  "token": "1|abc123..."
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "team_member",
    "is_active": true
  },
  "token": "2|def456..."
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### Get Current User
```http
GET /api/auth/user
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "team_member",
    "is_active": true,
    "permissions": {
      "is_admin": false,
      "can_manage_projects": false,
      "has_team_access": true
    }
  }
}
```

## Protected Endpoints

### Admin Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer {admin-token}
```
**Role Required:** `admin`

### Project Management
```http
GET /api/projects/manage
Authorization: Bearer {token}
```
**Roles Required:** `admin`, `project_manager`

### Team Dashboard
```http
GET /api/team/dashboard
Authorization: Bearer {token}
```
**Roles Required:** `admin`, `project_manager`, `team_member`

### Client Dashboard
```http
GET /api/client/dashboard
Authorization: Bearer {client-token}
```
**Role Required:** `client`

### User Profile
```http
GET /api/profile
Authorization: Bearer {token}
```
**Roles Required:** Any authenticated user

## Health Check

### API Health
```http
GET /api/health
```

**Response (200):**
```json
{
  "status": "ok",
  "message": "Rehome Platform API is running",
  "timestamp": "2024-01-01T12:00:00.000000Z"
}
```

## Error Responses

### Validation Error (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthorized"
}
```

### Forbidden (403)
```json
{
  "message": "Access denied. Required role(s): admin"
}
```

### Not Found (404)
```json
{
  "message": "Route not found."
}
```

## Test Users

When the database is seeded, these test accounts are available:

| Role | Email | Password | Access Level |
|------|--------|----------|--------------|
| Admin | admin@rehome.com | password123 | Full access |
| Project Manager | pm@rehome.com | password123 | Project management |
| Team Member | team@rehome.com | password123 | Team collaboration |
| Client | client@rehome.com | password123 | Limited access |

## Role Permissions Matrix

| Endpoint | Admin | Project Manager | Team Member | Client |
|----------|-------|----------------|-------------|--------|
| `/api/admin/dashboard` | ✓ | ✗ | ✗ | ✗ |
| `/api/projects/manage` | ✓ | ✓ | ✗ | ✗ |
| `/api/team/dashboard` | ✓ | ✓ | ✓ | ✗ |
| `/api/client/dashboard` | ✗ | ✗ | ✗ | ✓ |
| `/api/profile` | ✓ | ✓ | ✓ | ✓ |

## Development Setup

1. **Install Dependencies:**
   ```bash
   composer install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env
   # Configure database settings in .env
   ```

3. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

4. **Run Migrations:**
   ```bash
   php artisan migrate
   ```

5. **Seed Database:**
   ```bash
   php artisan db:seed
   ```

6. **Start Development Server:**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`