import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Thread from '@/models/Thread';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { userId, familyId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const sampleThreads = [
      {
        label: 'Vacation Fund 2025',
        value: 'custom',
        description: 'Saving up for our family vacation to Europe',
        targetAmount: 150000,
        userId,
        familyId,
        isCustom: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-30'),
      },
      {
        label: 'Emergency Fund',
        value: 'custom',
        description: 'Building an emergency fund for unexpected expenses',
        targetAmount: 300000,
        userId,
        familyId,
        isCustom: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
      {
        label: 'Home Renovation',
        value: 'custom',
        description: 'Saving for kitchen and bathroom renovations',
        targetAmount: 500000,
        userId,
        familyId,
        isCustom: true,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-09-30'),
      }
    ];

    await Thread.deleteMany({ userId, label: { $in: sampleThreads.map(t => t.label) } });

    const threads = await Thread.insertMany(sampleThreads);

    return NextResponse.json({
      message: 'Sample threads created successfully',
      threads
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating sample threads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
