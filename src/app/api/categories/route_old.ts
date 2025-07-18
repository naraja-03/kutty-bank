import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';

// Default categories organized by main category
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
  // Essential categories
  {
    name: 'Housing & Utilities',
    mainCategory: 'essentials',
    icon: 'Home',
    color: '#FF6B6B',
    isDefault: true,
  },
  {
    name: 'Personal & Health',
    mainCategory: 'essentials',
    icon: 'Heart',
    color: '#FF9FF3',
    isDefault: true,
  },
  {
    name: 'Living Expenses',
    mainCategory: 'essentials',
    icon: 'ShoppingCart',
    color: '#96CEB4',
    isDefault: true,
  },
  // Commitment categories
  {
    name: 'Loan EMI',
    mainCategory: 'commitments',
    icon: 'CreditCard',
    color: '#FECA57',
    isDefault: true,
  },
  {
    name: 'Billing',
    mainCategory: 'commitments',
    icon: 'FileText',
    color: '#54A0FF',
    isDefault: true,
  },
  {
    name: 'Insurance',
    mainCategory: 'commitments',
    icon: 'Shield',
    color: '#A55EEA',
    isDefault: true,
  },
  // Savings categories
  {
    name: 'Investments/SIP',
    mainCategory: 'savings',
    icon: 'TrendingUp',
    color: '#F78C6C',
    isDefault: true,
  },
  {
    name: 'Bank Savings',
    mainCategory: 'savings',
    icon: 'Banknote',
    color: '#2C3E50',
    isDefault: true,
  },
  {
    name: 'Emergency Fund',
    mainCategory: 'savings',
    icon: 'ShieldCheck',
    color: '#1B9CFC',
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

    // Transform _id to id for frontend compatibility
    const transformedCategories = categories.map(category => {
      const { _id, ...rest } = category as { _id: { toString: () => string }; [key: string]: unknown };
      return {
        ...rest,
        id: _id.toString()
      };
    });

    return NextResponse.json({ categories: transformedCategories });
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

    // Transform _id to id for frontend compatibility
    const transformedCategory = {
      ...category.toObject(),
      id: category._id.toString(),
      _id: undefined
    };

    return NextResponse.json({ category: transformedCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
