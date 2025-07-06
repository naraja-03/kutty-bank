import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Family from '@/models/Family';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

interface CreateFamilyBody {
  name: string;
  budgetCap?: number;
  creatorId: string;
}

interface FamilyQuery {
  userId?: string;
  name?: string;
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

    // If no specific params, get current user's family
    if (!userId && !familyId) {
      const currentUser = await getUserFromToken(request);
      if (!currentUser) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      if (currentUser.familyId) {
        const family = await Family.findById(currentUser.familyId)
          .populate('members', 'name email profileImage role');
        return NextResponse.json(family);
      }
      return NextResponse.json(null);
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
      
      return NextResponse.json(family);
    }

    // Build query
    const query: FamilyQuery = {};
    
    if (userId) {
      // Find families where user is a member
      const user = await User.findById(userId);
      if (user && user.familyId) {
        const family = await Family.findById(user.familyId)
          .populate('members', 'name email profileImage role');
        return NextResponse.json(family);
      }
      return NextResponse.json(null);
    }

    // Get all families (admin only)
    const families = await Family.find(query)
      .populate('members', 'name email profileImage role')
      .sort({ createdAt: -1 });

    return NextResponse.json(families);
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
    const { name, budgetCap, creatorId } = body;

    // Validate required fields
    if (!name || !creatorId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, creatorId' },
        { status: 400 }
      );
    }

    // Check if creator exists
    const creator = await User.findById(creatorId);
    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    // Create family
    const family = new Family({
      name,
      budgetCap,
      members: [creatorId]
    });

    const savedFamily = await family.save();

    // Update creator's familyId and role
    await User.findByIdAndUpdate(creatorId, {
      familyId: savedFamily._id,
      role: 'admin'
    });

    // Populate and return
    await savedFamily.populate('members', 'name email profileImage role');

    return NextResponse.json(savedFamily, { status: 201 });
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
