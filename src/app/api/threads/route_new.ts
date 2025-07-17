import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Thread from '@/models/Thread';

// GET /api/threads - Get all threads for the user
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const familyId = searchParams.get('familyId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user's custom threads
    const query = familyId ? { familyId } : { userId };
    const threads = await Thread.find(query).sort({ createdAt: -1 });

    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/threads - Create a new custom thread
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { label, startDate, endDate, description, targetAmount, userId, familyId } =
      await request.json();

    if (!label || !userId) {
      return NextResponse.json({ error: 'Label and user ID are required' }, { status: 400 });
    }

    // Create a new custom thread
    const thread = new Thread({
      label,
      value: 'custom',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      description,
      targetAmount: targetAmount || 0,
      userId,
      familyId,
      isCustom: true,
    });

    await thread.save();

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/threads - Update a custom thread
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const { id, label, startDate, endDate, description, targetAmount, userId } =
      await request.json();

    if (!id || !label || !userId) {
      return NextResponse.json({ error: 'ID, label, and user ID are required' }, { status: 400 });
    }

    // Update the thread
    const updatedThread = await Thread.findOneAndUpdate(
      { _id: id, userId }, // Ensure user owns the thread
      {
        label,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        description,
        targetAmount: targetAmount || 0,
      },
      { new: true }
    );

    if (!updatedThread) {
      return NextResponse.json({ error: 'Thread not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json(updatedThread);
  } catch (error) {
    console.error('Error updating thread:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/threads - Delete a custom thread
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json({ error: 'Thread ID and user ID are required' }, { status: 400 });
    }

    // Delete the thread
    const deletedThread = await Thread.findOneAndDelete({
      _id: id,
      userId, // Ensure user owns the thread
    });

    if (!deletedThread) {
      return NextResponse.json({ error: 'Thread not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
