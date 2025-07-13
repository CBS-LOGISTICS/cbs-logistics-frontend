import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, UserRole, UserStatus } from '@/models/User';
import { authenticateUser, requireAdmin, AuthenticatedRequest } from '@/lib/auth';

interface UserQuery {
  role?: UserRole;
  status?: UserStatus;
  $or?: Array<{
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}

// GET /api/users - List users with filtering and pagination
export async function GET(req: NextRequest) {
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

    // Check admin permissions
    const adminCheck = await requireAdmin(req as AuthenticatedRequest);
    if (adminCheck) {
      return adminCheck;
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    const query: UserQuery = {};
    
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      query.role = role as UserRole;
    }
    
    if (status && Object.values(UserStatus).includes(status as UserStatus)) {
      query.status = status as UserStatus;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute queries
    const [users, total] = await Promise.all([
      User.find(query)
        .populate('approvedBy', 'firstName lastName email')
        .populate('rejectedBy', 'firstName lastName email')
        .populate('deactivatedBy', 'firstName lastName email')
        .populate('referredBy', 'firstName lastName email referralCode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users,
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
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create user (admin only)
export async function POST(req: NextRequest) {
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

    // Check admin permissions
    const adminCheck = await requireAdmin(req as AuthenticatedRequest);
    if (adminCheck) {
      return adminCheck;
    }

    const body = await req.json();
    const { email, password, firstName, lastName, phone, role, referralCode } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Handle referral code for customers
    let referredBy = null;
    if (role === UserRole.CUSTOMER && referralCode) {
      const referringAgent = await User.findOne({ 
        referralCode, 
        role: UserRole.AGENT, 
        status: UserStatus.APPROVED 
      });
      
      if (!referringAgent) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        );
      }
      
      referredBy = referringAgent._id;
    }

    // Create user with admin approval
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      status: UserStatus.APPROVED, // Admin-created users are auto-approved
      referredBy,
      approvedBy: user.userId,
      approvedAt: new Date(),
    });

    await newUser.save();

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        status: newUser.status,
        referralCode: newUser.referralCode,
        approvedBy: newUser.approvedBy,
        approvedAt: newUser.approvedAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 