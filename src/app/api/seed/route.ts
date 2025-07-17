import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import Family from '@/models/Family';
import Transaction from '@/models/Transaction';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing data
    await User.deleteMany({});
    await Family.deleteMany({});
    await Transaction.deleteMany({});

    // Create family first
    const family = new Family({
      name: 'Raja & Suriya Family',
      budgetCap: 200000, // 2 lakh monthly budget
      members: [], // Will be populated after creating users
    });
    await family.save();

    // Create users with proper roles
    const hashedPassword = await bcrypt.hash('password123', 10);

    const raja = new User({
      name: 'Raja',
      email: 'raja@example.com',
      password: hashedPassword,
      role: 'admin',
      familyId: family._id,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raja',
    });
    await raja.save();

    const suriya = new User({
      name: 'Suriya',
      email: 'suriya@example.com',
      password: hashedPassword,
      role: 'member',
      familyId: family._id,
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suriya',
    });
    await suriya.save();

    // Update family with member IDs
    family.members = [raja._id, suriya._id];
    await family.save();

    // Create sample transactions for July 2025
    const transactions = [
      // Raja's income
      {
        amount: 82000,
        category: 'salary',
        type: 'income',
        userId: raja._id,
        familyId: family._id,
        note: 'Monthly salary - July 2025',
        timestamp: new Date('2025-07-01T09:00:00Z'),
      },
      // Suriya's income
      {
        amount: 40000,
        category: 'salary',
        type: 'income',
        userId: suriya._id,
        familyId: family._id,
        note: 'Monthly salary - July 2025',
        timestamp: new Date('2025-07-01T09:30:00Z'),
      },
      // Some expenses
      {
        amount: 5000,
        category: 'food',
        type: 'expense',
        userId: raja._id,
        familyId: family._id,
        note: 'Monthly groceries',
        timestamp: new Date('2025-07-02T10:00:00Z'),
      },
      {
        amount: 3000,
        category: 'transport',
        type: 'expense',
        userId: suriya._id,
        familyId: family._id,
        note: 'Fuel and metro card',
        timestamp: new Date('2025-07-03T14:00:00Z'),
      },
      {
        amount: 2000,
        category: 'entertainment',
        type: 'expense',
        userId: raja._id,
        familyId: family._id,
        note: 'Movie night',
        timestamp: new Date('2025-07-05T19:00:00Z'),
      },
      {
        amount: 1500,
        category: 'food',
        type: 'expense',
        userId: suriya._id,
        familyId: family._id,
        note: 'Lunch with friends',
        timestamp: new Date('2025-07-06T13:00:00Z'),
      },
    ];

    await Transaction.insertMany(transactions);

    return NextResponse.json({
      message: 'Database seeded successfully',
      family: {
        name: family.name,
        budgetCap: family.budgetCap,
      },
      users: [
        { name: raja.name, email: raja.email, role: raja.role },
        { name: suriya.name, email: suriya.email, role: suriya.role },
      ],
      transactionCount: transactions.length,
      totalIncome: 122000,
      totalExpenses: 11500,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
