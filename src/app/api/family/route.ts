import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Family from '@/models/Family';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const familyData = await request.json();

    const newFamily = new Family({
      ...familyData,
      createdBy: userId,
      members: [userId],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedFamily = await newFamily.save();

    await User.findByIdAndUpdate(userId, {
      familyId: savedFamily._id,
    });

    return NextResponse.json({
      success: true,
      family: savedFamily,
    });

  } catch (error) {
    console.error('Family creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create family' },
      { status: 500 }
    );
  }
}
