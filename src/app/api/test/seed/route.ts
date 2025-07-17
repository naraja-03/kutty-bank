import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import Family from '@/models/Family';
import bcrypt from 'bcryptjs';

// POST /api/test/seed - Create test data
export async function POST() {
  try {
    await connectToDatabase();

    // Create Threedot family users
    const familyUsers = [
      {
        name: 'Raja',
        email: 'santhanarajadev3@gmail.com',
        password: await bcrypt.hash('Ajar003@gmail.com', 12),
        role: 'admin',
      },
      {
        name: 'Suriya',
        email: 'suriyaprakash06@gmail.com',
        password: await bcrypt.hash('Suriya06', 12),
        role: 'member',
      },
    ];

    // Clear existing data
    await User.deleteMany({ email: { $in: familyUsers.map(u => u.email) } });
    await Transaction.deleteMany({});
    await Family.deleteMany({ name: 'Threedot' });

    // Create users
    const createdUsers = await User.insertMany(familyUsers);

    // Create Threedot family
    const threedotFamily = new Family({
      name: 'Threedot',
      members: createdUsers.map(user => user._id),
      budgetCap: 200000, // 2 lakhs budget cap
    });
    await threedotFamily.save();

    // Update users with familyId
    await User.updateMany(
      { _id: { $in: createdUsers.map(u => u._id) } },
      { $set: { familyId: threedotFamily._id } }
    );

    // Create July 2025 transactions (day 1-5)
    const currentYear = 2025;
    const currentMonth = 6; // July (0-indexed)

    const familyTransactions = [
      // Raja's transactions - 82k total
      {
        amount: 25000,
        category: 'salary',
        type: 'income',
        userId: createdUsers[0]._id,
        note: 'Project payment - Phase 1',
        createdAt: new Date(currentYear, currentMonth, 1, 10, 0), // July 1, 10:00 AM
      },
      {
        amount: 30000,
        category: 'business',
        type: 'income',
        userId: createdUsers[0]._id,
        note: 'Client consultation fees',
        createdAt: new Date(currentYear, currentMonth, 2, 14, 30), // July 2, 2:30 PM
      },
      {
        amount: 15000,
        category: 'salary',
        type: 'income',
        userId: createdUsers[0]._id,
        note: 'Freelance development work',
        createdAt: new Date(currentYear, currentMonth, 3, 9, 15), // July 3, 9:15 AM
      },
      {
        amount: 12000,
        category: 'business',
        type: 'income',
        userId: createdUsers[0]._id,
        note: 'Website maintenance contract',
        createdAt: new Date(currentYear, currentMonth, 4, 16, 45), // July 4, 4:45 PM
      },

      // Suriya's transactions - 40k total
      {
        amount: 20000,
        category: 'salary',
        type: 'income',
        userId: createdUsers[1]._id,
        note: 'Monthly salary payment',
        createdAt: new Date(currentYear, currentMonth, 1, 11, 30), // July 1, 11:30 AM
      },
      {
        amount: 10000,
        category: 'business',
        type: 'income',
        userId: createdUsers[1]._id,
        note: 'Part-time project bonus',
        createdAt: new Date(currentYear, currentMonth, 3, 13, 20), // July 3, 1:20 PM
      },
      {
        amount: 10000,
        category: 'investment',
        type: 'income',
        userId: createdUsers[1]._id,
        note: 'Investment returns',
        createdAt: new Date(currentYear, currentMonth, 5, 10, 10), // July 5, 10:10 AM
      },

      // Some small expenses for realism
      {
        amount: 500,
        category: 'food',
        type: 'expense',
        userId: createdUsers[0]._id,
        note: 'Coffee meeting with client',
        createdAt: new Date(currentYear, currentMonth, 2, 10, 0), // July 2, 10:00 AM
      },
      {
        amount: 800,
        category: 'transport',
        type: 'expense',
        userId: createdUsers[1]._id,
        note: 'Uber for project meeting',
        createdAt: new Date(currentYear, currentMonth, 3, 15, 30), // July 3, 3:30 PM
      },
      {
        amount: 1200,
        category: 'food',
        type: 'expense',
        userId: createdUsers[0]._id,
        note: 'Team lunch celebration',
        createdAt: new Date(currentYear, currentMonth, 4, 12, 45), // July 4, 12:45 PM
      },
    ];

    await Transaction.insertMany(familyTransactions);

    return NextResponse.json({
      message: 'Threedot family data created successfully',
      users: createdUsers.length,
      transactions: familyTransactions.length,
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json({ error: 'Failed to create test data' }, { status: 500 });
  }
}

// DELETE /api/test/seed - Clear test data
export async function DELETE() {
  try {
    await connectToDatabase();

    await Transaction.deleteMany({});
    await User.deleteMany({});

    return NextResponse.json({ message: 'Test data cleared' });
  } catch (error) {
    console.error('Error clearing test data:', error);
    return NextResponse.json({ error: 'Failed to clear test data' }, { status: 500 });
  }
}
