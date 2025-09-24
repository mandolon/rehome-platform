import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('API Route: POST /api/auth/logout called - This should not be used, use /logout instead')
  
  // Redirect to the real Laravel logout endpoint
  return NextResponse.redirect(new URL('/logout', 'http://localhost:9000'), 307)
}