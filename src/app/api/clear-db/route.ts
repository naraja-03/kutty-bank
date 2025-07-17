import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Thread from '@/models/Thread';
import Budget from '@/models/Budget';
import User from '@/models/User';
import Family from '@/models/Family';

// POST /api/clear-db - Clear all data from the database
export async function POST() {
  try {
    await connectToDatabase();

    // Clear all collections
    await Transaction.deleteMany({});
    await Thread.deleteMany({});
    await Budget.deleteMany({});
    await User.deleteMany({});
    await Family.deleteMany({});

    return NextResponse.json(
      {
        message: 'Database cleared successfully',
        cleared: ['transactions', 'threads', 'budgets', 'users', 'families'],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error clearing database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
