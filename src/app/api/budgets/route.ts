import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Budget from '@/models/Budget';

// GET /api/budgets - Get all budgets for the user
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const familyId = searchParams.get('familyId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's custom budgets
    const query = familyId ? { familyId } : { userId };
    const budgets = await Budget.find(query).sort({ createdAt: -1 });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/budgets - Create a new custom budget
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { 
      label, 
      description, 
      targetAmount, 
      userId, 
      familyId 
    } = await request.json();
    
    if (!label || !userId) {
      return NextResponse.json(
        { error: 'Label and user ID are required' },
        { status: 400 }
      );
    }

    // Create a new custom budget
    const budget = new Budget({
      label,
      value: 'custom',
      description,
      targetAmount: targetAmount || 0,
      userId,
      familyId,
      isCustom: true
    });

    await budget.save();

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/budgets - Update a custom budget
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { 
      id,
      label, 
      description, 
      targetAmount, 
      userId 
    } = await request.json();
    
    if (!id || !label || !userId) {
      return NextResponse.json(
        { error: 'ID, label, and user ID are required' },
        { status: 400 }
      );
    }

    // Update the budget
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: id, userId }, // Ensure user owns the budget
      {
        label,
        description,
        targetAmount: targetAmount || 0
      },
      { new: true }
    );

    if (!updatedBudget) {
      return NextResponse.json(
        { error: 'Budget not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/budgets - Delete a custom budget
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Budget ID and user ID are required' },
        { status: 400 }
      );
    }

    // Delete the budget
    const deletedBudget = await Budget.findOneAndDelete({
      _id: id,
      userId // Ensure user owns the budget
    });

    if (!deletedBudget) {
      return NextResponse.json(
        { error: 'Budget not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
