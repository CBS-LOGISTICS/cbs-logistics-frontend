import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, UserRole } from '@/models/User';
import { CustomerProfile } from '@/models/CustomerProfile';
import { authenticateUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Authenticate user
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if user is the customer, their agent, or an admin
    const isOwnProfile = user.userId === id;
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role as UserRole);
    
    // Check if user is the agent who referred this customer
    const customer = await User.findById(id);
    const isReferringAgent = customer?.referredBy?.toString() === user.userId;

    if (!isOwnProfile && !isAdmin && !isReferringAgent) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get customer and profile
    const [customerData, customerProfile] = await Promise.all([
      User.findById(id)
        .select('-password -emailVerificationToken -passwordResetToken')
        .populate('referredBy', 'firstName lastName email referralCode'),
      CustomerProfile.findOne({ userId: id }),
    ]);

    if (!customerData || customerData.role !== UserRole.CUSTOMER) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    if (!customerProfile) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customer: {
        id: customerData._id,
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone,
        dateOfBirth: customerData.dateOfBirth,
        gender: customerData.gender,
        address: customerData.address,
        role: customerData.role,
        status: customerData.status,
        referredBy: customerData.referredBy,
        approvedBy: customerData.approvedBy,
        approvedAt: customerData.approvedAt,
        createdAt: customerData.createdAt,
        updatedAt: customerData.updatedAt,
      },
      profile: customerProfile,
    });

  } catch (error) {
    console.error('Get customer profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 