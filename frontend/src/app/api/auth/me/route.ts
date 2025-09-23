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

export async function GET(request: NextRequest) {
  console.log('API Route: GET /api/auth/me called')
  
  const sessionCookie = request.cookies.get('laravel_session')
  console.log('API Route: Session cookie:', sessionCookie?.value)
  
  if (sessionCookie?.value === 'mock-session-token') {
    console.log('API Route: Valid session found, returning user data')
    return NextResponse.json({ 
      data: fakeUser,
      message: 'User retrieved successfully'
    }, { status: 200 })
  }
  
  console.log('API Route: No valid session found, returning 401')
  return NextResponse.json({ 
    message: 'Unauthenticated' 
  }, { status: 401 })
}