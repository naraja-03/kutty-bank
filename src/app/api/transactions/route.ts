import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

interface TransactionQuery {
  userId?: string;
  familyId?: string;
  budgetId?: string;
  type?: 'income' | 'expense';
  category?: string;
}

interface CreateTransactionBody {
  amount: number;
  category: string;
  type: 'income' | 'expense';
  userId: string;
  familyId?: string;
  budgetId?: string;
  note?: string;
  imageUrl?: string;
}

interface PaginationResponse {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PopulatedUser {
  _id: string;
  name: string;
  profileImage?: string;
}

interface TransactionResponse {
  transactions: unknown[];
  pagination: PaginationResponse;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const familyId = searchParams.get('familyId');
    const budgetId = searchParams.get('budgetId');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const skip = offset > 0 ? offset : (page - 1) * limit;
    
    const query: TransactionQuery = {};
    if (userId) query.userId = userId;
    if (familyId) query.familyId = familyId;
    if (budgetId) query.budgetId = budgetId;
    if (type && (type === 'income' || type === 'expense')) query.type = type;
    if (category) query.category = category;
    
    console.log('Transaction query:', query);
    
    let transactions: unknown[] = [];
    let total = 0;
    
    try {
      const rawTransactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('userId', 'name profileImage')
        .lean(); // Use lean() for better performance
        
      transactions = rawTransactions.map((transaction) => ({
        ...transaction,
        id: transaction._id?.toString() || transaction._id, // Add id field mapped from _id
        _id: transaction._id?.toString(), // Keep _id as string
        userId: (transaction.userId as PopulatedUser)?._id?.toString() || transaction.userId,
        userName: (transaction.userId as PopulatedUser)?.name || 'Unknown User',
        profileImage: (transaction.userId as PopulatedUser)?.profileImage || null,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      }));
        
      total = await Transaction.countDocuments(query);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      transactions = [];
      total = 0;
    }

    const response: TransactionResponse = {
      transactions: transactions || [], // Ensure it's always an array
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
    
    const errorResponse: TransactionResponse = {
      transactions: [],
      pagination: {
        current: 1,
        total: 0,
        hasNext: false,
        hasPrev: false
      }
    };
    
    return NextResponse.json(errorResponse, { status: 200 }); // Return 200 with empty data instead of 500
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body: CreateTransactionBody = await request.json();
    const { amount, category, type, userId, familyId, budgetId, note, imageUrl } = body;
    
    if (!amount || !category || !type || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, category, type, userId' },
        { status: 400 }
      );
    }
    
    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type. Must be "income" or "expense"' },
        { status: 400 }
      );
    }
    
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
      budgetId,
      note: note || '',
      imageUrl: imageUrl || null,
    });
    
    const savedTransaction = await transaction.save();
    await savedTransaction.populate('userId', 'name profileImage');
    
    const responseTransaction = {
      ...savedTransaction.toObject(),
      id: savedTransaction._id.toString(),
      _id: savedTransaction._id.toString(),
      userId: savedTransaction.userId?._id?.toString() || savedTransaction.userId,
      userName: savedTransaction.userId?.name || 'Unknown User',
      profileImage: savedTransaction.userId?.profileImage || null,
    };
    
    return NextResponse.json(responseTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    
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
