import { generateToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { User, UserStatus } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log(user, "USER FOR SERVER");

    // Check if user is approved
    if (user.status !== UserStatus.APPROVED) {
      return NextResponse.json(
        {
          error: 'Account not approved',
          status: user.status,
          requiresApproval: user.status === UserStatus.PENDING,
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status,
    });

    // Set token in cookie (HttpOnly, Secure, SameSite=Strict)
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        referralCode: (user as any).referralCode,
        lastLoginAt: user.lastLoginAt,
        ...user.role === "admin" && ({
          mustChangePassword: user.mustChangePassword,
        })
      },
    });
    response.cookies.set('authToken', token, {
      httpOnly: false, // Allow client-side access for Redux store hydration
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 