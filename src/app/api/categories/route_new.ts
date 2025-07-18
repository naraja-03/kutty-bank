import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

// Default categories organized by main category - these will be shown first
const defaultCategories = [
  // Income categories
  {
    name: 'Salary',
    mainCategory: 'income',
    icon: 'DollarSign',
    color: '#5F27CD',
    isDefault: true,
  },
  {
    name: 'Business',
    mainCategory: 'income',
    icon: 'Briefcase',
    color: '#00D2D3',
    isDefault: true,
  },
  {
    name: 'Gift',
    mainCategory: 'income',
    icon: 'Gift',
    color: '#26DE81',
    isDefault: true,
  },
  // Essential categories - organized for 50/30/20 rule
  {
    name: 'Housing & Utilities',
    mainCategory: 'essentials',
    icon: 'Home',
    color: '#FF6B6B',
    isDefault: true,
  },
  {
    name: 'Food & Groceries',
    mainCategory: 'essentials',
    icon: 'ShoppingCart',
    color: '#96CEB4',
    isDefault: true,
  },
  {
    name: 'Transportation',
    mainCategory: 'essentials',
    icon: 'Car',
    color: '#54A0FF',
    isDefault: true,
  },
  {
    name: 'Personal & Health',
    mainCategory: 'essentials',
    icon: 'Heart',
    color: '#FF9FF3',
    isDefault: true,
  },
  // Commitment categories - Fixed obligations
  {
    name: 'Loan EMI',
    mainCategory: 'commitments',
    icon: 'CreditCard',
    color: '#FECA57',
    isDefault: true,
  },
  {
    name: 'Insurance',
    mainCategory: 'commitments',
    icon: 'Shield',
    color: '#A55EEA',
    isDefault: true,
  },
  {
    name: 'Subscriptions',
    mainCategory: 'commitments',
    icon: 'FileText',
    color: '#4ECDC4',
    isDefault: true,
  },
  // Savings categories - Future goals
  {
    name: 'Emergency Fund',
    mainCategory: 'savings',
    icon: 'Piggybank',
    color: '#45B7D1',
    isDefault: true,
  },
  {
    name: 'Investment',
    mainCategory: 'savings',
    icon: 'TrendingUp',
    color: '#26DE81',
    isDefault: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const mainCategory = searchParams.get('mainCategory');

    let filter = {};
    if (mainCategory) {
      filter = { mainCategory };
    }

    // First, try to get categories from database
    let categories = await Category.find(filter).lean();

    // If no categories found or we need defaults, seed the database
    if (categories.length === 0) {
      const categoriesToSeed = mainCategory 
        ? defaultCategories.filter(cat => cat.mainCategory === mainCategory)
        : defaultCategories;

      if (categoriesToSeed.length > 0) {
        await Category.insertMany(categoriesToSeed);
        categories = await Category.find(filter).lean();
      }
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, mainCategory, icon = 'Tag', color = '#6B7280' } = body;

    if (!name || !mainCategory) {
      return NextResponse.json({ error: 'Name and mainCategory are required' }, { status: 400 });
    }

    const category = new Category({
      name,
      mainCategory,
      icon,
      color,
      isDefault: false,
    });

    await category.save();

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
