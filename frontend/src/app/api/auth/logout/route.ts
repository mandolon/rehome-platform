import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('API Route: POST /api/auth/logout called')
  
  const response = NextResponse.json({ 
    message: 'Logged out successfully'
  }, { status: 200 })
  
  // Clear session cookie
  response.cookies.set('laravel_session', '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Expire immediately
  })
  
  console.log('API Route: Session cookie cleared')
  return response
}