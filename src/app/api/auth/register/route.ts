import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, UserRole, UserStatus } from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password, firstName, lastName, phone, role, referralCode } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
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

    // Set initial status based on role
    let initialStatus = UserStatus.PENDING;
    if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
      initialStatus = UserStatus.APPROVED; // Admins are auto-approved
    }

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || UserRole.CUSTOMER,
      status: initialStatus,
      referredBy,
    });

    await user.save();

    // Generate token for auto-approved users
    let token = null;
    if (initialStatus === UserStatus.APPROVED) {
      token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        referralCode: user.referralCode,
      },
      token,
      requiresApproval: initialStatus === UserStatus.PENDING,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 