import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Thread from '@/models/Thread';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const familyId = searchParams.get('familyId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const query = familyId ? { familyId } : { userId };
    const threads = await Thread.find(query).sort({ createdAt: -1 });

    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { 
      label, 
      startDate, 
      endDate, 
      description, 
      targetAmount, 
      userId, 
      familyId 
    } = await request.json();
    
    if (!label || !userId) {
      return NextResponse.json(
        { error: 'Label and user ID are required' },
        { status: 400 }
      );
    }

    const thread = new Thread({
      label,
      value: 'custom',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      description,
      targetAmount: targetAmount || 0,
      userId,
      familyId,
      isCustom: true
    });

    await thread.save();

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
