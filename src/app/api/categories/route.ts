import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import mongoose from 'mongoose';

interface QueryParams {
  userId?: string;
  familyId?: string;
  mainCategory?: 'income' | 'essentials' | 'commitments' | 'savings';
  isDefault: boolean;
}

// /api/categories?userId=xxx&familyId=yyy&mainCategory=income
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const query: QueryParams = {
      userId: searchParams.get('userId') || undefined,
      familyId: searchParams.get('familyId') || undefined,
      mainCategory: searchParams.get('mainCategory') as QueryParams['mainCategory'] || undefined,
      isDefault: false
    };

    // Use a strongly-typed query object
    const dbQuery: Record<string, unknown> = {
      $or: [{ isDefault: true }],
    };

    if (query.userId && mongoose.Types.ObjectId.isValid(query.userId)) {
      (dbQuery.$or as object[]).push({ userId: new mongoose.Types.ObjectId(query.userId) });
    }

    if (query.familyId && mongoose.Types.ObjectId.isValid(query.familyId)) {
      (dbQuery.$or as object[]).push({ familyId: new mongoose.Types.ObjectId(query.familyId) });
    }

    if (query.mainCategory) {
      dbQuery.mainCategory = query.mainCategory;
    }

    const categories = await Category.find(dbQuery).sort({ createdAt: 1 }).lean();

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
