import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    familyId?: string;
    families: string[];
  };
  token: string;
}

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
  console.log('Login API called');
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected');

    const body: LoginBody = await request.json();
    console.log('Request body parsed:', { email: body.email, passwordProvided: !!body.password });
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: email, password' },
        { status: 400 }
      );
    }

    console.log('Finding user with email:', email);
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('User found, checking password');
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Password valid, generating token');
    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.log('JWT_SECRET is not configured');
      throw new Error('JWT_SECRET is not configured');
    }

    console.log('JWT secret found, signing token');
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    console.log('Token signed, preparing response');
    const response: LoginResponse = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        familyId: user.familyId?.toString(),
        families: (user.families || []).map(String),
      },
      token,
    };

    console.log('Returning successful response');
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
