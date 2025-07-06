import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// POST /api/threads - Create a new thread based on transaction content
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { transactionId, label, note } = await request.json();
    
    if (!transactionId || !label) {
      return NextResponse.json(
        { error: 'Transaction ID and label are required' },
        { status: 400 }
      );
    }

    // Find the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Create a thread object (for now, we'll just return the transaction data)
    // In a real app, you might want to create a separate Thread model
    const thread = {
      id: `thread-${Date.now()}`,
      label,
      transactionId,
      note,
      createdAt: new Date(),
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      userName: transaction.userName,
      profileImage: transaction.profileImage,
      timestamp: transaction.timestamp
    };

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/threads - Get all threads
export async function GET() {
  try {
    await connectToDatabase();
    
    // For now, return recent transactions as threads
    // In a real app, you might have a separate Thread model
    const recentTransactions = await Transaction.find()
      .sort({ timestamp: -1 })
      .limit(10);

    const threads = recentTransactions.map(transaction => ({
      id: `thread-${transaction._id}`,
      label: `${transaction.type === 'income' ? 'Income' : 'Expense'}: ${transaction.category}`,
      transactionId: transaction._id,
      createdAt: transaction.timestamp,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      userName: transaction.userName,
      profileImage: transaction.profileImage,
      timestamp: transaction.timestamp
    }));

    return NextResponse.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
