import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Family from '@/models/Family';
import User from '@/models/User';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';
import jwt from 'jsonwebtoken';

interface CreateFamilyBody {
  name: string;
  targetSavingPerMonth: number;
  members: Array<{
    email: string;
    name: string;
    role: 'admin' | 'member' | 'viewer';
  }>;
}

interface FamilyQuery {
  userId?: string;
  name?: string;
}

// Helper function to transform family data to include both _id and id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformFamilyData(family: any) {
  const familyObj = family.toObject ? family.toObject() : family;
  return {
    ...familyObj,
    id: familyObj._id?.toString() || familyObj.id,
    _id: familyObj._id?.toString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: familyObj.members?.map((member: any) => ({
      ...member,
      id: member._id?.toString() || member.id,
      _id: member._id?.toString(),
    })) || []
  };
}

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    
    await connectToDatabase();
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// GET /api/family - Get families or specific family
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const familyId = searchParams.get('familyId');

    // If no specific params, get current user's families
    if (!userId && !familyId) {
      const currentUser = await getUserFromToken(request);
      if (!currentUser) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Get all families the user belongs to
      if (currentUser.families && currentUser.families.length > 0) {
        const families = await Family.find({
          _id: { $in: currentUser.families }
        }).populate('members', 'name email profileImage role');
        return NextResponse.json(families.map(transformFamilyData));
      }
      return NextResponse.json([]);
    }

    if (familyId) {
      // Get specific family
      const family = await Family.findById(familyId)
        .populate('members', 'name email profileImage role');
      
      if (!family) {
        return NextResponse.json(
          { error: 'Family not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(transformFamilyData(family));
    }

    // Build query
    const query: FamilyQuery = {};
    
    if (userId) {
      // Find families where user is a member
      const user = await User.findById(userId);
      if (user && user.families && user.families.length > 0) {
        const families = await Family.find({
          _id: { $in: user.families }
        }).populate('members', 'name email profileImage role');
        return NextResponse.json(families.map(transformFamilyData));
      }
      return NextResponse.json([]);
    }

    // Get all families (admin only)
    const families = await Family.find(query)
      .populate('members', 'name email profileImage role')
      .sort({ createdAt: -1 });

    return NextResponse.json(families.map(transformFamilyData));
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/family - Create a new family
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body: CreateFamilyBody = await request.json();
    const { name, targetSavingPerMonth } = body;

    // Get current user from token
    const currentUser = await getUserFromToken(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Create family
    const family = new Family({
      name,
      budgetCap: targetSavingPerMonth,
      members: [currentUser._id] // Start with current user as the only member
    });

    const savedFamily = await family.save();

    // Update user's familyId, role, and add to families array
    await User.findByIdAndUpdate(currentUser._id, {
      familyId: savedFamily._id,
      role: 'admin',
      $addToSet: { families: savedFamily._id }
    });

    // Create default budgets for the family
    const defaultBudgets = [
      {
        label: 'This Week',
        value: 'week',
        description: 'Weekly budget tracking',
        targetAmount: 0,
        userId: currentUser._id,
        familyId: savedFamily._id,
        isCustom: false
      },
      {
        label: 'This Month',
        value: 'month',
        description: 'Monthly budget tracking',
        targetAmount: targetSavingPerMonth || 0,
        userId: currentUser._id,
        familyId: savedFamily._id,
        isCustom: false
      },
      {
        label: 'This Year',
        value: 'year',
        description: 'Yearly budget tracking',
        targetAmount: (targetSavingPerMonth || 0) * 12,
        userId: currentUser._id,
        familyId: savedFamily._id,
        isCustom: false
      }
    ];

    await Budget.insertMany(defaultBudgets);

    // TODO: If members are provided, create invitations or add them
    // For now, just create the family with the current user

    // Populate and return
    await savedFamily.populate('members', 'name email profileImage role');

    return NextResponse.json(transformFamilyData(savedFamily), { status: 201 });
  } catch (error) {
    console.error('Error creating family:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/family - Update family
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { familyId, name, budgetCap } = body;

    if (!familyId) {
      return NextResponse.json(
        { error: 'Missing required field: familyId' },
        { status: 400 }
      );
    }

    const updatedFamily = await Family.findByIdAndUpdate(
      familyId,
      { name, budgetCap },
      { new: true, runValidators: true }
    ).populate('members', 'name email profileImage role');

    if (!updatedFamily) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFamily);
  } catch (error) {
    console.error('Error updating family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/family - Delete family (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');

    if (!familyId) {
      return NextResponse.json(
        { error: 'Missing required parameter: familyId' },
        { status: 400 }
      );
    }

    // Get current user from token
    const currentUser = await getUserFromToken(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find the family and check if user is an admin
    const family = await Family.findById(familyId);
    if (!family) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }

    // Check if current user is admin of this family
    if (currentUser.role !== 'admin' || !currentUser.families?.includes(familyId)) {
      return NextResponse.json(
        { error: 'Unauthorized: Only family admins can delete families' },
        { status: 403 }
      );
    }

    // Remove family reference from all members
    await User.updateMany(
      { families: familyId },
      { 
        $pull: { families: familyId },
        $unset: { familyId: "", role: "" }
      }
    );

    // Delete all budgets associated with this family
    await Budget.deleteMany({ familyId });

    // Delete all transactions associated with this family
    await Transaction.deleteMany({ familyId });

    // Delete the family
    await Family.findByIdAndDelete(familyId);

    return NextResponse.json(
      { message: 'Family deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
