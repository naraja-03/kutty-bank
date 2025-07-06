import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

interface UserQuery {
  familyId?: string;
  role?: 'admin' | 'member' | 'view-only';
  email?: string;
}

interface UpdateUserBody {
  name?: string;
  profileImage?: string;
  role?: 'admin' | 'member' | 'view-only';
}

// Helper function to transform user data to include both _id and id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformUserData(user: any) {
  const userObj = user.toObject ? user.toObject() : user;
  return {
    ...userObj,
    id: userObj._id?.toString() || userObj.id,
    _id: userObj._id?.toString(),
    familyId: userObj.familyId?._id?.toString() || userObj.familyId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    families: userObj.families?.map((familyId: any) => 
      familyId._id?.toString() || familyId.toString()
    ) || []
  };
}

// GET /api/users - Get users with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');
    const role = searchParams.get('role');
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (userId) {
      // Get specific user
      const user = await User.findById(userId)
        .populate('familyId', 'name budgetCap')
        .select('-password');
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(transformUserData(user));
    }

    // Build query
    const query: UserQuery = {};
    if (familyId) query.familyId = familyId;
    if (role && ['admin', 'member', 'view-only'].includes(role)) {
      query.role = role as 'admin' | 'member' | 'view-only';
    }
    if (email) query.email = email.toLowerCase();

    const users = await User.find(query)
      .populate('familyId', 'name budgetCap')
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json(users.map(transformUserData));
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user profile
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { userId, name, profileImage, role } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    const updateData: UpdateUserBody = {};
    if (name) updateData.name = name;
    if (profileImage) updateData.profileImage = profileImage;
    if (role && ['admin', 'member', 'view-only'].includes(role)) {
      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('familyId', 'name budgetCap')
      .select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    
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

// DELETE /api/users - Delete user
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
