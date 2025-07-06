import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyBalance: number;
  categoryBreakdown: {
    category: string;
    total: number;
    count: number;
  }[];
  recentTransactions: unknown[];
}

// GET /api/transactions/stats - Get transaction statistics
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const familyId = searchParams.get('familyId');
    const period = searchParams.get('period') || 'all'; // 'all', 'month', 'year'

    // Build base query
    const baseQuery: Record<string, unknown> = {};
    if (userId) baseQuery.userId = userId;
    if (familyId) baseQuery.familyId = familyId;

    // Add date filter based on period
    if (period === 'month') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      baseQuery.createdAt = { $gte: firstDay };
    } else if (period === 'year') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), 0, 1);
      baseQuery.createdAt = { $gte: firstDay };
    }

    // Get total income and expense
    const [incomeStats, expenseStats] = await Promise.all([
      Transaction.aggregate([
        { $match: { ...baseQuery, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Transaction.aggregate([
        { $match: { ...baseQuery, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ])
    ]);

    const totalIncome = incomeStats[0]?.total || 0;
    const totalExpense = expenseStats[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    // Get monthly stats
    const currentMonth = new Date();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const [monthlyIncomeStats, monthlyExpenseStats] = await Promise.all([
      Transaction.aggregate([
        { $match: { ...baseQuery, type: 'income', createdAt: { $gte: firstDayOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { ...baseQuery, type: 'expense', createdAt: { $gte: firstDayOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const monthlyIncome = monthlyIncomeStats[0]?.total || 0;
    const monthlyExpense = monthlyExpenseStats[0]?.total || 0;
    const monthlyBalance = monthlyIncome - monthlyExpense;

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { ...baseQuery, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      {
        $project: {
          category: '$_id',
          total: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find(baseQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name profileImage');

    const stats: TransactionStats = {
      totalIncome,
      totalExpense,
      balance,
      monthlyIncome,
      monthlyExpense,
      monthlyBalance,
      categoryBreakdown,
      recentTransactions
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
