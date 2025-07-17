import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

interface UpdateTransactionBody {
  amount?: number;
  category?: string;
  type?: 'income' | 'expense';
  note?: string;
  imageUrl?: string;
}

// Helper function to transform transaction data to include both _id and id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformTransactionData(transaction: any) {
  const transactionObj = transaction.toObject ? transaction.toObject() : transaction;
  return {
    ...transactionObj,
    id: transactionObj._id?.toString() || transactionObj.id,
    _id: transactionObj._id?.toString(),
    userId: transactionObj.userId?.toString() || transactionObj.userId,
    familyId: transactionObj.familyId?.toString() || transactionObj.familyId,
  };
}

// GET /api/transactions/[id] - Get a specific transaction
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transformTransactionData(transaction));
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/transactions/[id] - Update a specific transaction
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body: UpdateTransactionBody = await request.json();
    const { amount, category, type, note, imageUrl } = body;

    // Validate required fields
    if (!amount || !category || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, category, type' },
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
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        amount: Number(amount),
        category,
        type,
        note: note || '',
        imageUrl: imageUrl || null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    await updatedTransaction.populate('userId', 'name profileImage');

    return NextResponse.json(transformTransactionData(updatedTransaction));
  } catch (error) {
    console.error('Error updating transaction:', error);

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/transactions/[id] - Delete a specific transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
