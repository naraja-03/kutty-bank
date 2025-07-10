import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'member' | 'view-only';
  familyId?: string;
}

interface RegisterResponse {
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

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body: RegisterBody = await request.json();
    const { name, email, password, role = 'member', familyId } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      familyId
    });

    const savedUser = await user.save();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const response: RegisterResponse = {
      user: {
        id: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        profileImage: savedUser.profileImage,
        familyId: savedUser.familyId?.toString(),
        families: (savedUser.families || []).map(String)
      },
      token
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
