import { http, HttpResponse } from 'msw'

const fakeUser = {
  id: 1,
  name: 'Demo Admin',
  email: 'admin@rehome.build',
  role: 'admin' as const,
  email_verified_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const fakeManager = {
  id: 2,
  name: 'Demo Manager',
  email: 'manager@rehome.build',
  role: 'manager' as const,
  email_verified_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const fakeEmployee = {
  id: 3,
  name: 'Demo Employee',
  email: 'employee@rehome.build',
  role: 'employee' as const,
  email_verified_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const handlers = [
  // CSRF token (for Laravel Sanctum compatibility)
  http.get('/sanctum/csrf-cookie', () => {
    return new HttpResponse(null, { 
      status: 204,
      headers: {
        'Set-Cookie': 'XSRF-TOKEN=mock-csrf-token; Path=/; SameSite=lax',
      },
    })
  }),

  // Login
  http.post('/api/login', async ({ request }) => {
    try {
      const body = await request.json() as { email: string; password: string }
      
      // Demo credentials
      let user = fakeEmployee
      if (body.email === 'admin@rehome.build') {
        user = fakeUser
      } else if (body.email === 'manager@rehome.build') {
        user = fakeManager
      } else if (body.email === 'employee@rehome.build') {
        user = fakeEmployee
      }
      
      if (body.email && body.password) {
        return HttpResponse.json({ 
          token: 'demo-token-123', 
          user 
        }, { 
          status: 200,
          headers: {
            'Set-Cookie': 'laravel_session=mock-session-token; Path=/; HttpOnly; SameSite=lax',
          },
        })
      }
      
      return HttpResponse.json({ 
        message: 'Invalid credentials',
        errors: {
          email: ['The provided credentials are incorrect.']
        }
      }, { status: 422 })
    } catch (error) {
      return HttpResponse.json({ 
        message: 'Invalid request' 
      }, { status: 400 })
    }
  }),

  // Register
  http.post('/api/register', async ({ request }) => {
    try {
      const body = await request.json() as {
        name: string
        email: string
        password: string
        password_confirmation: string
      }
      
      // Basic validation
      if (!body.name || !body.email || !body.password) {
        return HttpResponse.json({
          message: 'Validation failed',
          errors: {
            name: !body.name ? ['The name field is required.'] : undefined,
            email: !body.email ? ['The email field is required.'] : undefined,
            password: !body.password ? ['The password field is required.'] : undefined,
          }
        }, { status: 422 })
      }

      if (body.password !== body.password_confirmation) {
        return HttpResponse.json({
          message: 'Validation failed',
          errors: {
            password: ['The password confirmation does not match.']
          }
        }, { status: 422 })
      }
      
      const newUser = {
        id: 4,
        name: body.name,
        email: body.email,
        role: 'employee' as const,
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      return HttpResponse.json({ 
        token: 'demo-token-456', 
        user: newUser 
      }, { 
        status: 201,
        headers: {
          'Set-Cookie': 'laravel_session=mock-session-token-new; Path=/; HttpOnly; SameSite=lax',
        },
      })
    } catch (error) {
      return HttpResponse.json({ 
        message: 'Invalid request' 
      }, { status: 400 })
    }
  }),

  // Get current user
  http.get('/api/user', ({ request }) => {
    const cookie = request.headers.get('cookie')
    if (cookie?.includes('laravel_session=mock-session')) {
      return HttpResponse.json(fakeUser, { status: 200 })
    }
    return HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 })
  }),

  // Alternative endpoint for current user
  http.get('/api/me', ({ request }) => {
    const cookie = request.headers.get('cookie')
    if (cookie?.includes('laravel_session=mock-session')) {
      return HttpResponse.json({ user: fakeUser }, { status: 200 })
    }
    return HttpResponse.json({ message: 'Unauthenticated' }, { status: 401 })
  }),

  // Logout
  http.post('/api/logout', () => {
    return new HttpResponse(null, { 
      status: 204,
      headers: {
        'Set-Cookie': 'laravel_session=; Path=/; HttpOnly; SameSite=lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      },
    })
  }),

  // Projects endpoints (for testing the dashboard)
  http.get('/api/projects', () => {
    const mockProjects = [
      {
        id: 1,
        name: 'Website Redesign',
        description: 'Complete overhaul of company website',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Mobile App Development',
        description: 'Native iOS and Android applications',
        status: 'planning',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    return HttpResponse.json({ data: mockProjects }, { status: 200 })
  }),

  // Tasks endpoints
  http.get('/api/tasks', () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Design Homepage',
        description: 'Create mockups for the new homepage',
        status: 'in_progress',
        project_id: 1,
        assigned_to: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Setup Development Environment',
        description: 'Configure development tools and dependencies',
        status: 'completed',
        project_id: 2,
        assigned_to: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    return HttpResponse.json({ data: mockTasks }, { status: 200 })
  }),
]