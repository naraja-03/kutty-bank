import { NextResponse } from 'next/server';

// GET /api/auth - Get auth status
export async function GET() {
  return NextResponse.json({ 
    message: 'Auth endpoint available',
    endpoints: [
      '/api/auth/login',
      '/api/auth/register'
    ]
  });
}
