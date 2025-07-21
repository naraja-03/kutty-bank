import { NextRequest, NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongoClient';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

interface TransactionData {
  userId: string;
  familyId: string;
  category: 'income' | 'essential' | 'commitment' | 'saving';
  subCategory: string;
  amount: number;
  notes: string;
  createdAt: Date;
}

interface StoredTransaction {
  _id: ObjectId;
  userId: string;
  familyId: string;
  category: 'income' | 'essential' | 'commitment' | 'saving';
  subCategory: string;
  amount: number;
  notes: string;
  createdAt: Date;
}

// GET - Fetch transactions for a family
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const { db } = await getMongoClient();
    
    // Get user's family
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decoded.userId) 
    });
    
    if (!user?.familyId) {
      return NextResponse.json({ error: 'No family found' }, { status: 404 });
    }

    // Get transactions for the family
    const transactions = await db.collection('transactions')
      .find({ familyId: user.familyId })
      .sort({ createdAt: -1 })
      .toArray() as StoredTransaction[];

    return NextResponse.json({ 
      success: true, 
      transactions: transactions.map((transaction: StoredTransaction) => ({
        id: transaction._id.toString(),
        category: transaction.category,
        subCategory: transaction.subCategory,
        amount: transaction.amount,
        notes: transaction.notes,
        createdAt: transaction.createdAt,
        userId: transaction.userId
      }))
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// // POST - Add new transaction
// export async function POST(request: NextRequest) {
//   try {
//     const authHeader = request.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

//     const body = await request.json();
//     const { category, subCategory, amount, notes } = body;

//     // Validation
//     if (!category || !subCategory || !amount) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     if (!['income', 'essential', 'commitment', 'saving'].includes(category)) {
//       return NextResponse.json({ error: 'Invalid transaction category' }, { status: 400 });
//     }

//     if (amount <= 0) {
//       return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
//     }

//     const { db } = await getMongoClient();

//     // Get user's family
//     const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

//     if (!user?.familyId) {
//       return NextResponse.json({ error: 'No family found' }, { status: 404 });
//     }

//     // Create transaction document
//     const transactionData: TransactionData = {
//       userId: decoded.userId,
//       familyId: user.familyId,
//       category,
//       subCategory: subCategory.trim(),
//       amount: parseFloat(amount),
//       notes: notes.trim(),
//       createdAt: new Date()
//     };

//     const result = await db.collection('transactions').insertOne(transactionData);

//     // const defaultSubcategories = [
//     //   'Business', 'Freelance', 'Salary', 'Investment',
//     //   'Groceries', 'Rent', 'EMI', 'Bills', 'Insurance',
//     //   'Savings', 'Goal', 'Medical', 'Education'
//     // ];

//     // const isDefaultCategory = defaultSubcategories.includes(subCategory.trim());

//     // if (!isDefaultCategory) {
//     //   const existingCategory = await db.collection('categories').findOne({
//     //     categoryType: category,
//     //     name: subCategory.trim(),
//     //     familyId: user.familyId
//     //   });

//     //   if (!existingCategory) {
//     //     await db.collection('categories').insertOne({
//     //       userId: decoded.userId,
//     //       familyId: user.familyId,
//     //       categoryType: category,
//     //       name: subCategory.trim(),
//     //       isDefault: false,
//     //       createdAt: new Date()
//     //     });
//     //   }
//     // }

//     return NextResponse.json({
//       success: true,
//       transactionId: result.insertedId,
//       message: 'Transaction added successfully'
//     });
//   } catch (error) {
//     console.error('Error adding transaction:', error);
//     return NextResponse.json(
//       { error: 'Failed to add transaction' },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const body = await request.json();
    console.log('Received body:', body);

    const { category, subCategory, amount, notes } = body;

    if (!category || !subCategory || amount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['income', 'essential', 'commitment', 'saving'].includes(category)) {
      return NextResponse.json({ error: 'Invalid transaction category' }, { status: 400 });
    }

    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!parsedAmount || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    const trimmedSubCategory = typeof subCategory === 'string' ? subCategory.trim() : '';
    const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';

    const { db } = await getMongoClient();

    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    if (!user?.familyId) {
      return NextResponse.json({ error: 'No family found' }, { status: 404 });
    }

    const transactionData: TransactionData = {
      userId: decoded.userId,
      familyId: user.familyId,
      category,
      subCategory: trimmedSubCategory,
      amount: parsedAmount,
      notes: trimmedNotes,
      createdAt: new Date()
    };

    const result = await db.collection('transactions').insertOne(transactionData);

    return NextResponse.json({
      success: true,
      transactionId: result.insertedId,
      message: 'Transaction added successfully'
    });

  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json(
      { error: 'Failed to add transaction' },
      { status: 500 }
    );
  }
}



// DELETE - Delete a transaction
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json({ 
        error: 'Transaction ID is required' 
      }, { status: 400 });
    }

    const { db } = await getMongoClient();
    
    // Get user's family
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decoded.userId) 
    });
    
    if (!user?.familyId) {
      return NextResponse.json({ error: 'No family found' }, { status: 404 });
    }

    // Delete transaction (only if it belongs to user's family)
    const result = await db.collection('transactions').deleteOne({
      _id: new ObjectId(transactionId),
      familyId: user.familyId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        error: 'Transaction not found or unauthorized' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
