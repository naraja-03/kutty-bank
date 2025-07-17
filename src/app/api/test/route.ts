import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Family from '@/models/Family';

// GET /api/test - Test API connection and check seeded data
export async function GET() {
  try {
    await connectToDatabase();

    // Check if seeded users exist
    const users = await User.find({}).select('-password');
    const families = await Family.find({});

    return NextResponse.json({
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      mongodb: 'Connected successfully',
      users: users.length,
      families: families.length,
      userData: users.map(u => ({ name: u.name, email: u.email, role: u.role })),
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      {
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
