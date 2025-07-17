import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

interface UpdateActiveFamilyBody {
  userId: string;
  familyId: string;
}

// PATCH /api/auth/update-active-family - Update user's active family
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

    const body: UpdateActiveFamilyBody = await request.json();
    const { userId, familyId } = body;

    // Validate required fields
    if (!userId || !familyId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, familyId' },
        { status: 400 }
      );
    }

    // Verify the requesting user matches the userId
    if (decoded.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update user's active family
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { familyId },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform the response to match the expected format
    const userResponse = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      role: updatedUser.role,
      familyId: updatedUser.familyId?.toString(),
      families: updatedUser.families.map((id: mongoose.Types.ObjectId) => id.toString()),
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error updating user active family:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
