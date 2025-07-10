import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Auth endpoint available',
    endpoints: [
      '/api/auth/login',
      '/api/auth/register'
    ]
  });
}
