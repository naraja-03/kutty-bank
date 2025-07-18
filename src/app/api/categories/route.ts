import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

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

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      userId: string;
    };

    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const mainCategory = searchParams.get('mainCategory');

    // Check if user is authenticated
    const user = await getUserFromToken(request);

    let categories = [];

    if (user) {
      // For authenticated users, get both default categories and user-specific ones
      const filter: Record<string, unknown> = {
        $or: [
          { isDefault: true },
          { userId: user._id }
        ]
      };
      if (mainCategory) {
        filter.mainCategory = mainCategory;
      }
      categories = await Category.find(filter).lean();
    } else {
      // For anonymous users, only show default categories
      const filter: Record<string, unknown> = { isDefault: true };
      if (mainCategory) {
        filter.mainCategory = mainCategory;
      }
      categories = await Category.find(filter).lean();
    }

    // If no default categories found, seed them
    const defaultCategoriesExist = categories.some(cat => cat.isDefault);
    if (!defaultCategoriesExist) {
      const categoriesToSeed = mainCategory 
        ? defaultCategories.filter(cat => cat.mainCategory === mainCategory)
        : defaultCategories;

      if (categoriesToSeed.length > 0) {
        await Category.insertMany(categoriesToSeed);
        // Re-fetch categories after seeding
        const filter: Record<string, unknown> = user ? {
          $or: [
            { isDefault: true },
            { userId: user._id }
          ]
        } : { isDefault: true };
        if (mainCategory) {
          filter.mainCategory = mainCategory;
        }
        categories = await Category.find(filter).lean();
      }
    }

    // Transform categories to include id field and remove _id

    interface CategoryForTransform {
      _id: { toString(): string };
      mainCategory?: string;
      [key: string]: unknown;
    }

    const transformedCategories = categories.map(category => {
      // Since we use .lean(), category is already a plain object  
      const categoryWithId = category as unknown as CategoryForTransform;
      return {
        ...categoryWithId,
        id: categoryWithId._id.toString(),
        _id: undefined
      };
    });

    // If no mainCategory specified, return organized by category
    if (!mainCategory) {
      const organized = {
        income: transformedCategories.filter(cat => cat.mainCategory === 'income'),
        essentials: transformedCategories.filter(cat => cat.mainCategory === 'essentials'),
        commitments: transformedCategories.filter(cat => cat.mainCategory === 'commitments'),
        savings: transformedCategories.filter(cat => cat.mainCategory === 'savings'),
      };
      return NextResponse.json({ categoriesByType: organized, categories: transformedCategories });
    }

    return NextResponse.json({ categories: transformedCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required',
        requireSignIn: true 
      }, { status: 401 });
    }

    // Check if user is anonymous
    if (user.isAnonymous) {
      return NextResponse.json({ 
        error: 'Please sign in to create custom categories',
        requireSignIn: true 
      }, { status: 403 });
    }

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

    // Transform the response to include id field
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
