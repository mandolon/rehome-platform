import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('API Route: GET /sanctum/csrf-cookie called')
  
  const response = new NextResponse(null, { status: 204 })
  
  // Set mock CSRF token cookie
  response.cookies.set('XSRF-TOKEN', 'mock-csrf-token', {
    httpOnly: false, // CSRF tokens need to be accessible to JavaScript
    secure: false,
    sameSite: 'lax',
    path: '/',
  })
  
  console.log('API Route: CSRF cookie set')
  return response
}