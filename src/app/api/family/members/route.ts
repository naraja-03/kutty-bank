import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Family from '@/models/Family';
import User from '@/models/User';

interface AddMemberBody {
  familyId: string;
  email: string;
  role?: 'admin' | 'member' | 'view-only';
}

interface RemoveMemberBody {
  familyId: string;
  userId: string;
}

// POST /api/family/members - Add member to family
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body: AddMemberBody = await request.json();
    const { familyId, email, role = 'member' } = body;

    // Validate required fields
    if (!familyId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: familyId, email' },
        { status: 400 }
      );
    }

    // Check if family exists
    const family = await Family.findById(familyId);
    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'User not found with this email' }, { status: 404 });
    }

    // Check if user is already in a family
    if (user.familyId) {
      return NextResponse.json({ error: 'User is already part of a family' }, { status: 409 });
    }

    // Add user to family
    family.members.push(user._id);
    await family.save();

    // Update user's familyId and role
    user.familyId = family._id;
    user.role = role;
    await user.save();

    // Return updated family
    await family.populate('members', 'name email profileImage role');

    return NextResponse.json(family);
  } catch (error) {
    console.error('Error adding family member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/family/members - Remove member from family
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const body: RemoveMemberBody = await request.json();
    const { familyId, userId } = body;

    // Validate required fields
    if (!familyId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: familyId, userId' },
        { status: 400 }
      );
    }

    // Check if family exists
    const family = await Family.findById(familyId);
    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    // Remove user from family members
    family.members = family.members.filter(
      (memberId: (typeof family.members)[0]) => memberId.toString() !== userId
    );
    await family.save();

    // Update user's familyId
    await User.findByIdAndUpdate(userId, {
      familyId: null,
      role: 'member',
    });

    // Return updated family
    await family.populate('members', 'name email profileImage role');

    return NextResponse.json(family);
  } catch (error) {
    console.error('Error removing family member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
