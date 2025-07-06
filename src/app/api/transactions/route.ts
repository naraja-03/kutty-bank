import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

interface TransactionQuery {
  userId?: string;
  familyId?: string;
  type?: 'income' | 'expense';
  category?: string;
}

interface CreateTransactionBody {
  amount: number;
  category: string;
  type: 'income' | 'expense';
  userId: string;
  familyId?: string;
  note?: string;
  imageUrl?: string;
}

interface PaginationResponse {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface TransactionResponse {
  transactions: unknown[];
  pagination: PaginationResponse;
}

// GET /api/transactions - Get all transactions with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const familyId = searchParams.get('familyId');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Use offset if provided, otherwise use page
    const skip = offset > 0 ? offset : (page - 1) * limit;
    
    // Build query object with proper typing
    const query: TransactionQuery = {};
    if (userId) query.userId = userId;
    if (familyId) query.familyId = familyId;
    if (type && (type === 'income' || type === 'expense')) query.type = type;
    if (category) query.category = category;
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('userId', 'name profileImage');

    // Transform data to match frontend expectations
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction._id.toString(),
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      note: transaction.note,
      imageUrl: transaction.imageUrl,
      timestamp: transaction.createdAt,
      userName: transaction.userId?.name || 'Unknown User',
      profileImage: transaction.userId?.profileImage || null
    }));
    
    const total = await Transaction.countDocuments(query);
    
    const response: TransactionResponse = {
      transactions: transformedTransactions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body: CreateTransactionBody = await request.json();
    const { amount, category, type, userId, familyId, note, imageUrl } = body;
    
    // Validate required fields
    if (!amount || !category || !type || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, category, type, userId' },
        { status: 400 }
      );
    }
    
    // Validate transaction type
    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type. Must be "income" or "expense"' },
        { status: 400 }
      );
    }
    
    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    const transaction = new Transaction({
      amount: Number(amount),
      category,
      type,
      userId,
      familyId,
      note: note || '',
      imageUrl: imageUrl || null,
    });
    
    const savedTransaction = await transaction.save();
    await savedTransaction.populate('userId', 'name profileImage');
    
    return NextResponse.json(savedTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    
    // Handle validation errors
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