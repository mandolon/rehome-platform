import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  console.log('API Route: POST /api/auth/login called')
  
  try {
    const body = await request.json() as { email: string; password: string }
    console.log('API Route: Login attempt with email:', body.email)
    
    // Demo credentials - any password works
    let user: typeof fakeUser | typeof fakeManager | typeof fakeEmployee = fakeEmployee
    if (body.email === 'admin@rehome.build') {
      user = fakeUser
    } else if (body.email === 'manager@rehome.build') {
      user = fakeManager
    } else if (body.email === 'employee@rehome.build') {
      user = fakeEmployee
    }
    
    if (body.email && body.password) {
      console.log('API Route: Login successful for:', body.email)
      
      const response = NextResponse.json({ 
        data: user,
        message: 'Login successful'
      }, { status: 200 })
      
      // Set session cookie
      response.cookies.set('laravel_session', 'mock-session-token', {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        path: '/',
      })
      
      return response
    }
    
    console.log('API Route: Login failed - missing credentials')
    return NextResponse.json({ 
      message: 'Invalid credentials',
      errors: {
        email: ['The provided credentials are incorrect.']
      }
    }, { status: 422 })
    
  } catch (error) {
    console.error('API Route: Login handler error:', error)
    return NextResponse.json({ 
      message: 'Invalid request' 
    }, { status: 400 })
  }
}