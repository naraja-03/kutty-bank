import { NextRequest, NextResponse } from 'next/server';

const categories = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#FF6B6B',
    type: 'expense'
  },
  {
    id: 'transport',
    name: 'Transportation',
    icon: '🚗',
    color: '#4ECDC4',
    type: 'expense'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#45B7D1',
    type: 'expense'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#96CEB4',
    type: 'expense'
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    icon: '💡',
    color: '#FECA57',
    type: 'expense'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    color: '#FF9FF3',
    type: 'expense'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: '#54A0FF',
    type: 'expense'
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: '#00D2D3',
    type: 'expense'
  },
  {
    id: 'salary',
    name: 'Salary',
    icon: '💰',
    color: '#5F27CD',
    type: 'income'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: '💻',
    color: '#FF6348',
    type: 'income'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    color: '#00D2D3',
    type: 'income'
  },
  {
    id: 'investment',
    name: 'Investment',
    icon: '📈',
    color: '#FF9F43',
    type: 'income'
  },
  {
    id: 'allowance',
    name: 'Allowance',
    icon: '💵',
    color: '#A55EEA',
    type: 'income'
  },
  {
    id: 'gift',
    name: 'Gift',
    icon: '🎁',
    color: '#26DE81',
    type: 'income'
  },
  {
    id: 'refund',
    name: 'Refund',
    icon: '💸',
    color: '#74B9FF',
    type: 'income'
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📂',
    color: '#778CA3',
    type: 'both'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'income' | 'expense' | 'both';

    let filteredCategories = categories;

    if (type && type !== 'both') {
      filteredCategories = categories.filter(
        category => category.type === type || category.type === 'both'
      );
    }

    return NextResponse.json(filteredCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, color, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type' },
        { status: 400 }
      );
    }

    if (!['income', 'expense', 'both'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "income", "expense", or "both"' },
        { status: 400 }
      );
    }

    const customCategory = {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      icon: icon || '📂',
      color: color || '#778CA3',
      type,
      custom: true
    };

    return NextResponse.json(customCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
