import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, UserRole, UserStatus } from '@/models/User';
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
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Check if user is the agent or an admin
    const isOwnProfile = user.userId === id;
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role as UserRole);

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Verify the agent exists and is approved
    const agent = await User.findById(id);
    if (!agent || agent.role !== UserRole.AGENT) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Build query for customers
    const query: {
      referredBy: string;
      role: UserRole;
      status?: UserStatus;
    } = {
      referredBy: id,
      role: UserRole.CUSTOMER,
    };

    if (status && Object.values(UserStatus).includes(status as UserStatus)) {
      query.status = status as UserStatus;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [customers, total] = await Promise.all([
      User.find(query)
        .select('-password -emailVerificationToken -passwordResetToken')
        .populate('approvedBy', 'firstName lastName email')
        .populate('rejectedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    // TODO: Add purchase details when property/purchase models are created
    // For now, return basic customer information
    const customersWithDetails = customers.map(customer => ({
      ...customer,
      // Placeholder for purchase details
      totalPurchases: 0,
      totalSpent: 0,
      lastPurchaseDate: null,
      purchaseHistory: [],
    }));

    return NextResponse.json({
      agent: {
        id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        referralCode: agent.referralCode,
        status: agent.status,
      },
      customers: customersWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Get agent customers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 