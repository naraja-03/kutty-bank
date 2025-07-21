export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = decoded.userId;
    // Find all families where the user is a member
    const families = await Family.find({ members: userId });
    return NextResponse.json({ families });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch family', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Family from '@/models/Family';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log('Family creation API called');
    await connectToDatabase();
    console.log('Database connected');

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token received:', !!token);
    
    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      console.log('Token decoded successfully, userId:', decoded.userId);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;

    const familyData = await request.json();
    console.log('Family data received:', JSON.stringify(familyData, null, 2));

    // Store the complete detailed budget data
    const familyRecord = {
      name: familyData.familyInfo?.name || 'Unnamed Family',
      
      // Simple totals for backward compatibility
      income: familyData.income?.totalIncome || 0,
      essentials: familyData.essentials?.totalEssentials || 0,
      commitments: familyData.commitments?.totalCommitments || 0,
      savings: familyData.savings?.totalSavings || 0,
      budgetPeriod: familyData.familyInfo?.trackingPeriod === 'daily' ? 'week' : 
                   familyData.familyInfo?.trackingPeriod === 'weekly' ? 'week' : 'month',
      
      // Store complete detailed budget data
      detailedBudget: {
        familyInfo: familyData.familyInfo,
        income: familyData.income,
        essentials: familyData.essentials,
        commitments: familyData.commitments,
        savings: familyData.savings
      },
      
      createdBy: userId,
      members: [userId],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Processed family record:', JSON.stringify(familyRecord, null, 2));

    const newFamily = new Family(familyRecord);

    console.log('Creating family with data:', JSON.stringify(newFamily.toObject(), null, 2));

    const savedFamily = await newFamily.save();
    console.log('Family saved successfully, ID:', savedFamily._id);

    // Update user with familyId and add to families array if not already present
    const user = await User.findById(userId);
    if (user) {
      user.familyId = savedFamily._id;
      
      // Add to families array if not already present
      if (!user.families.includes(savedFamily._id)) {
        user.families.push(savedFamily._id);
      }
      
      await user.save();
      console.log('User updated with familyId and families array');
    }

    return NextResponse.json({
      success: true,
      family: savedFamily,
    });

  } catch (error) {
    console.error('Family creation error:', error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { error: 'Failed to create family', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
